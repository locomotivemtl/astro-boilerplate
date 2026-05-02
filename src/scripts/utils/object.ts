/**
 * Deletes a nested property from an object using a dot-separated key path.
 *
 * @param obj - The object from which to delete the property.
 * @param key - The dot-separated key path (ex: "a.b.c") or a single key.
 * @returns `true` if the property was found and deleted, `false` otherwise.
 *
 * @example
 * Deleting a nested property
 * * const obj = { a: { b: { c: 42 } } };
 * * ddv(obj, 'a.b.c'); // returns true
 * obj is now { a: { b: {} } }
 *
 * @example
 * Attempting to delete a non-existent property
 * & const obj = { a: { b: {} } };
 * ddv(obj, 'a.b.c'); // returns false
 * obj remains { a: { b: {} } }
 */
export function ddv(obj: Record<string, any>, key: string): boolean {
    const keys = key.split ? key.split('.') : key;
    const l = keys.length;
    for (let i = 0; i < l - 1; i++) {
        const k = keys[i];
        if (typeof obj[k] !== 'object' || obj[k] === null) {
            return false;
        }
        obj = obj[k];
    }

    const lastKey = keys[l - 1];
    if (obj && lastKey in obj) {
        delete obj[lastKey];
        return true;
    }

    return false;
}

/**
 * Deeply retrieves the value at a given path from an object.
 *
 * The path is specified as a dot-separated string (ex: "a.b.c").
 * If the resolved value is `undefined`, the provided default value is returned.
 *
 * @param obj - The object to query.
 * @param key - The dot-separated path string or array of keys.
 * @param def - The default value to return if the resolved value is `undefined`. Defaults to `null`.
 * @param p - Internal parameter for recursion (should not be set manually).
 * @param undef - Internal parameter representing `undefined` (should not be set manually).
 * @returns The value at the specified path, or the default value if not found.
 *
 * @example
 * Basic usage
 * const obj = { a: { b: { c: 42 } } };
 * dlv(obj, 'a.b.c'); // returns 42
 *
 * @example
 * Using a default value
 * const obj = { a: { b: {} } };
 * dlv(obj, 'a.b.c', 'not found'); // returns 'not found'
 *
 * @example
 * Accessing a top-level property
 * const obj = { foo: 'bar' };
 * dlv(obj, 'foo'); // returns 'bar'
 */
// https://github.com/developit/dlv?tab=readme-ov-file
export function dlv(
    obj: Record<string, any>,
    key: string,
    def: any = null,
    p = 0,
    undef: any = undefined
) {
    const keys = key.split ? key.split('.') : key;
    for (p = 0; p < keys.length; p++) {
        obj = obj ? obj[keys[p]] : undef;
    }
    return obj === undef ? def : obj;
}

/**
 * Sets or deletes a value in a nested object using a dot-separated key path.
 *
 * @param obj - The target object to modify.
 * @param key - The dot-separated key path (ex: "a.b.c") or a single key.
 * @param value - The value to set at the specified key path. If `undefined`, the property is deleted.
 * @returns The modified object.
 *
 * @example
 * Setting a value
 * * const obj = {};
 * * dsv(obj, 'a.b.c', 42);
 * obj is now { a: { b: { c: 42 } } }
 *
 * @example
 * Deleting a value
 * * dsv(obj, 'a.b.c', undefined);
 * obj is now { a: { b: {} } }
 */
export function dsv(obj: Record<string, any>, key: string, value: any) {
    if (value === undefined) {
        ddv(obj, key);
        return obj;
    }

    const keys = key.split ? key.split('.') : key;
    const l = keys.length;
    for (let i = 0; i < l - 1; i++) {
        const k = keys[i];
        if (typeof obj[k] !== 'object' || obj[k] === null) {
            obj[k] = {};
        }
        obj = obj[k];
    }

    obj[keys[l - 1]] = value;

    return obj;
}
