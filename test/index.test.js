'use strict';

const { VideoRecorder } = require('../src/index');
const { exec } = require('child_process');
const RecordingError = require('../src/errors');

jest.mock('child_process');

jest.mock('../src/codec', () => ({
    getDefaultSource: jest.fn().mockReturnValue('desktop'),
    getDefaultAudioSource: jest.fn().mockReturnValue('Stereo Mix (Realtek(R) Audio)'),
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
        exec.mockClear();
    });

    test('should start a recording successfully', () => {
        recorder.start();

        expect(recorder.isRecording).toBe(true);
        expect(exec).toHaveBeenCalledWith(expect.stringContaining('ffmpeg'), expect.anything());
    });

    test('should stop a recording successfully', () => {
        recorder.start();
        recorder.stop();

        expect(exec).toHaveBeenCalledWith(expect.stringContaining('ffmpeg'), expect.anything());
        expect(recorder.isRecording).toBe(false);
    });

    test('should throw an error when starting an already active recording', () => {
        recorder.start();

        const errorListener = jest.fn();
        recorder.on('error', errorListener);

        recorder.start();

        expect(errorListener).toHaveBeenCalledWith(new RecordingError(409, 'Recording is already in progress.'));
    });

    test('should throw an error when stopping without an active recording', () => {
        const errorListener = jest.fn();
        recorder.on('error', errorListener);

        recorder.stop();

        expect(errorListener).toHaveBeenCalledWith(new RecordingError(404, 'No active recording to stop.'));
    });

    test('should log "Recording Finished" on successful stop', () => {
        console.log = jest.fn();

        recorder.start();
        recorder.stop();

        expect(console.log).toHaveBeenCalledWith('Recording Finished');
    });

    test('should validate volume range during initialization', () => {
        expect(() => {
            new VideoRecorder({ volume: 3.0 });
        }).toThrow(new RecordingError(400, 'Volume must be between 0.0 and 2.0.'));
    });

    test('should handle verbose output correctly', () => {
        console.log = jest.fn();

        recorder.start();

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Starting recording:'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('FFmpeg Command:'));
    });
});
