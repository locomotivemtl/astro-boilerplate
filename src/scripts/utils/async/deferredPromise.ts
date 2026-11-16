/** Promise whose `resolve` and `reject` are exposed so other code can settle it. */
export interface DeferredPromise<T = unknown> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
}

// Same shape as `Promise.withResolvers()`, kept for older browsers
export function deferredPromise<T = unknown>(): DeferredPromise<T> {
    let resolve!: DeferredPromise<T>['resolve'];
    let reject!: DeferredPromise<T>['reject'];

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
}
