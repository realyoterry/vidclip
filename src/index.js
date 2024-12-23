'use strict';

const os = require('os');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const { exec } = require('child_process');
const { EventEmitter } = require('events');
const { getDefaultSource, getDefaultAudioSource, getPlatformInput } = require('./codec');
const { ensureOutputDirExists, getFilePath } = require('./output');
const RecordingError = require('./errors');

/**
 * VideoRecorder class for recording video with FFmpeg.
 * @extends EventEmitter
 */
class VideoRecorder extends EventEmitter {
    /**
     * Creates an instance of VideoRecorder.
     * @param {Object} options - Configuration options for the video recorder.
     * @param {string} [options.outputPath='./recordings'] - The directory where recordings will be saved.
     * @param {string} [options.fileName='output'] - The base filename for the recorded video.
     * @param {string} [options.format='mp4'] - The format for the output video.
     * @param {number} [options.frameRate=30] - The frame rate for the recording.
     * @param {string} [options.codec='libx264'] - The video codec to use for recording.
     * @param {string} [options.preset='ultrafast'] - The encoding preset for FFmpeg.
     * @param {string} [options.resolution='1920x1080'] - The resolution of the recorded video.
     * @param {boolean} [options.verbose=false] - If true, logs FFmpeg output to the console.
     * @param {boolean} [options.includeUUID=true] - If true, includes a UUID in the filename.
     * @param {boolean} [options.recordAudio=false] - If true, records audio along with the video.
     * @param {string|null} [options.audioSource=null] - The audio source for recording, null uses default.
     * @param {number} [options.volume=1.0] - The audio volume multiplier. Has to be between 0.0 and 2.0.
     * @param {Array<string>} [options.extraArgs=[]] - Additional arguments to pass to FFmpeg.
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
        includeUUID = true,
        recordAudio = false,
        audioSource = null,
        volume = 1.0,
        extraArgs = [],
    }) {
        super();

        if (volume < 0.0 || volume > 2.0) {
            throw new RecordingError(400, 'Volume must be between 0.0 and 2.0.');
        }

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

    /**
     * Builds the FFmpeg command to start the recording.
     * @param {string} filePath - The path where the recording will be saved.
     * @returns {string} The FFmpeg command to execute.
     */
    getRecordingCommand(filePath) {
        const platform = os.platform();
        const videoInput = this.source;
        const audioInput = this.audioSource;
        const resolution = this.resolution ? `-s ${this.resolution}` : '';
        const audioOptions = this.recordAudio ? this.getAudioOptions(platform, audioInput) : '';
        const codecOptions = `-c:v ${this.codec} -preset ${this.preset} -pix_fmt yuv420p`;
        const extraArgs = this.extraArgs.join(' ');

        return `${ffmpeg} -y -f ${getPlatformInput(platform)} -framerate ${this.frameRate} -i ${videoInput} ${audioOptions} ${resolution} ${codecOptions} ${extraArgs} ${filePath}`;
    }

    /**
     * Returns the audio options for FFmpeg based on the platform and audio input.
     * @param {string} platform - The operating system platform.
     * @param {string} audioInput - The audio input device.
     * @returns {string} The audio options for FFmpeg.
     */
    getAudioOptions(platform, audioInput) {
        let audioOptions = '';
        
        switch (platform) {
            case 'win32': 
                audioOptions = `-f dshow -i audio="${audioInput}"`; 
                break;
            case 'darwin': 
                audioOptions = `-f avfoundation -i "${audioInput}"`; 
                break;
            case 'linux': 
                audioOptions = `-f pulse -i ${audioInput}`; 
                break;
            default: 
                audioOptions = '';
                break;
        }

        if (this.volume !== 1.0) {
            audioOptions += ` -af "volume=${this.volume}"`;
        }

        return audioOptions;
    }

    /**
     * Starts the video recording process.
     * Emits 'error' if the recording cannot start.
     */
    start() {
        if (this.isRecording) {
            this.emit('error', new RecordingError(409, 'Recording is already in progress.'));
            return;
        }

        const filePath = getFilePath(this.outputPath, this.fileName, this.format, this.includeUUID);

        let command;

        try {
            command = this.getRecordingCommand(filePath);
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

                this.emit('error', new RecordingError(error.code ?? 500, error.message));
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
     */
    stop() {
        if (!this.isRecording) {
            this.emit('error', new RecordingError(404, 'No active recording to stop.'));
            return;
        }

        if (this.process) {
            this.process.kill('SIGINT');
            this.process.stdin.write('q\n');
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
};
