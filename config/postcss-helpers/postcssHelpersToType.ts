import fs from 'node:fs';
import path from 'node:path';

export function postcssHelpersToType(rootDir: string): void {
    const typesDir = path.join(rootDir, 'types');

    if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
    }

    const content = `/**
 * Auto-generated type declarations for virtual:postcss-processors
 * Do not edit manually.
 */
declare module 'virtual:postcss-processors' {
    /**
     * Process a style string through all registered PostCSS helpers.
     * Automatically detects which helpers to apply based on the content.
     */
    export function processStyle(styleString: string): string;
}
`;

    fs.writeFileSync(path.join(typesDir, 'gen-postcss-processors.d.ts'), content, 'utf-8');
}
