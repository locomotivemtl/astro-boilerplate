/** Wrapped function whose pending call can be dropped with `cancel()`. */
export type Cancelable<A extends unknown[]> = ((...args: A) => void) & { cancel: () => void };

/**
 * Delays `fn` until `ms` milliseconds pass without a new call, then runs it once with the latest arguments.
 */
export const debounce = <A extends unknown[]>(
    fn: (...args: A) => void,
    ms: number,
): Cancelable<A> => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const debounced = (...args: A) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };

    debounced.cancel = () => {
        clearTimeout(timer);
        timer = undefined;
    };

    return debounced;
};

/**
 * Runs `fn` at most once every `ms` milliseconds. The first call runs right away; calls inside the
 * window collapse into one trailing call with the latest arguments.
 */
export const throttle = <A extends unknown[]>(
    fn: (...args: A) => void,
    ms: number,
): Cancelable<A> => {
    let last = -Infinity;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: A | undefined;

    const flush = () => {
        timer = undefined;
        if (!pending) {
            return;
        }
        const args = pending;
        pending = undefined;
        last = performance.now();
        fn(...args);
    };

    const throttled = (...args: A) => {
        pending = args;
        if (timer !== undefined) {
            return;
        }
        const remaining = last + ms - performance.now();
        if (remaining <= 0) {
            flush();
            return;
        }
        timer = setTimeout(flush, remaining);
    };

    throttled.cancel = () => {
        clearTimeout(timer);
        timer = undefined;
        pending = undefined;
    };

    return throttled;
};
