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
        jest.resetModules();
        Object.defineProperty(process, 'platform', {
            value: process.platform, // Reset to original value
        });
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

    describe('listDevices', () => {
        it('should list devices on Windows', async () => {
            Object.defineProperty(process, 'platform', { value: 'win32' });
            exec.mockImplementation((cmd, callback) => {
                callback(null, 'Windows audio devices');
            });

            const devices = await listDevices();
            expect(devices).toContain('Windows audio devices');
            expect(exec).toHaveBeenCalledWith(
                expect.stringContaining('-list_devices true -f dshow -i dummy'),
                expect.anything(),
            );
        });

        it('should list devices on macOS', async () => {
            exec.mockImplementation((cmd, callback) => {
                callback(null, 'macOS audio devices');
            });

            const devices = await listDevices('darwin');
            expect(devices).toContain('macOS audio devices');
            expect(exec).toHaveBeenCalledWith(
                expect.stringContaining(
                    '-f avfoundation -list_devices true -i ""',
                ),
                expect.anything(),
            );
        });

        it('should throw an error for unsupported platforms', async () => {
            await expect(listDevices('unsupported')).rejects.toThrow(
                new RecordingError(400, 'Unsupported platform.'),
            );
        });
    });

    describe('Constructor Defaults', () => {
        it('should set default values correctly', () => {
            const recorder = new VideoRecorder({});
            expect(recorder.outputPath).toBe('./recordings');
            expect(recorder.fileName).toBe('output');
            expect(recorder.format).toBe('mp4');
            expect(recorder.verbose).toBe(false);
        });
    });

    describe('Configuration Validation', () => {
        it('should throw an error for invalid volume', () => {
            expect(() => {
                new VideoRecorder({ volume: 3 });
            }).toThrow(new RecordingError(400, 'Invalid value for volume: 3'));
        });

        it('should throw an error for invalid codec', () => {
            expect(() => {
                new VideoRecorder({ codec: 'invalid_codec' });
            }).toThrow(
                new RecordingError(
                    400,
                    'Invalid value for codec: invalid_codec',
                ),
            );
        });
    });

    describe('Audio Options', () => {
        it('should generate audio options for Windows', () => {
            Object.defineProperty(process, 'platform', { value: 'win32' });
            const options = recorder._getAudioOptions('win32', 'Stereo Mix');
            expect(options).toContain("-f dshow -i audio='Stereo Mix'");
        });

        it('should generate audio options for macOS', () => {
            Object.defineProperty(process, 'platform', { value: 'darwin' });
            const options = recorder._getAudioOptions(
                'darwin',
                'Built-in Microphone',
            );
            expect(options).toContain(
                "-f avfoundation -i 'Built-in Microphone'",
            );
        });

        it('should generate audio options for Linux', () => {
            Object.defineProperty(process, 'platform', { value: 'linux' });
            const options = recorder._getAudioOptions('linux', 'pulse');
            expect(options).toContain('-f pulse -i pulse');
        });
    });

    describe('FFmpeg Process Error Handling', () => {
        it('should emit an error if FFmpeg command fails', () => {
            exec.mockImplementation((cmd, callback) => {
                callback({ signal: 'SIGTERM' });
            });

            const errorSpy = jest.fn();
            recorder.on('error', errorSpy);
            recorder.start();

            expect(errorSpy).not.toHaveBeenCalled();
        });
    });
});
