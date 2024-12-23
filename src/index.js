/**
 * @module VideoRecorder
 * @description Module for recording video and audio using FFmpeg.
 */

'use strict';

const os = require('os');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const quote = require('./quote');
const { exec } = require('child_process');
const { EventEmitter } = require('events');
const {
    getDefaultSource,
    getDefaultAudioSource,
    getPlatformInput,
} = require('./codec');
const { ensureOutputDirExists, getFilePath } = require('./output');
const RecordingError = require('./RecordingError');

/**
 * Lists available audio devices based on the platform.
 *
 * @returns {Promise<string[]>} A promise that resolves with a list of available audio devices.
 * @throws {Error} If the platform is unsupported.
 *
 * @example
 * listAudioDevices().then(devices => {
 *   console.log(devices);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
function listAudioDevices() {
    const platform = os.platform();
    let command = '';

    switch (platform) {
        case 'win32':
            command = `${ffmpeg} -list_devices true -f dshow -i video="dummy"`;
            break;
        case 'darwin':
            command = `${ffmpeg} -f avfoundation -list_devices true -i ""`;
            break;
        case 'linux':
            command = `pactl list sources short`;
            break;
        default:
            return Promise.reject('Unsupported platform.');
    }

    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            let output = platform === 'linux' ? stdout : stderr;
            let devices = [];
            let match;

            let regex =
                platform === 'linux'
                    ? /(\d+)\s+(\w+)\s+(\w+)\s+(.+)/g
                    : /"([^"]+)"/g;

            while ((match = regex.exec(output)) !== null) {
                const deviceName = match[1];

                if (!deviceName.includes('@device')) {
                    devices.push(deviceName);
                }
            }

            resolve(devices.sort());
        });
    });
}

/**
 * VideoRecorder class for recording video with FFmpeg.
 *
 * @extends EventEmitter
 * @example
 * const recorder = new VideoRecorder({ outputPath: './videos', format: 'mp4', recordAudio: true });
 * recorder.start();
 * setTimeout(() => recorder.stop(), 5000);
 */
class VideoRecorder extends EventEmitter {
    /**
     * Creates an instance of VideoRecorder.
     *
     * @param {Object} options - Configuration options for the video recorder.
     * @param {string} [options.outputPath='./recordings'] - The directory where recordings will be saved.
     * @param {string} [options.fileName='output'] - The base filename for the recorded video.
     * @param {string} [options.format='mp4'] - The format for the output video (e.g., 'mp4').
     * @param {number} [options.frameRate=30] - The frame rate for the recording (e.g., 30).
     * @param {string} [options.codec='libx264'] - The video codec to use for recording (e.g., 'libx264').
     * @param {string} [options.preset='ultrafast'] - The encoding preset for FFmpeg (e.g., 'ultrafast').
     * @param {string} [options.resolution='1920x1080'] - The resolution of the recorded video (e.g., '1920x1080').
     * @param {boolean} [options.verbose=false] - If true, logs FFmpeg output to the console.
     * @param {boolean} [options.includeUUID=false] - If true, includes a UUID in the filename.
     * @param {boolean} [options.recordAudio=true] - If true, records audio along with the video.
     * @param {string|null} [options.audioSource=null] - The audio source for recording, null uses default.
     * @param {number} [options.volume=1.0] - The audio volume multiplier (between 0.0 and 2.0).
     * @param {Array<string>} [options.extraArgs=[]] - Additional arguments to pass to FFmpeg.
     *
     * @throws {RecordingError} Throws error if any configuration is invalid.
     *
     * @example
     * const recorder = new VideoRecorder({
     *   outputPath: './videos',
     *   fileName: 'myrecording',
     *   recordAudio: true,
     *   volume: 1.5
     * });
     * recorder.start();
     */
    constructor({
        outputPath = './recordings',
        fileName = 'output',
        format = 'mp4',
        frameRate = 30,
        codec = 'libx264',
        preset = 'ultrafast',
        resolution = '1920x1080',
        verbose = false,
        includeUUID = false,
        recordAudio = true,
        audioSource = null,
        volume = 1.0,
        extraArgs = [],
    }) {
        super();

        this._validateOptions({
            volume,
            codec,
            preset,
            resolution,
            frameRate,
            fileName,
            outputPath,
        });

        this.outputPath = outputPath;
        this.fileName = fileName;
        this.format = format;
        this.source = getDefaultSource();
        this.frameRate = frameRate;
        this.codec = codec;
        this.preset = preset;
        this.resolution = resolution;
        this.isRecording = false;
        this.process = null;
        this.verbose = verbose;
        this.includeUUID = includeUUID;
        this.recordAudio = recordAudio;
        this.audioSource = audioSource ?? getDefaultAudioSource();
        this.volume = volume;
        this.extraArgs = extraArgs;

        ensureOutputDirExists(this.outputPath);
    }

