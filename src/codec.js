'use strict';

const RecordingError = require('./RecordingError');
const os = require('os');

/**
 * Retrieves the default platform-specific value for a given key.
 *
 * @param {string} key - The key to retrieve the default value for (e.g., 'source', 'audio', 'input').
 * @returns {string} The platform-specific default value.
 * @throws {RecordingError} Throws an error if the platform is unsupported.
 *
 * @example
 * const source = getPlatformDefault('source');
 * console.log(source);
 */
function getPlatformDefault(key) {
    const platform = os.platform();

    if (!platformDefaults[platform]) {
        throw new RecordingError(400, `Unsupported platform: ${platform}`);
    }
    return platformDefaults[platform][key];
}

/**
 * Returns the default video source based on the platform.
 *
 * @returns {string} The default video source.
 */
function getDefaultSource() {
    return getPlatformDefault('source');
}

/**
 * Returns the default audio source based on the platform.
 *
 * @returns {string} The default audio source.
 */
function getDefaultAudioSource() {
    return getPlatformDefault('audio');
}

/**
 * Returns the platform-specific input format for FFmpeg.
 *
 * @returns {string} The platform-specific input format.
 */
function getPlatformInput() {
    return getPlatformDefault('input');
}

module.exports = {
    getDefaultSource,
    getDefaultAudioSource,
    getPlatformInput,
};
