const fs = require('fs');
const { ensureOutputDirExists, getFilePath } = require('../src/output');
const uuid = require('uuid');
const RecordingError = require('../src/RecordingError');

jest.mock('fs');
jest.mock('uuid');

describe('output.js', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('ensureOutputDirExists creates the directory if it does not exist', () => {
        fs.existsSync.mockReturnValue(false);

        ensureOutputDirExists('./test');

        expect(fs.existsSync).toHaveBeenCalledWith('./test');
        expect(fs.mkdirSync).toHaveBeenCalledWith('./test', {
            recursive: true,
        });
    });

    test('ensureOutputDirExists does not create the directory if it already exists', () => {
        fs.existsSync.mockReturnValue(true);

        ensureOutputDirExists('./test');

        expect(fs.existsSync).toHaveBeenCalledWith('./test');
        expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    test('getFilePath includes UUID when includeUUID is true', () => {
        uuid.v4.mockReturnValue('mock-uuid');

        const filePath = getFilePath('./test', 'file', 'mp4', true);

        expect(filePath).toMatch(/file_mock-uuid\.mp4$/);
    });

    test('getFilePath does not include UUID when includeUUID is false', () => {
        const filePath = getFilePath('./test', 'file', 'mp4', false);

        expect(filePath).toMatch(/file\.mp4$/);
    });

    test('getFilePath throws an error when fileName or format is missing', () => {
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
});
