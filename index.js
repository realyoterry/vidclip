const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

class VideoRecorder {
    constructor({
        outputPath = './recordings',
        fileName = 'output',
        format = 'mp4',
        source = null,
        frameRate = 30,
        codec = 'libx264',
        preset = 'ultrafast',
        resolution = '1920x1080',
        inputDevice = null
    }) {
        this.outputPath = outputPath;
        this.fileName = fileName;
        this.format = format;
        this.source = source || this.getDefaultSource();
        this.frameRate = frameRate;
        this.codec = codec;
        this.preset = preset;
        this.resolution = resolution;
        this.inputDevice = inputDevice;
        this.isRecording = false;
        this.process = null;

        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
    }

    // Get the default screen source based on the OS
    getDefaultSource() {
        const platform = os.platform();
        switch (platform) {
            case 'win32':
                return 'desktop';
            case 'darwin':
                return '0:'; // Default screen capture on macOS
            case 'linux':
                return ':0.0'; // Default screen capture on Linux
            default:
                throw new Error('Unsupported platform for recording.');
        }
    }

    // Build the FFmpeg command with all customization options
    getRecordingCommand(filePath) {
        const platform = os.platform();
        let input = this.inputDevice || this.source; // Use custom input device if provided
        let resolution = this.resolution ? `-s ${this.resolution}` : ''; // Use resolution if provided

        switch (platform) {
            case 'win32':
                return `${ffmpeg} -y -f gdigrab -framerate ${this.frameRate} -i ${input} ${resolution} -c:v ${this.codec} -preset ${this.preset} -pix_fmt yuv420p ${filePath}`;
            case 'darwin':
                return `${ffmpeg} -y -f avfoundation -framerate ${this.frameRate} -i "${input}" ${resolution} -c:v ${this.codec} -preset ${this.preset} -pix_fmt yuv420p ${filePath}`;
            case 'linux':
                return `${ffmpeg} -y -f x11grab -framerate ${this.frameRate} -i ${input} ${resolution} -c:v ${this.codec} -preset ${this.preset} -pix_fmt yuv420p ${filePath}`;
            default:
                throw new Error('Unsupported platform for recording.');
        }
    }

    // Start the recording process
    start() {
        if (this.isRecording) {
            console.log('Recording is already in progress.');
            return;
        }

        const filePath = path.join(this.outputPath, `${this.fileName}.${this.format}`);
        let command;

        try {
            command = this.getRecordingCommand(filePath);
        } catch (error) {
            console.error(error.message);
            return;
        }

        this.process = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`FFmpeg stderr: ${stderr}`);
            }
        });

        this.isRecording = true;
        console.log('Recording started...');
    }

    // Stop the recording process
    stop() {
        if (!this.isRecording) {
            console.log('No active recording to stop.');
            return;
        }

        if (this.process) {
            this.process.kill('SIGINT');
        }
        this.isRecording = false;
        console.log('Recording stopped.');
    }
}

module.exports = VideoRecorder;

const recorder = new VideoRecorder({
    outputPath: './videos',
    fileName: 'custom_video',
    format: 'mp4',
    frameRate: 60,
    codec: 'libx265',
    preset: 'fast',
    resolution: '1920x1080',
    source: 'desktop',
});
recorder.start();
setTimeout(() => recorder.stop(), 10000);
