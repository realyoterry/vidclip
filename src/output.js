const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
function ensureOutputDirExists(outputPath) {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
}

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
