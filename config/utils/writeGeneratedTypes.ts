import fs from 'node:fs';
import path from 'node:path';

/** Folder, relative to the project root, that holds generated declaration files. */
export const GENERATED_TYPES_DIR = 'types/generated';

/**
 * Write `body` to `types/generated/<fileName>` under the shared auto-generated header.
 * Returns the file path relative to the project root, for logging.
 */
export function writeGeneratedTypes(
    rootDir: string,
    fileName: string,
    description: string,
    body: string,
): string {
    const content = `/**
 * Auto-generated ${description}
 * DO NOT EDIT MANUALLY - Run \`npm run dev\` or \`npm run build\` to regenerate
 */

${body}
`;
    const relativePath = path.join(GENERATED_TYPES_DIR, fileName);
    const filePath = path.join(rootDir, relativePath);

    // Any rewrite, even identical, makes the TS server reload the file
    if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf-8') === content) {
        return relativePath;
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    return relativePath;
}
