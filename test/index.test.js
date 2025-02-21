const { Recorder }= require('../lib/index.js');
const { spawn } = require('child_process');

jest.mock('child_process', () => {
    const mockProcess = {
        on: jest.fn(),
        stdin: { write: jest.fn(), end: jest.fn() },
        kill: jest.fn(),
    };

    return { spawn: jest.fn(() => mockProcess) };
});

describe('Recorder Class', () => {
    let recorder;

    beforeEach(() => {
        recorder = new Recorder({ verbose: true, frameRate: 60 });
    });

    test('should initialize with default config if no options provided', () => {
        const defaultRecorder = new Recorder();
        expect(defaultRecorder.getConfig).toMatchObject({
            resolution: '1920x1080',
            frameRate: 30,
            fileFormat: 'mp4',
            replaceExisting: true,
            verbose: false
        });
    });

    test('should apply provided configuration options', () => {
        expect(recorder.getConfig).toMatchObject({
            frameRate: 60,
            fileFormat: 'mp4',
            verbose: true
        });
    });

    test('should start the recording process', () => {
        recorder.start();
        expect(spawn).toHaveBeenCalled();
    });

    test('should stop the recording process gracefully', () => {
        recorder.start();
        recorder.stop();
        expect(spawn().kill).toHaveBeenCalledWith('SIGINT');
    });

    test('should force kill the recording process when needed', () => {
        recorder.start();
        recorder.stop(true);
        expect(spawn().kill).toHaveBeenCalledWith('SIGKILL');
    });

    test('should log a warning when stop is called without starting', () => {
        console.warn = jest.fn();
        recorder.stop();
        expect(console.warn).toHaveBeenCalledWith('ffmpegProcess is undefined.');
    });

    test('should log and set ffmpegProcess to null when closed', () => {
        console.log = jest.fn();
        recorder.start();
        expect(recorder.ffmpegProcess).not.toBeNull();
        recorder.stop();
        expect(console.log).toHaveBeenCalledWith('ffmpegProcess successfully terminated.');
        expect(recorder.ffmpegProcess).toBeNull();
    });

    test('should handle errors emitted by the ffmpeg process', () => {
        recorder.start();
        expect(spawn().on).toHaveBeenCalledWith('error', expect.any(Function));

        const errorHandler = spawn().on.mock.calls.find(call => call[0] === 'error')[1];
        expect(() => errorHandler()).not.toThrow();
        expect(spawn().kill).toHaveBeenCalledWith('SIGKILL');
    });

    test('should catch and rethrow errors when starting the process', () => {
        const stopSpy = jest.spyOn(recorder, 'stop');
        spawn.mockImplementation(() => { throw new Error('Spawn failed'); });
        expect(() => recorder.start()).toThrow('Spawn failed');
        expect(stopSpy).toHaveBeenCalledWith(true);
    });
});
