import fs from 'node:fs';

let uid = 0;

/**
 * Get TypeScript type from a JSON stringified value
 */
function getTypeFromValue(value: string): string {
    try {
        const parsed = JSON.parse(value);
        return typeof parsed;
    } catch {
        // If it's not valid JSON, treat as string
        return 'string';
    }
}

export function defineToType(
    defines: Record<string, string> = {},
    filename: string = `gen-types-${uid++}`
): string {
    const typeString = `${Object.entries(defines)
        .map(([key, value]) => `declare const ${key}: ${getTypeFromValue(value)};`)
        .join('\n')}`;
    const path = `types/gen-${filename}.d.ts`;
    fs.writeFileSync(path, typeString);
    return typeString;
}
