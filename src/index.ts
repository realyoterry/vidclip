import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { existsSync } from 'fs';
import { ChildProcess, spawn } from 'child_process';

const ffmpegPath = ffmpeg.path;

if (!existsSync(ffmpegPath)) {
    throw new Error('FFmpeg binary not found. Reinstalling may fix the problem.');
}

interface RecorderTypes {
    resolution?: `${number}x${number}`;
    frameRate?: 24 | 30 | 60 | 120;
    fileFormat?: 'mp4' | 'mov' | 'wmv' | 'avi' | 'mkv';
    audioSource?: string;
    outputFile?: string;
    timeOut?: number;
    replaceExisting?: boolean;
    verbose?: boolean;
}

export default class Recorder {
    private readonly config: RecorderTypes;
    private ffmpegProcess: ChildProcess | null = null;

    constructor({
        resolution,
        frameRate,
        fileFormat,
        audioSource,
        outputFile,
        timeOut,
        replaceExisting,
        verbose,
    }: RecorderTypes = {}) {
        const format = fileFormat ?? 'mp4';

        // Setup configuration
        this.config = {
            resolution: resolution ?? '1920x1080',
            frameRate: frameRate ?? 30,
            fileFormat: format,
            audioSource,
            outputFile: outputFile ?? `output.${format}`,
            timeOut,
            replaceExisting: replaceExisting ?? true,
            verbose: verbose ?? false,
        };
    }

    // Getter functions
    get getConfig(): RecorderTypes {
        return { ...this.config };
    }

    // Public functions
    public start() {
        const ffmpegArgs: string[] = [
            ...(this.config.replaceExisting ? ['-y'] : ['-n']),
            '-f', 'gdigrab',
            '-framerate', String(this.config.frameRate),
            '-video_size', this.config.resolution!,
            '-i', 'desktop',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-pix_fmt', 'yuv420p',
            '-crf', '18',
            ...(this.config.audioSource ? ['-f', 'dshow', '-i', `audio=${this.config.audioSource}`] : []),
            ...(this.config.timeOut ? ['-t', String(this.config.timeOut)] : []),
            this.config.outputFile!,
        ];

        try {
            this.ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, {
                stdio: this.config.verbose ? ['pipe', 'inherit', 'inherit'] : ['pipe', 'ignore', 'ignore'],
            });            

            this.ffmpegProcess.on('error', () => {
                return this.stop(true);
            });
        } catch(error) {
            this.stop(true);
            throw error;
        }
    }

    public stop(force?: boolean) {
        if (this.ffmpegProcess) {
            // Perform multiple checks to insure ffmpegProcess gets terminated
            this.ffmpegProcess.stdin?.write('q');
            this.ffmpegProcess.stdin?.end();
            force ? this.ffmpegProcess.kill('SIGKILL') : this.ffmpegProcess.kill('SIGINT');

            this.ffmpegProcess.on('close', (code) => {
                console.log(`ffmpegProcess closed with code ${code}.`);
                this.ffmpegProcess = null;
            });

            console.log('ffmpegProcess successfully terminated..');
        } else {
            console.warn('ffmpegProcess is undefined.');
        }
    }
}
