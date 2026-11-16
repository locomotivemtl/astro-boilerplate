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
 * Waits for one or more macrotasks (`setTimeout(0)`), so the current call stack and pending
 * microtasks clear first.
 * @param times - Number of macrotasks to wait (default: 1)
 * @example
 * ```ts
 * await nextMacrotask(); // Wait 1 macrotask
 * await nextMacrotask(3); // Wait 3 macrotasks
 * ```
 */
export const nextMacrotask = async (times = 1): Promise<void> => {
    for (let i = 0; i < times; i++) {
        await wait(0);
    }
};

/** Waits until the current synchronous code ends, before any macrotask or render. */
export const nextMicrotask = (): Promise<void> => new Promise<void>((r) => queueMicrotask(r));
