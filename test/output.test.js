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
