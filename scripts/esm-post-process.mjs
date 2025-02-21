import fs from 'fs/promises';
import path from 'path';
import { glob, globIterate } from 'glob';

const rootDir = 'lib';

(async () => {
    const matches = await glob(`${rootDir}/**/*.js`);

    for (const path of matches) {
        await buildEsm(path);
    }

    for (const path of matches) {
        await fs.unlink(path);
    }
})();

(async () => {
    for await (const path of globIterate(`${rootDir}/**/*.d.ts`)) {
        await buildEsm(path);
    }
})();

/**
 * @param {string} filePath
 */
async function buildEsm(filePath) {
    const pathParts = filePath.split('.');
    const fileExt = pathParts.pop();

    const file = await fs.readFile(path.join(process.cwd(), filePath));
    let content = file.toString();

    if (fileExt === 'js' || fileExt === 'ts') {
        for (const match of content.matchAll(/from '(\.?\.\/[^']*)'/g)) {
            const [statement, relImportPath] = match;
            const absImportPath = path.resolve(
                process.cwd(),
                path.dirname(filePath),
                relImportPath,
            );

            try {
                await fs.stat(absImportPath + '.js');
                content = content.replace(statement, `from '${relImportPath}.mjs'`);
            } catch {
                content = content.replace(
                    statement,
                    `from '${relImportPath}/index.mjs'`,
                );
            }
        }
    }

    const esmFilePath = pathParts.join('.') + '.m' + fileExt;
    await fs.writeFile(esmFilePath, content);
}