    _validateOptions(options) {
        const {
            volume,
            codec,
            preset,
            resolution,
            frameRate,
            fileName,
            outputPath,
        } = options;
        const allowedCodecs = ['libx264', 'libvpx', 'mpeg4'];
        const allowedPresets = ['ultrafast', 'fast', 'medium', 'slow'];

        if (volume < 0.0 || volume > 2.0) {
            throw new RecordingError(
                400,
                'Volume must be between 0.0 and 2.0.',
            );
        }

        if (!allowedCodecs.includes(codec)) {
            throw new RecordingError(400, `Invalid codec: ${codec}`);
        }

        if (!allowedPresets.includes(preset)) {
            throw new RecordingError(400, `Invalid preset: ${preset}`);
        }

        if (resolution && !/^\d{1,5}x\d{1,5}$/.test(resolution)) {
            throw new RecordingError(400, `Invalid resolution: ${resolution}`);
        }

        if (!Number.isInteger(frameRate) || frameRate <= 0) {
            throw new RecordingError(400, `Invalid frameRate: ${frameRate}`);
        }

        if (fileName && !/^[\w\-.]+$/.test(fileName)) {
            throw new RecordingError(400, `Invalid fileName: ${fileName}`);
        }

        if (outputPath && !/^[\w\-./]+$/.test(outputPath)) {
            throw new RecordingError(400, `Invalid outputPath: ${outputPath}`);
        }
    }

    /**
     * Builds the FFmpeg command to start the recording.
     *
     * @param {string} filePath - The path where the recording will be saved.
     * @returns {string} The FFmpeg command to execute.
     *
     * @example
     * const filePath = './recordings/output.mp4';
     * const command = recorder._getRecordingCommand(filePath);
     * console.log(command);
     */
    _getRecordingCommand(filePath) {
        const platform = os.platform();
        const videoInput = quote([this.source]);
        const audioOptions = this.recordAudio
            ? this._getAudioOptions(platform, this.audioSource).replace(
                  /'/g,
                  '"',
              )
            : '';
        const codecOptions = `-c:v ${quote([this.codec])} -preset ${quote([this.preset])} -pix_fmt yuv420p`;
        const resolution = this.resolution
            ? `-s ${quote([this.resolution])}`
            : '';
        const frameRate = quote([this.frameRate.toString()]);
        const extraArgs = this.extraArgs.map((arg) => quote([arg])).join(' ');
        const outputPath = quote([filePath]);

        return `${ffmpeg} -y -f ${getPlatformInput(platform)} -framerate ${frameRate} -i ${videoInput} ${audioOptions} ${resolution} ${codecOptions} ${extraArgs} ${outputPath}`;
    }

    /**
     * Returns the audio options for FFmpeg based on the platform and audio input.
     *
     * @param {string} platform - The operating system platform.
     * @param {string} audioInput - The audio input device.
     * @returns {string} The audio options for FFmpeg.
     *
     * @throws {RecordingError} If audio input is invalid or platform is unsupported.
     *
     * @example
     * const audioOptions = recorder._getAudioOptions('linux', 'alsa_input.pci-0000_00_1b.0.analog-stereo');
     * console.log(audioOptions);
     */
    _getAudioOptions(platform, audioInput) {
        if (!this.recordAudio) return '';

        let audioOptions = '';

        switch (platform) {
            case 'win32':
                audioOptions = `-f dshow -i audio=${quote([audioInput])}`;
                break;
            case 'darwin':
                audioOptions = `-f avfoundation -i ${quote([audioInput])}`;
                break;
            case 'linux':
                audioOptions = `-f pulse -i ${quote([audioInput])}`;
                break;
            default:
                throw new RecordingError(
                    400,
                    `Unsupported platform for audio: ${platform}`,
                );
        }

        if (this.volume !== 1.0) {
            audioOptions += ` -af "volume=${quote([this.volume.toString()])}"`;
        }

        return audioOptions;
    }

    /**
     * Starts the video recording process.
     * Emits 'error' if the recording cannot start.
     *
     * @throws {RecordingError} Throws error if recording already in progress or if FFmpeg command fails.
     *
     * @example
     * recorder.start();
     */
    start() {
        if (this.isRecording) {
            this.emit(
                'error',
                new RecordingError(409, 'Recording is already in progress.'),
            );
            return;
        }

        const filePath = getFilePath(
            this.outputPath,
            this.fileName,
            this.format,
            this.includeUUID,
        );

        let command;

        try {
            command = this._getRecordingCommand(filePath);
        } catch (error) {
            this.emit('error', new RecordingError(500, error.message));
            return;
        }

        if (this.verbose) {
            console.log(`Starting recording: ${filePath}`);
            console.log(`FFmpeg Command: ${command}`);
        }

        this.process = exec(command, (error, stdout, stderr) => {
            if (error) {
                if (error.signal === 'SIGINT') {
                    return;
                }

                this.emit(
                    'error',
                    new RecordingError(error.code ?? 500, error.message),
                );
                return;
            }

            if (stderr) {
                this.emit('error', new RecordingError(500, stderr));
                return;
            }

            if (stdout && this.verbose) {
                console.log(`FFmpeg stdout: ${stdout}`);
            }
        });

        this.isRecording = true;
    }

    /**
     * Stops the video recording process.
     * Emits 'error' if no active recording is found.
     *
     * @throws {RecordingError} Throws error if no active recording to stop.
     *
     * @example
     * recorder.stop();
     */
    stop() {
        if (!this.isRecording) {
            this.emit(
                'error',
                new RecordingError(404, 'No active recording to stop.'),
            );
            return;
        }

        try {
            if (this.process) {
                this.process.kill('SIGINT');
                this.process.stdin.write('q\n');
            }
        } catch (err) {
            this.process.kill('SIGKILL');
            this.emit(
                'error',
                new RecordingError(
                    500,
                    `Failed to stop recording: ${err.message}`,
                ),
            );
        }

        if (this.verbose) {
            console.log('Recording Finished');
        }

        this.process = null;
        this.isRecording = false;

        this.emit('stop');
    }
}

module.exports = {
    VideoRecorder,
    listAudioDevices,
};
