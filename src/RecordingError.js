'use strict';

/**
 * Custom error class for handling recording errors.
 * @class
 * @extends Error
 */
class RecordingError extends Error {
    /**
     * Creates an instance of the RecordingError.
     * @param {string|number} code - The error code to identify the specific error.
     * @param {string} message - The error message that describes the error.
     */
    constructor(code, message) {
        super(message);
        this.name = 'RecordingError';
        this.code = code;
        Error.captureStackTrace(this, RecordingError);
    }
}

module.exports = RecordingError;
