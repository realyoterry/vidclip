const fs = require('fs');
const { ensureOutputDirExists, getFilePath } = require('../src/output');
const uuid = require('uuid');

jest.mock('fs');
jest.mock('uuid');

describe('output.js', () => {
    test('ensureOutputDirExists creates the directory if it does not exist', () => {
        fs.existsSync.mockReturnValue(false);
        ensureOutputDirExists('./test');
        expect(fs.mkdirSync).toHaveBeenCalledWith('./test', {
            recursive: true,
        });
    });

    test('getFilePath includes UUID when includeUUID is true', () => {
        uuid.v4.mockReturnValue('mock-uuid');
        const filePath = getFilePath('./test', 'file', 'mp4', true);
        expect(filePath).toContain('mock-uuid');
    });

    test('getFilePath does not include UUID when includeUUID is false', () => {
        const filePath = getFilePath('./test', 'file', 'mp4', false);
        expect(
            filePath === 'test/file.mp4' || filePath === 'test\\file.mp4',
        ).toBe(true);
    });
});

test('getFilePath throws an error when fileName or format is missing', () => {
    const RecordingError = require('../src/RecordingError'); // Ensure RecordingError is imported

    expect(() => {
        getFilePath('./test', null, 'mp4', true);
    }).toThrowError(
        new RecordingError(400, 'fileName and format are required'),
    );

    expect(() => {
        getFilePath('./test', 'file', null, true);
    }).toThrowError(
        new RecordingError(400, 'fileName and format are required'),
    );
});
