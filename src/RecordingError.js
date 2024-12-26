'use strict';

/**
 * Custom error class for handling recording errors.
 * @class
 * @extends Error
 */
class RecordingError extends Error {
    /**
     * Creates an instance of RecordingError.
     *
     * @param {number} code - The error code (e.g., 400, 404).
     * @param {string} message - The error message.
     */
    constructor(code, message) {
        super(`[${code}] ${message}`);

        this.name = 'RecordingError';
        this.code = code;
        this.timestamp = new Date();

        Error.captureStackTrace(this, RecordingError);
    }
}

module.exports = RecordingError;
