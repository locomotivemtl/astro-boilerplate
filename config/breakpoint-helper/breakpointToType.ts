import fs from 'node:fs';
import path from 'node:path';

export type BreakpointEntry = { name: string; value: number };

/**
 * Write the type declarations for the `virtual:breakpoints` module.
 *
 * Each name carries its pixel value as a doc comment, so the editor shows the actual
 * breakpoint while autocompleting.
 */
export function breakpointToType(
    breakpoints: BreakpointEntry[],
    rootDir: string = process.cwd()
): string {
    const documentedUnion = breakpoints
        .map((bp) => `\n        '${bp.name}' /** ${bp.value}px */ `)
        .join('|');

    const typeString = `/**
 * Auto-generated types for virtual:breakpoints module
 * DO NOT EDIT MANUALLY - Run \`npm run dev\` or \`npm run build\` to regenerate
 */

declare module 'virtual:breakpoints' {
    export type BreakpointName =${documentedUnion};
    export type BreakpointValues = Record<BreakpointName, number>;
    export const breakpoints: BreakpointValues;
    export const BREAKPOINT_NAMES: readonly BreakpointName[];
}
`;

    const filePath = path.join(rootDir, 'types', 'generated', 'breakpoints.d.ts');

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, typeString);
    return typeString;
}
