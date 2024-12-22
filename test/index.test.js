const VideoRecorder = require('../src/index');
const { exec } = require('child_process');

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
    test('should start a recording', () => {
        const recorder = new VideoRecorder({
            outputPath: './recordings',
            fileName: 'test',
            format: 'mp4',
            verbose: true,
        });

        recorder.start();

        expect(recorder.isRecording).toBe(true);
        expect(exec).toHaveBeenCalledWith(expect.stringContaining('ffmpeg'), expect.anything());
    });

    test('should stop a recording', () => {
        const recorder = new VideoRecorder({
            outputPath: './recordings',
            fileName: 'test',
            format: 'mp4',
            verbose: true,
        });

        recorder.start();
        recorder.stop();

        expect(exec).toHaveBeenCalledWith(expect.stringContaining('ffmpeg'), expect.anything());
        expect(recorder.isRecording).toBe(false);
    });

    test('should emit error when trying to start recording while already recording', () => {
        const recorder = new VideoRecorder({
            outputPath: './recordings',
            fileName: 'test',
        });

        recorder.start();

        expect(() => recorder.start()).toThrow('Recording is already in progress.');
    });

    test('should emit error when trying to stop without an active recording', () => {
        const recorder = new VideoRecorder({
            outputPath: './recordings',
            fileName: 'test',
        });

        expect(() => recorder.stop()).toThrow('No active recording to stop.');
    });
});
