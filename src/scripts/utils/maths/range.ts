/** Holds `value` between `min` and `max`. */
export const clamp = (value: number, min: number = 0, max: number = 1): number => {
    return Math.max(min, Math.min(value, max));
};

/** Maps `value` from the range `inMin..inMax` to the range `outMin..outMax`, without clamping. */
export const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
): number => {
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

/** Like `mapRange`, held inside the output range. Works when `outMin` is greater than `outMax`. */
export const mapClamp = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
): number => {
    return clamp(
        mapRange(value, inMin, inMax, outMin, outMax),
        Math.min(outMin, outMax),
        Math.max(outMin, outMax),
    );
};

/** Progress of `value` between `min` and `max`, from 0 to 1. Returns 0 or 1 when `min` equals `max`. */
export const normalize = (value: number, min: number, max: number): number => {
    // An element with zero height would otherwise give NaN
    if (min === max) {
        return value < min ? 0 : 1;
    }
    return clamp((value - min) / (max - min));
};

/** Smooth 0..1 ease between `min` and `max`. GLSL `smoothstep(min, max, value)` with the value first. */
export const smoothstep = (value: number, min: number, max: number): number => {
    const t = normalize(value, min, max);
    return t * t * (3 - 2 * t);
};

/** Folds a 0..1 progress into 0..1..0. */
export const yoyo = (value: number): number => {
    return 1 - Math.abs(2 * value - 1);
};
