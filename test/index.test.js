'use strict';

const { VideoRecorder, listDevices } = require('../src/index');
const { exec } = require('child_process');
const RecordingError = require('../src/RecordingError');

jest.mock('child_process');

jest.setTimeout(10000);

jest.mock('../src/codec', () => ({
    getDefaultSource: jest.fn().mockReturnValue('desktop'),
    getDefaultAudioSource: jest
        .fn()
        .mockReturnValue('Stereo Mix (Realtek(R) Audio)'),
    getPlatformInput: jest.fn().mockReturnValue('gdigrab'),
}));

jest.mock('../src/output', () => ({
    ensureOutputDirExists: jest.fn(),
    getFilePath: jest.fn().mockReturnValue('./test/output.mp4'),
}));

describe('VideoRecorder', () => {
    let recorder;

    beforeEach(() => {
        recorder = new VideoRecorder({
            outputPath: './recordings',
            fileName: 'test',
            format: 'mp4',
            verbose: true,
        });
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (recorder.process) {
            recorder.process.kill();
        }
        jest.restoreAllMocks();
    });

    describe('Recording Control', () => {
        it('should start a recording successfully', () => {
            recorder.start();
            expect(recorder.isRecording).toBe(true);
            expect(exec).toHaveBeenCalledWith(
                expect.stringContaining('ffmpeg'),
                expect.anything(),
            );
        });

        it('should stop a recording successfully', () => {
            recorder.start();
            recorder.stop();
            expect(exec).toHaveBeenCalledWith(
                expect.stringContaining('ffmpeg'),
                expect.anything(),
            );
            expect(recorder.isRecording).toBe(false);
        });

        it('should throw an error when starting an already active recording', () => {
            recorder.start();
            const errorListener = jest.fn();
            recorder.on('error', errorListener);
            recorder.start();
            expect(errorListener).toHaveBeenCalledWith(
                new RecordingError(409, 'Recording is already in progress.'),
            );
        });

        it('should throw an error when stopping without an active recording', () => {
            const errorListener = jest.fn();
            recorder.on('error', errorListener);
            recorder.stop();
            expect(errorListener).toHaveBeenCalledWith(
                new RecordingError(404, 'No active recording to stop.'),
            );
        });
    });

    describe('Audio and Video Options', () => {
        it('should include resolution if set', () => {
            recorder.resolution = '1920x1080';
            const command = recorder._getRecordingCommand('output.mp4');
            expect(command).toContain('-s 1920x1080');
        });

        it('should include volume filter if volume is not 1.0', () => {
            recorder.volume = 1.5;
            const audioOptions = recorder._getAudioOptions('linux', 'pulse');
            expect(audioOptions).toContain('-af "volume=1.5"');
        });
    });

    describe('Error Handling', () => {
        it('should emit error if _getRecordingCommand fails', () => {
            jest.spyOn(recorder, '_getRecordingCommand').mockImplementation(
                () => {
                    throw new Error('Command error');
                },
            );
            const errorSpy = jest.fn();
            recorder.on('error', errorSpy);
            recorder.start();
            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe('Audio Device Parsing', () => {
        it('should parse audio devices correctly on linux', async () => {
            jest.spyOn(exec, 'mockImplementation').mockImplementation(
                (cmd, callback) => {
                    callback(
                        null,
                        '0 alsa_output.pci-0000_00_1b.0.analog-stereo\n1 alsa_input.usb_device',
                        '',
                    );
                },
            );

            listDevices().then((devices) => {
                expect(devices).toEqual([
                    'alsa_output.pci-0000_00_1b.0.analog-stereo',
                    'alsa_input.usb_device',
                ]);
            });
        });
    });
});
