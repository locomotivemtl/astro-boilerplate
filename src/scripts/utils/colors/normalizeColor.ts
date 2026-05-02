/**
 * Normalizes color input (hex or rgb) to CSS color string
 */
export function normalizeColor(color: string): string {
    // If it's already rgb/rgba, return as is
    if (color.startsWith('rgb')) {
        color = color.replace(/rgba?\(([^)]+)\)/, (_, contents) => {
            // Ensure RGB values are separated by commas
            const values = contents.split(/[\s,]+/).map((v: string) => v.trim());
            return `rgb(${values.join(', ')})`;
        });
        return color;
    }

    // If it's hex in 0x format, convert to # format
    if (color.startsWith('0x')) {
        return `#${color.slice(2)}`;
    }

    // If it's hex, ensure it has # prefix
    if (color.startsWith('#')) {
        return color;
    }

    // If it's hex without #, add it
    if (/^[0-9A-Fa-f]{6}$/.test(color)) {
        return `#${color}`;
    }

    // Fallback: return as is (might be a CSS color name)
    return color;
}
