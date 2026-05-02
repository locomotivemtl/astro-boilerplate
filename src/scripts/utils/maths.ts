export const clamp = (value: number, min: number = 0, max: number = 1) => {
    return Math.max(min, Math.min(value, max));
};

export const map = (value: number, min: number, max: number, nmin: number, nmax: number) => {
    return ((value - min) / (max - min)) * (nmax - nmin) + nmin;
};

export function mapClamp(
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
): number {
    const v = start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    let min = start2;
    let max = stop2;
    if (start2 > stop2) {
        min = stop2;
        max = start2;
    }
    return Math.max(min, Math.min(max, v));
}

export const normalize = (value: number, min: number, max: number) => {
    return clamp((value - min) / (max - min), 0, 1);
};

export const roundToDecimals = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
};

export function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}
export function lerpPrecise(start: number, end: number, t: number, limit: number = 0.001): number {
    const v = start * (1 - t) + end * t;
    return Math.abs(end - v) < limit ? end : v;
}
export function damp(a: number, b: number, smoothing: number, dt: number): number {
    return lerp(a, b, 1 - Math.exp(-smoothing * 0.05 * Math.max(dt, 0)));
}
export function dampPrecise(
    a: number,
    b: number,
    smoothing: number,
    dt: number,
    limit: number = 0.001
): number {
    return lerpPrecise(a, b, 1 - Math.exp(-smoothing * 0.05 * Math.max(dt, 0)), limit);
}

/**
 * Mathematical modulo operation that always returns a positive result.
 * Unlike JavaScript's % operator, this handles negative dividends correctly.
 * @example mod(-1, 3) = 2 (whereas -1 % 3 = -1)
 */
export const mod = (dividend: number, divisor: number): number => {
    return ((dividend % divisor) + divisor) % divisor;
};

export const smoothstep = (x: number, min: number, max: number): number => {
    const t = clamp((x - min) / (max - min), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
};

export function symmetricMod(value: number, base: number): number {
    let m = value % base;
    if (Math.abs(m) > base / 2) {
        m = m > 0 ? m - base : m + base;
    }
    return m;
}

export function yoyo(value: number): number {
    return 1 - Math.abs(2 * value - 1);
}

export function average(values: number[]) {
    let val = 0;
    const len = values.length;
    for (let i = 0; i < len; i++) val += values[i];
    return val / len;
}

export function median(values: number[] = []) {
    const numbers = values.slice(0).sort((a, b) => a - b);
    const middle = Math.floor(numbers.length / 2);
    const isEven = numbers.length % 2 === 0;
    return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
}
