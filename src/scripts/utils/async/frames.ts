/**
 * Helpers on `requestAnimationFrame`. Like rAF itself, they pause while the tab is hidden and resume
 * when the user returns.
 */

/**
 * Resolves once the next frame has painted. The first `requestAnimationFrame` runs before that
 * paint, the second one after it.
 * @example
 * ```ts
 * el.classList.add('is-ready');
 * await nextFrame(); // styles are now applied on screen
 * ```
 */
export const nextFrame = (): Promise<void> =>
    new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Waits `ms` milliseconds on animation frames instead of `setTimeout`, so it resolves on a frame.
 * Always waits at least one frame, even for `ms <= 0`.
 * @param ms - Number of milliseconds to wait
 * @example
 * ```ts
 * await rafWait(1000);
 * ```
 */
export const rafWait = (ms: number): Promise<void> =>
    new Promise<void>((resolve) => {
        const start = performance.now();

        const loop = (now: number) => {
            if (now - start >= ms) {
                resolve();
            } else {
                requestAnimationFrame(loop);
            }
        };

        requestAnimationFrame(loop);
    });

/**
 * Calls `cb` every `ms` milliseconds on animation frames. The first call happens after `ms`, like
 * `setInterval`. `cb` receives `cancel` so it can stop the loop itself.
 * @param cb - Called on each interval; receives `cancel`
 * @param ms - Interval in milliseconds
 * @returns Object with `cancel` to stop the loop
 * @example
 * ```ts
 * const interval = rafSetInterval((cancel) => {
 *   if (someCondition) cancel();
 * }, 100);
 *
 * interval.cancel();
 * ```
 */
export const rafSetInterval = (
    cb: (cancel: () => void) => void,
    ms: number,
): { cancel: () => void } => {
    let rafId = 0;
    let last: number | undefined;

    const cancel = () => cancelAnimationFrame(rafId);

    const loop = (now: number) => {
        // Schedule first: `cancel()` inside `cb` drops this frame, and a throwing `cb` keeps the loop alive like `setInterval`
        rafId = requestAnimationFrame(loop);
        last ??= now;
        const elapsed = now - last;
        if (elapsed < ms) {
            return;
        }
        // Keep the remainder so the average interval stays on `ms` instead of rounding up to whole frames
        last = ms > 0 ? now - (elapsed % ms) : now;
        cb(cancel);
    };

    rafId = requestAnimationFrame(loop);

    return { cancel };
};
