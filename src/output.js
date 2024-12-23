'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Ensures that the output directory exists. Creates the directory if it doesn't exist.
 * @param {string} outputPath - The path of the output directory to check and create if necessary.
 */
function ensureOutputDirExists(outputPath) {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
}

/**
 * Generates the full file path for the output file.
 * @param {string} outputPath - The directory where the file will be saved.
 * @param {string} fileName - The base name of the file (without extension).
 * @param {string} format - The format/extension of the file (e.g., 'mp4').
 * @param {boolean} includeUUID - Whether to include a UUID in the file name.
 * @returns {string} The full path of the file including the file name and extension.
 */
function getFilePath(outputPath, fileName, format, includeUUID) {
    const finalFileName = includeUUID
        ? `${fileName}_${require('uuid').v4()}.${format}`
        : `${fileName}.${format}`;
    return path.join(outputPath, finalFileName);
}

module.exports = {
    ensureOutputDirExists,
    getFilePath
};
