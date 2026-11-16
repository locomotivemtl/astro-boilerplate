/**
 * Modulo that always returns a positive result, unlike the `%` operator.
 *
 * @example mod(-1, 3) === 2, whereas -1 % 3 === -1
 */
export const mod = (dividend: number, divisor: number): number => {
    return ((dividend % divisor) + divisor) % divisor;
};

/**
 * Wraps `value` into [-base/2, base/2], e.g. the shortest signed angle difference with base `TAU`.
 */
export const symmetricMod = (value: number, base: number): number => {
    let m = value % base;
    if (Math.abs(m) > base / 2) {
        m = m > 0 ? m - base : m + base;
    }
    return m;
};
