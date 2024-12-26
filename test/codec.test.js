'use strict';

const os = require('os');
const RecordingError = require('../src/RecordingError');
const {
    getDefaultSource,
    getDefaultAudioSource,
    getPlatformInput,
} = require('../src/codec');

jest.mock('os');

describe('Platform Defaults Module', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDefaultSource', () => {
        test('should return correct source for Windows', () => {
            os.platform.mockReturnValue('win32');
            expect(getDefaultSource()).toBe('desktop');
        });

        test('should return correct source for macOS', () => {
            os.platform.mockReturnValue('darwin');
            expect(getDefaultSource()).toBe('0:');
        });

        test('should return correct source for Linux', () => {
            os.platform.mockReturnValue('linux');
            expect(getDefaultSource()).toBe(':0.0');
        });

        test('should throw error for unsupported platform', () => {
            os.platform.mockReturnValue('unsupported');
            expect(() => getDefaultSource()).toThrow(RecordingError);
            expect(() => getDefaultSource()).toThrow(
                'Unsupported platform: unsupported',
            );
        });
    });

    describe('getDefaultAudioSource', () => {
        test('should return correct audio source for Windows', () => {
            os.platform.mockReturnValue('win32');
            expect(getDefaultAudioSource()).toBe(
                'Stereo Mix (Realtek(R) Audio)',
            );
        });

        test('should return correct audio source for macOS', () => {
            os.platform.mockReturnValue('darwin');
            expect(getDefaultAudioSource()).toBe('1');
        });

        test('should return correct audio source for Linux', () => {
            os.platform.mockReturnValue('linux');
            expect(getDefaultAudioSource()).toBe('pulse');
        });

        test('should throw error for unsupported platform', () => {
            os.platform.mockReturnValue('unsupported');
            expect(() => getDefaultAudioSource()).toThrow(RecordingError);
            expect(() => getDefaultAudioSource()).toThrow(
                'Unsupported platform: unsupported',
            );
        });
    });

    describe('getPlatformInput', () => {
        test('should return correct input for Windows', () => {
            os.platform.mockReturnValue('win32');
            expect(getPlatformInput()).toBe('gdigrab');
        });

        test('should return correct input for macOS', () => {
            os.platform.mockReturnValue('darwin');
            expect(getPlatformInput()).toBe('avfoundation');
        });

        test('should return correct input for Linux', () => {
            os.platform.mockReturnValue('linux');
            expect(getPlatformInput()).toBe('x11grab');
        });

        test('should throw error for unsupported platform', () => {
            os.platform.mockReturnValue('unsupported');
            expect(() => getPlatformInput()).toThrow(RecordingError);
            expect(() => getPlatformInput()).toThrow(
                'Unsupported platform: unsupported',
            );
        });
    });
});
