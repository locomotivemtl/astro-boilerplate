export type Debounce<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
export type Throttle<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

export const debounce = <T extends (...args: any[]) => void>(fn: T, ms: number): Debounce<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debounced;
};

export const throttle = <T extends (...args: any[]) => void>(fn: T, ms: number): Throttle<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const throttled = (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            if (timer) clearTimeout(timer);
            timer = null;
            fn(...args);
        }, ms);
    };

    return throttled;
};
