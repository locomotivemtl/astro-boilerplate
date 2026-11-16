/** Rounds `value` to `decimals` places. */
export const roundToDecimal = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    // The nudge makes 1.005 round to 1.01
    return Math.round((value + Number.EPSILON) * factor) / factor;
};
