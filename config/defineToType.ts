import fs from 'node:fs';
import path from 'node:path';

import type { Define } from './defineAstroIntegration.ts';

/** Strings are raw JS expressions, so only a JSON literal gets a precise type. */
function getType(value: unknown): string {
    if (typeof value !== 'string') return typeof value;

    try {
        return typeof JSON.parse(value);
    } catch {
        return 'any';
    }
}

export function defineToType(define: Define): string {
    const declarations = Object.entries(define)
        .map(([key, value]) => `declare const ${key}: ${getType(value)};`)
        .join('\n');

    const typeString = `/**
 * Auto-generated types for Vite's \`define\` option
 * DO NOT EDIT MANUALLY - Run \`npm run dev\` or \`npm run build\` to regenerate
 */

${declarations}
`;

    const filePath = path.join(process.cwd(), 'types/generated/', `define.d.ts`);
    const typesDir = path.dirname(filePath);

    if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
    }

    fs.writeFileSync(filePath, typeString);
    return typeString;
}
