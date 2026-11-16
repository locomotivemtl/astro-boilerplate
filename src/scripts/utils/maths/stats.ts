/** Mean of `values`. Returns NaN for an empty array. */
export const average = (values: number[]): number => {
    let sum = 0;
    const len = values.length;
    for (let i = 0; i < len; i++) {
        sum += values[i];
    }
    return sum / len;
};

/** Middle value of `values`, or the mean of the two middle values. Returns NaN for an empty array. */
export const median = (values: number[]): number => {
    const sorted = values.toSorted((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    const isEven = sorted.length % 2 === 0;
    return isEven ? (sorted[middle] + sorted[middle - 1]) / 2 : sorted[middle];
};
