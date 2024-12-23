const {
    getDefaultSource,
    getDefaultAudioSource,
    getPlatformInput,
} = require('../src/codec');
const os = require('os');

jest.mock('os', () => ({
    platform: jest.fn(),
}));

describe('codec.js', () => {
    test('getDefaultSource returns correct value based on OS', () => {
        os.platform.mockReturnValue('win32');
        expect(getDefaultSource()).toBe('desktop');

        os.platform.mockReturnValue('darwin');
        expect(getDefaultSource()).toBe('0:');

        os.platform.mockReturnValue('linux');
        expect(getDefaultSource()).toBe(':0.0');

        os.platform.mockReturnValue('unknown');
        expect(() => getDefaultSource()).toThrowError(
            'Unsupported platform for recording.',
        );
    });

    test('getDefaultAudioSource returns correct value based on OS', () => {
        os.platform.mockReturnValue('win32');
        expect(getDefaultAudioSource()).toBe('Stereo Mix (Realtek(R) Audio)');

        os.platform.mockReturnValue('darwin');
        expect(getDefaultAudioSource()).toBe('1');

        os.platform.mockReturnValue('linux');
        expect(getDefaultAudioSource()).toBe('pulse');

        os.platform.mockReturnValue('unknown');
        expect(() => getDefaultAudioSource()).toThrowError(
            'Unsupported platform for capturing audio.',
        );
    });

    test('getPlatformInput returns correct value based on OS', () => {
        os.platform.mockReturnValue('win32');
        expect(getPlatformInput('win32')).toBe('gdigrab');

        os.platform.mockReturnValue('darwin');
        expect(getPlatformInput('darwin')).toBe('avfoundation');

        os.platform.mockReturnValue('linux');
        expect(getPlatformInput('linux')).toBe('x11grab');

        os.platform.mockReturnValue('unknown');
        expect(() => getPlatformInput('unknown')).toThrowError(
            'Unsupported platform for recording.',
        );
    });
});
