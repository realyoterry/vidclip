'use strict';

const os = require('os');
const RecordingError = require('./RecordingError'); // Importing the RecordingError class

/**
 * Gets the default screen source based on the operating system.
 * @returns {string} The default screen source string for FFmpeg.
 * @throws {RecordingError} If the platform is unsupported.
 * @example
 * const source = getDefaultSource();
 * console.log(source);
 */
function getDefaultSource() {
    const platform = os.platform();
    switch (platform) {
        case 'win32':
            return 'desktop'; // Windows default screen
        case 'darwin':
            return '0:'; // macOS default screen
        case 'linux':
            return ':0.0'; // Linux default screen
        default:
            throw new RecordingError(
                400,
                'Unsupported platform for recording.',
            ); // Throw RecordingError
    }
}

/**
 * Gets the default audio source based on the operating system.
 * @returns {string} The default audio source string for FFmpeg or null if not applicable.
 * @throws {RecordingError} If the platform is unsupported.
 * @example
 * const audioSource = getDefaultAudioSource();
 * console.log(audioSource);
 */
function getDefaultAudioSource() {
    const platform = os.platform();
    switch (platform) {
        case 'win32':
            return 'Stereo Mix (Realtek(R) Audio)'; // Windows default audio input
        case 'darwin':
            return '1'; // macOS default audio input
        case 'linux':
            return 'pulse'; // PulseAudio on Linux
        default:
            throw new RecordingError(
                400,
                'Unsupported platform for capturing audio.',
            );
    }
}

/**
 * Gets the platform-specific FFmpeg input type.
 * @param {string} platform - The operating system platform.
 * @returns {string} The FFmpeg input type string based on the platform.
 * @throws {RecordingError} If the platform is unsupported.
 * @example
 * const platformInput = getPlatformInput('win32');
 * console.log(platformInput);
 */
function getPlatformInput(platform) {
    switch (platform) {
        case 'win32':
            return 'gdigrab'; // Windows screen capture input
        case 'darwin':
            return 'avfoundation'; // macOS screen capture input
        case 'linux':
            return 'x11grab'; // Linux screen capture input
        default:
            throw new RecordingError(
                400,
                'Unsupported platform for recording.',
            );
    }
}

module.exports = {
    getDefaultSource,
    getDefaultAudioSource,
    getPlatformInput,
};
