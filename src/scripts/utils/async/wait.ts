/**
 * Waits for a specified number of milliseconds using setTimeout.
 * @param ms - Number of milliseconds to wait
 * @returns Promise that resolves after the specified duration
 * @example
 * ```ts
 * await wait(1000); // Wait 1 second
 * ```
 */
export const wait = (ms: number): Promise<void> => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Waits for the next animation frame using requestAnimationFrame.
 * Useful for waiting until the browser is ready to render the next frame.
 * @returns Promise that resolves with null on the next animation frame
 * @example
 * ```ts
 * await nextFrame(); // Wait for next frame before continuing
 * ```
 */
export const nextFrame = (): Promise<null> =>
    new Promise<null>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));

/**
 * Waits for one or more event loop ticks using setTimeout(0).
 * Useful for deferring execution until after the current call stack clears.
 * @param times - Number of ticks to wait (default: 0, which means 1 tick)
 * @returns Promise that resolves after the specified number of ticks
 * @example
 * ```ts
 * await nextTick(); // Wait 1 tick
 * await nextTick(3); // Wait 3 ticks
 * ```
 */
export const nextTick = (times = 0): Promise<void> => {
    if (times > 0) {
        return new Promise<void>((r) => setTimeout(() => nextTick(times - 1).then(r), 0));
    }
    return new Promise<void>((r) => setTimeout(r, 0));
};

export const nextMicrotask = (): Promise<void> => {
    return new Promise<void>((r) => queueMicrotask(r));
};

/**
 * Creates an interval that runs a callback at a specified interval using requestAnimationFrame.
 * More accurate than setInterval for frame-based animations as it syncs with the browser's refresh rate.
 * The callback receives a cancel function that can be used to stop the interval.
 *
 * **Important**: Unlike `setInterval`, the callback will not fire while the user is away from the page
 * (tab is inactive/backgrounded). Once the user returns to the page, the callback will resume and fire
 * as expected. This behavior matches the browser's requestAnimationFrame API.
 * @param cb - Callback function that receives a cancel function as its parameter
 * @param ms - Interval duration in milliseconds
 * @returns Object with a cancel method to stop the interval
 * @example
 * ```ts
 * const interval = rafSetInterval((cancel) => {
 *   console.log('Running every 100ms');
 *   if (someCondition) cancel(); // Stop the interval
 * }, 100);
 *
 * // Later, stop it manually
 * interval.cancel();
 * ```
 */
export const rafSetInterval = (
    cb: (cancel: () => void) => void,
    ms: number
): { cancel: () => void } => {
    let rafid: number | undefined;
    let last: number = 0;
    let isCanceled = false;

    const cancel = () => {
        isCanceled = true;
    };

    const loop = () => {
        const now = performance.now();
        const elapsed = now - last;

        if (elapsed >= ms) {
            cb(cancel);
            last = now;
        }

        if (isCanceled) return rafid && cancelAnimationFrame(rafid);

        rafid = requestAnimationFrame(loop);
    };

    rafid = requestAnimationFrame(loop);

    return { cancel };
};

/**
 * Waits for a specified duration using requestAnimationFrame instead of setTimeout.
 * More accurate for frame-based timing as it syncs with the browser's refresh rate.
 * Automatically cleans up the animation frame request if the promise is rejected or canceled.
 *
 * **Important**: Unlike `setTimeout`, the promise will not resolve while the user is away from the page
 * (tab is inactive/backgrounded). Once the user returns to the page, the promise will resolve as expected.
 * This behavior matches the browser's requestAnimationFrame API.
 * @param ms - Number of milliseconds to wait
 * @returns Promise that resolves after the specified duration
 * @example
 * ```ts
 * await rafWait(1000); // Wait 1 second using RAF
 * ```
 */
export const rafWait = async (ms: number): Promise<void> => {
    let rafid: number | undefined;

    try {
        return await new Promise<void>((resolve) => {
            let start: number | null = null;

            const loop = (t_1: number) => {
                if (start === null) start = t_1;
                const elapsed = t_1 - start;

                if (elapsed >= ms) {
                    resolve();
                } else {
                    rafid = requestAnimationFrame(loop);
                }
            };

            rafid = requestAnimationFrame(loop);
        });
    } finally {
        if (rafid !== undefined) cancelAnimationFrame(rafid);
    }
};
