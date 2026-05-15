import fs from 'node:fs';
import path from 'node:path';

import type { DefineValue } from './definesAstroIntegration';

export function defineToType(defines: Record<string, DefineValue>): string {
    const declarations = Object.entries(defines)
        .map(([key, value]) => `declare const ${key}: ${typeof value};`)
        .join('\n');

    const typeString = `/**
 * Auto-generated types for Vite defines
 * DO NOT EDIT MANUALLY - Run \`npm run dev\` or \`npm run build\` to regenerate
 */

${declarations}
`;

    const filePath = path.join(process.cwd(), 'types/generated/', `defines.d.ts`);
    const typesDir = path.dirname(filePath);

    if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
    }

    fs.writeFileSync(filePath, typeString);
    return typeString;
}
