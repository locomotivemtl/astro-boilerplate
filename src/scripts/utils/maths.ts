const mapRange = (min: number, max: number, nmin: number, nmax: number, value: number) => {
    return ((value - min) / (max - min)) * (nmax - nmin) + nmin;
};

const clamp = (value: number, min: number = 0, max: number = 1) => {
    return Math.max(min, Math.min(value, max));
};

const normalize = (min: number, max: number, value: number) => {
    return clamp(0, 1, (value - min) / (max - min));
};

const roundToDecimals = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
};

export { mapRange, clamp, normalize, roundToDecimals };
