import type { Define } from './defineAstroIntegration.ts';

/** Strings are raw JS expressions, so only a JSON literal gets a precise type. */
function getType(value: unknown): string {
    if (typeof value !== 'string') {
        return typeof value;
    }

    try {
        return typeof JSON.parse(value);
    } catch {
        return 'any';
    }
}

export function defineToType(define: Define): string {
    return Object.entries(define)
        .map(([key, value]) => `declare const ${key}: ${getType(value)};`)
        .join('\n');
}
