import fs from 'node:fs';
import path from 'node:path';

type BreakpointEntry = { name: string; value: number };

/**
 * Generate TypeScript declaration file for virtual:breakpoints module
 */
export function breakpointToType(breakpoints: BreakpointEntry[]): string {
    // Generate documented union type with values shown in autocomplete
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
    export const BREAKPOINT_NAMES: BreakpointName[];
}
`;

    const filePath = path.join(process.cwd(), 'types/generated/breakpoints.d.ts');
    const typesDir = path.dirname(filePath);

    if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
    }

    fs.writeFileSync(filePath, typeString);
    return typeString;
}
