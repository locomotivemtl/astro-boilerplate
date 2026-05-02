// Extraction of resolve / reject are made outside of the promise
// to avoid recreating a function each time the promise is created.
export interface DeferredPromise<T = PromiseLike<unknown>> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
export type DeferredPromiseResolve<T = unknown> = (value: T | PromiseLike<T>) => void;
export type DeferredPromiseReject = (reason?: any) => void;

export function deferredPromise<T = unknown>(): DeferredPromise<T> {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve: resolve!, reject: reject! };
}
