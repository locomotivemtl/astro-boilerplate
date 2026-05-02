/**
 * Based on this benchmark of string to number conversion:
 * @see https://phrogz.net/js/string_to_number.html
 */

/**
 * Converts a given value to a floating-point number.
 *
 * If the value is already a number, it is returned as-is.
 * If the value is a string, it attempts to parse it as a float.
 * If parsing fails or the value is of another type, the provided default value is returned.
 *
 * @param value - The value to convert to a float. Can be of any type.
 * @param defaultValue - The default number to return if conversion is not possible.
 * @returns The converted floating-point number, or the default value if conversion fails.
 */
export const float = (value: any, defaultValue: number): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        if (value.trim() === '') return defaultValue;
        if (value.includes('px')) value = value.replace('px', '');
        const parsed = value * 1;
        return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
};

export const nullFloat = (value: any): number | null => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        // @ts-expect-error - value is a string
        const parsed = value * 1;
        return isNaN(parsed) ? null : parsed;
    }
    return null;
};

/**
 * Converts a given value to an integer.
 *
 * If the value is already an integer, it is returned as-is.
 * If the value is a string, it attempts to parse it as an integer.
 * If parsing fails or the value is of another type, the provided default value is returned.
 *
 * @param value - The value to convert to an integer. Can be of any type.
 * @param defaultValue - The default integer to return if conversion is not possible.
 * @returns The converted integer number, or the default value if conversion fails.
 */
export const integer = (value: any, defaultValue: number): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseInt(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
};

/**
 * Converts a given value to a boolean.
 *
 * - If the value is already a boolean, it is returned as-is.
 * - If the value is a string, returns `true` for "true" (case-insensitive), `false` for "false".
 * - If the value is a number, returns `true` if the number is greater than 0, otherwise `false`.
 * - For any other type, returns the provided `defaultValue`.
 *
 * @param value - The value to convert to boolean.
 * @param defaultValue - The default boolean value to return if conversion is not possible.
 * @returns The converted boolean value.
 */
export const boolean = (value: any, defaultValue: boolean): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    }
    if (typeof value === 'number') return value > 0;
    return defaultValue;
};
