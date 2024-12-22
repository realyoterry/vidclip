const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const { exec } = require('child_process');
const { EventEmitter } = require('events');
const { getDefaultSource, getDefaultAudioSource, getPlatformInput } = require('./codec');
const { ensureOutputDirExists, getFilePath } = require('./output');

class VideoRecorder extends EventEmitter {
    constructor({
        outputPath = './recordings',
        fileName = 'output',
        format = 'mp4',
        source = null,
        frameRate = 30,
        codec = 'libx264',
        preset = 'ultrafast',
        resolution = '1920x1080',
        inputDevice = null,
        verbose = false,
        includeUUID = true,
        recordAudio = false,
        audioSource = null,
        extraArgs = []
    }) {
        super();

        this.outputPath = outputPath;
        this.fileName = fileName;
        this.format = format;
        this.source = source || getDefaultSource();
        this.frameRate = frameRate;
        this.codec = codec;
        this.preset = preset;
        this.resolution = resolution;
        this.inputDevice = inputDevice;
        this.isRecording = false;
        this.process = null;
        this.verbose = verbose;
        this.includeUUID = includeUUID;
        this.recordAudio = recordAudio;
        this.audioSource = audioSource || getDefaultAudioSource();
        this.extraArgs = extraArgs;

        ensureOutputDirExists(this.outputPath);
    }

    // Build the FFmpeg command
    getRecordingCommand(filePath) {
        const platform = require('os').platform();
        const videoInput = this.inputDevice || this.source;
        const audioInput = this.audioSource;
        const resolution = this.resolution ? `-s ${this.resolution}` : '';
        const audioOptions = this.recordAudio ? this.getAudioOptions(platform, audioInput) : '';
        const codecOptions = `-c:v ${this.codec} -preset ${this.preset} -pix_fmt yuv420p`;
        const extraArgs = this.extraArgs.join(' ');

        return `${ffmpeg} -y -f ${getPlatformInput(platform)} -framerate ${this.frameRate} -i ${videoInput} ${audioOptions} ${resolution} ${codecOptions} ${extraArgs} ${filePath}`;
    }

    getAudioOptions(platform, audioInput) {
        switch (platform) {
            case 'win32': return `-f dshow -i audio="${audioInput}"`;
            case 'darwin': return `-f avfoundation -i "${audioInput}"`;
            case 'linux': return `-f pulse -i ${audioInput}`;
            default: return '';
        }
    }

    // Start the recording process
    start() {
        if (this.isRecording) {
            this.emit('error', new Error('Recording is already in progress.'));
            return;
        }

        const filePath = getFilePath(this.outputPath, this.fileName, this.format, this.includeUUID);

        let command;

        try {
            command = this.getRecordingCommand(filePath);
        } catch (error) {
            this.emit('error', error);
            return;
        }

        if (this.verbose) {
            console.log(`Starting recording: ${filePath}`);
        }

        this.process = exec(command, (error, stdout, stderr) => {
            if (error) {
                if (error.signal) {
                    if (this.verbose) {
                        console.log('Recording stopped.');
                    }
                } else {
                    this.emit('error', new Error(`FFmpeg process failed with code: ${error.code}`));
                }

                return;
            }

            if (stderr) {
                this.emit('error', new Error(`FFmpeg stderr: ${stderr}`));
                return;
            }

            if (stdout && this.verbose) {
                console.log(`FFmpeg stdout: ${stdout}`);
            }
        });

        this.isRecording = true;
    }

    // Stop the recording process
    stop() {
        if (!this.isRecording) {
            this.emit('error', new Error('No active recording to stop.'));
            return;
        }

        if (this.process) {
            this.process.kill('SIGINT');
            this.process.stdin.write('q\n');
        }

        this.process = null;
        this.isRecording = false;

        this.emit('stop');
    }
}

module.exports = VideoRecorder;
