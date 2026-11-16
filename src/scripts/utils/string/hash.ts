/**
 * 32-bit FNV-1a hash of `str`, written in base 36. Fast and stable, not cryptographic: collisions are possible.
 */
export const hash = (str: string): string => {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193); // a plain * overflows 2^53 and loses the low bits
    }
    return (h >>> 0).toString(36);
};
