// if there is an error while recording make sure the
// ffmpeg process is terminated by checking task manager.

import fs from 'fs';
import os from 'os';
import path from 'path';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { ChildProcess, spawn } from 'child_process';

const ffmpegPath = ffmpeg.path;

interface RecorderTypes {
    resolution?: `${number}x${number}`;
    frameRate?: 24 | 30 | 60 | 120;
    fileFormat?: 'mp4' | 'mov' | 'wmv' | 'avi' | 'mkv';
    audioSource?: string;
    outputFile?: string;
    replaceExisting?: boolean;
    verbose?: boolean;
    rateControl?: {
        mode: 'crf' | 'cq' | 'bitrate' | 'qp';
        value: number;
    };
    codec?: 'libx264' | 'libx265' | 'libvpx-vp9' | 'h264_nvenc' | 'hevc_nvenc' | 'h264_qsv' | 'hevc_qsv' | 'hev264_amf';
    preset?: 'placebo' | 'veryslow' | 'slower' | 'slow' | 'medium' | 'fast' | 'faster' | 'veryfast' | 'superfast' | 'ultrafast';
    pixelFormat?: 'yuv420p' | 'yuv422p' | 'yuv444p' | 'rgb24' | 'gray' | 'nv12';
}

export class Recorder {
    private readonly config: RecorderTypes;
    private ffmpegProcess: ChildProcess | null = null;
    public isRecording = false;

    constructor({
        resolution,
        frameRate,
        fileFormat,
        audioSource,
        outputFile,
        replaceExisting,
        verbose,
        rateControl,
        codec,
        preset,
        pixelFormat,
    }: RecorderTypes = {}) {
        const format = fileFormat ?? 'mp4';

        // config object
        this.config = {
            resolution: resolution ?? '1920x1080',
            frameRate: frameRate ?? 30,
            fileFormat: format,
            audioSource,
            outputFile: outputFile ?? `recordings/recording.${format}`,
            replaceExisting: replaceExisting ?? true,
            verbose: verbose ?? false,
            rateControl: rateControl ?? { mode: 'crf', value: 18 },
            codec: codec ?? 'libx264',
            preset: preset ?? 'fast',
            pixelFormat: pixelFormat ?? 'yuv420p',
        };

        const dir = path.dirname(this.config.outputFile!);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    // get functions
    get getConfig(): RecorderTypes {
        return { ...this.config };
    }

    // public functions
    public start({ stopAfter }: { stopAfter?: number } = {}) {
        const platform = os.platform();
        const ffmpegArgs: string[] = [];

        // prettier-ignore
        ffmpegArgs.push(
            ...(this.config.replaceExisting ? ['-y'] : ['-n']),
            '-f',
            platform === 'win32' ? 'gdigrab' : platform === 'darwin' ? 'avfoundation' : 'x11grab',
            '-framerate', String(this.config.frameRate),
            '-video_size', this.config.resolution!,
            '-i',
            platform === 'darwin' ? '1' : platform === 'win32' ? 'desktop' : ':0.0',
            '-c:v', this.config.codec!,
            '-preset', this.config.preset!,
            '-pix_fmt', this.config.pixelFormat!,
            ...(this.config.rateControl
                ? [
                    this.config.rateControl.mode === 'crf' ? '-crf' :
                    this.config.rateControl.mode === 'cq' ? '-cq' :
                    this.config.rateControl.mode === 'bitrate' ? '-b:v' :
                    this.config.rateControl.mode === 'qp' ? '-qp' : '',
                    this.config.rateControl.mode === 'bitrate'
                        ? `${this.config.rateControl.value}k`
                        : String(this.config.rateControl.value)
                  ]
                : []),
            ...(this.config.audioSource ? platform === 'win32' ? ['-f', 'dshow', '-i', `audio=${this.config.audioSource}`] : platform === 'darwin' ? ['-f', 'avfoundation', '-i', this.config.audioSource] : ['-f', 'pulse', '-i', 'default'] : []),
            ...(stopAfter ? ['-t', String(stopAfter)] : []),
            this.config.outputFile!
        );

        try {
            this.ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, {
                stdio: this.config.verbose ? ['pipe', 'inherit', 'inherit'] : ['pipe', 'ignore', 'ignore'],
            });

            this.isRecording = true;

            this.ffmpegProcess.on('error', (error) => {
                console.error(`ffmpegProcess error: ${error.message}`);
                return this.stop(true);
            });
        } catch (error) {
            this.stop(true);
            throw error;
        }
    }

    public stop(force?: boolean) {
        this.isRecording = false;

        if (this.ffmpegProcess) {
            // perform multiple checks so ffmpegProcess gets terminated
            force ? this.ffmpegProcess.kill('SIGKILL') : this.ffmpegProcess.kill('SIGINT');
            this.ffmpegProcess.stdin?.write('q');
            this.ffmpegProcess.stdin?.end();
            this.ffmpegProcess = null;

            console.log('ffmpegProcess successfully terminated.');
        } else {
            console.warn('ffmpegProcess is nullish.');
        }
    }
}
