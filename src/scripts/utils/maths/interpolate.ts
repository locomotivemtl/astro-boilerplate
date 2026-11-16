const DAMP_RATE_PER_MS = 0.05; // t = 0.1 halves the gap to end in about 140ms

/**
 * Linear step from `start` to `end`. When `precision` is above 0, snaps to `end` once closer than `precision`.
 *
 * @example
 * lerp(0, 10, 0.5) // 5, a plain half-way step
 */
export const lerp = (start: number, end: number, t: number, precision: number = 0): number => {
    const value = start * (1 - t) + end * t;

    if (!precision) {
        return value;
    }
    return Math.abs(end - value) < precision ? end : value;
};

/**
 * Frame-rate independent easing towards `end`. `dt` is the elapsed time in milliseconds and `t` is the speed (`t` × 50 per second).
 *
 * @example
 * damp(x, target, 0.08, dt, 0) // frame-rate independent easing
 * damp(x, target, 0.08, dt, 0.001) // that also settles exactly
 */
export const damp = (
    start: number,
    end: number,
    t: number,
    dt: number,
    precision: number = 0.0001,
): number => {
    const k = 1 - Math.exp(-t * DAMP_RATE_PER_MS * Math.max(dt, 0));
    return lerp(start, end, k, precision);
};
