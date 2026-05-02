import { clamp } from '@scripts/utils/maths.ts';

/**
 * Lightens a color (hex or rgb/rgba) for dark mode
 * @param color - Color string (hex or rgb/rgba)
 * @param amount - Lightening factor between 0 and 1 (0 = no change, 1 = white)
 */
export const lighten = (color: string, amount: number = 0.3): string => {
    // Clamp amount between 0 and 1
    const factor = clamp(amount);

    if (factor === 0) return color; // No change needed

    // Handle rgba/rgb colors
    if (color.startsWith('rgba') || color.startsWith('rgb')) {
        const match = color.match(/rgba?\(([^)]+)\)/);
        if (match) {
            const values = match[1].split(',').map((v) => v.trim());
            const r = Math.round(parseInt(values[0]) + (255 - parseInt(values[0])) * factor);
            const g = Math.round(parseInt(values[1]) + (255 - parseInt(values[1])) * factor);
            const b = Math.round(parseInt(values[2]) + (255 - parseInt(values[2])) * factor);
            const alpha = values[3] || '0.2'; // Preserve alpha if present, default to 0.2
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }

    // Handle hex colors
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const lightenedR = Math.round(r + (255 - r) * factor);
        const lightenedG = Math.round(g + (255 - g) * factor);
        const lightenedB = Math.round(b + (255 - b) * factor);
        return `#${lightenedR.toString(16).padStart(2, '0')}${lightenedG.toString(16).padStart(2, '0')}${lightenedB.toString(16).padStart(2, '0')}`;
    }

    // Fallback: return as is
    return color;
};
