export type BreakpointEntry = { name: string; value: number };

/**
 * Build the type declarations for the `virtual:breakpoints` module.
 *
 * Each name carries its pixel value as a doc comment, so the editor shows the actual
 * breakpoint while autocompleting.
 */
export function breakpointToType(breakpoints: BreakpointEntry[]): string {
    const documentedUnion =
        breakpoints.length === 0
            ? ' never'
            : breakpoints.map((bp) => `\n        '${bp.name}' /** ${bp.value}px */ `).join('|');

    return `declare module 'virtual:breakpoints' {
    export type BreakpointName =${documentedUnion};
    export type BreakpointValues = Record<BreakpointName, number>;
    export const breakpoints: BreakpointValues;
    export const BREAKPOINT_NAMES: readonly BreakpointName[];
}`;
}
