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

    it('should call process.kill and process.stdin.write when process exists', () => {
        const mockKill = jest.fn();
        const mockWrite = jest.fn();
        const mockProcess = {
            kill: mockKill,
            stdin: {
                write: mockWrite,
            },
        };
        recorder.start();
        recorder.process = mockProcess;
        recorder.stop();
        expect(mockKill).toHaveBeenCalledWith('SIGINT');
        expect(mockWrite).toHaveBeenCalledWith('q\n');
    });

    describe('Stop Recording', () => {
        it('should not allow starting when recording is already in progress', () => {
            jest.spyOn(recorder, 'emit');
            recorder.isRecording = true;

            try {
                recorder.start();
            } catch (error) {
                return expect(error.message).toContain(
                    'Recording is already in progress.',
                );
            }

            return false;
        });

        it('should emit error if FFmpeg command fails with a non-signal error', () => {
            jest.spyOn(recorder, 'emit');
            exec.mockImplementation((cmd, callback) => {
                callback({ code: 123, message: 'Some FFmpeg error' });
            });

            try {
                recorder.start();
            } catch (error) {
                return expect(error.message).toContain('Some FFmpeg error');
            }

            return false;
        });

        it('should not emit error if error contains a signal (e.g., SIGTERM)', () => {
            jest.spyOn(recorder, 'emit');
            exec.mockImplementation((cmd, callback) => {
                callback({ signal: 'SIGTERM' });
            });

            recorder.start();

            expect(recorder.emit).not.toHaveBeenCalledWith(
                'error',
                expect.any(RecordingError),
            );
        });

        it('should emit an error if stderr contains the keyword "error"', () => {
            jest.spyOn(recorder, 'emit');
            exec.mockImplementation((cmd, callback) => {
                callback(null, '', 'error: FFmpeg failed to start');
            });

            try {
                recorder.start();
            } catch (error) {
                return expect(error.message).toContain(
                    'FFmpeg failed to start',
                );
            }

            return false;
        });

        it('should log stdout if verbose is true', () => {
            const consoleSpy = jest
                .spyOn(console, 'log')
                .mockImplementation(() => {});

            exec.mockImplementation((cmd, callback) => {
                callback(null, 'Recording started successfully', '');
            });

            recorder.start();

            expect(consoleSpy).toHaveBeenCalledWith(
                'FFmpeg stdout: Recording started successfully',
            );

            consoleSpy.mockRestore();
        });

        it('should handle FFmpeg command execution correctly', () => {
            jest.spyOn(recorder, '_getRecordingCommand').mockReturnValue(
                'mock-command',
            );

            exec.mockImplementation(() => ({
                kill: jest.fn(),
            }));

            recorder.start();

            expect(exec).toHaveBeenCalledWith(
                'mock-command',
                expect.any(Function),
            );

            expect(recorder.isRecording).toBe(true);
        });
    });

    describe('_validateOptions', () => {
        it('should validate all valid options successfully', () => {
            const validOptions = {
                volume: 1.0,
                codec: 'libx264',
                preset: 'ultrafast',
                resolution: '1920x1080',
                frameRate: 30,
                fileName: 'output',
                outputPath: './recordings',
            };

            expect(() => recorder._validateOptions(validOptions)).not.toThrow();
        });

        it.each([
            ['volume', -1.0, 'Invalid value for volume: -1'],
            ['codec', 'invalidCodec', 'Invalid value for codec: invalidCodec'],
            [
                'preset',
                'invalidPreset',
                'Invalid value for preset: invalidPreset',
            ],
            [
                'resolution',
                'invalidRes',
                'Invalid value for resolution: invalidRes',
            ],
            ['frameRate', -10, 'Invalid value for frameRate: -10'],
            [
                'fileName',
                'invalid/file?name',
                'Invalid value for fileName: invalid/file?name',
            ],
            [
                'outputPath',
                'invalid\\path',
                'Invalid value for outputPath: invalid\\path',
            ],
        ])(
            'should throw RecordingError for invalid %s',
            (key, value, errorMessage) => {
                const invalidOptions = {
                    volume: 1.0,
                    codec: 'libx264',
                    preset: 'ultrafast',
                    resolution: '1920x1080',
                    frameRate: 30,
                    fileName: 'output',
                    outputPath: './recordings',
                };
                invalidOptions[key] = value;

                expect(() =>
                    recorder._validateOptions(invalidOptions),
                ).toThrowError(new RecordingError(400, errorMessage));
            },
        );
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

        it('should throw an error for unsupported platforms', () => {
            const unsupportedPlatform = 'unsupportedOS';
            const audioInput = 'defaultMic';

            expect(() =>
                recorder._getAudioOptions(unsupportedPlatform, audioInput),
            ).toThrowError(
                new RecordingError(
                    400,
                    `Unsupported platform for audio: ${unsupportedPlatform}`,
                ),
            );
        });

        it('should return correct audio options for win32', () => {
            const options = recorder._getAudioOptions(
                'win32',
                'Microphone (Realtek Audio)',
            );
            expect(options).toBe(
                "-f dshow -i audio='Microphone (Realtek Audio)'",
            );
        });

        it('should return correct audio options for darwin', () => {
            const options = recorder._getAudioOptions(
                'darwin',
                'Built-in Microphone',
            );
            expect(options).toBe("-f avfoundation -i 'Built-in Microphone'");
        });

        it('should return correct audio options for linux', () => {
            const options = recorder._getAudioOptions(
                'linux',
                'alsa_input.pci-0000_00_1b.0.analog-stereo',
            );
            expect(options).toBe(
                '-f pulse -i alsa_input.pci-0000_00_1b.0.analog-stereo',
            );
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
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should execute the correct command for linux', () => {
            listDevices('linux').then(() => {
                jest.spyOn(exec, 'mockImplementation').mockImplementation(
                    (cmd) => {
                        console.log(cmd);
                        expect(cmd).toBe('pactl list sources short');
                    },
                );
            });
        });

        it('should execute the correct command for win32', () => {
            listDevices('win32').then(() => {
                jest.spyOn(exec, 'mockImplementation').mockImplementation(
                    (cmd) => {
                        expect(cmd).toBe(
                            'ffmpeg -list_devices true -f dshow -i dummy',
                        );
                    },
                );
            });
        });

        it('should execute the correct command for darwin', () => {
            listDevices('darwin').then(() => {
                jest.spyOn(exec, 'mockImplementation').mockImplementation(
                    (cmd) => {
                        expect(cmd).toBe(
                            'ffmpeg -f avfoundation -list_devices true -i ""',
                        );
                    },
                );
            });
        });

        it('should reject for unsupported platforms', () => {
            return listDevices('unknown').catch((error) => {
                expect(error).toBeInstanceOf(RecordingError);
            });
        });

        describe('listDevices', () => {
            it('should resolve with stdout if stdout exists', async () => {
                exec.mockImplementation((cmd, callback) => {
                    callback(null, 'Mock stdout', null);
                });

                const result = await listDevices('win32');
                expect(result).toBe('Mock stdout');
            });

            it('should resolve with stderr if stdout is absent and stderr exists', async () => {
                exec.mockImplementation((cmd, callback) => {
                    callback(null, null, 'Mock stderr');
                });

                const result = await listDevices('darwin');
                expect(result).toBe('Mock stderr');
            });

            it('should resolve with error if stdout and stderr are absent', async () => {
                exec.mockImplementation((cmd, callback) => {
                    callback('Mock error', null, null);
                });

                const result = await listDevices('linux');
                expect(result).toBe('Mock error');
            });

            it('should resolve with undefined if stdout, stderr, and error are absent', async () => {
                exec.mockImplementation((cmd, callback) => {
                    callback(null, null, null);
                });

                const result = await listDevices('win32');
                expect(result).toBeNull();
            });

            it('should throw an error if an unsupported platform is provided', async () => {
                await expect(listDevices('unsupported')).rejects.toThrowError(
                    new RecordingError(400, 'Unsupported platform.'),
                );
            });
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
});
