// import { debounce } from '@scripts/utils/async/debounce.ts';

/* Hotfix for the PR */
/* Will be imported from '@scripts/utils/async/debounce.ts' */
export type Debounce<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
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

export interface UseScreenInstance {
    width: number;
    height: number;
    ratio: number;
    dpr: number;
    start: () => void;
    stop: () => void;
}

export interface UseScreenOptions {
    onUpdate?: (api: UseScreenInstance) => void;
    onDebouncedUpdate?: (api: UseScreenInstance) => void;
    debounceTime?: number;
}

export function useScreen(options: UseScreenOptions = {}): UseScreenInstance {
    const { onUpdate = () => {}, onDebouncedUpdate = () => {}, debounceTime = 200 } = options;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let ratio = width / height;

    const debouncedUpdate = debounce(onDebouncedUpdate, debounceTime);

    const api = {
        get width() {
            return width;
        },
        get height() {
            return height;
        },
        get ratio() {
            return ratio;
        },
        get dpr() {
            return window.devicePixelRatio ?? 1;
        },
        start,
        stop
    };

    start();

    return api;

    function callCallbacks() {
        onUpdate(api);
        debouncedUpdate(api);
    }

    function updateScreen() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const newRatio = newWidth / newHeight;

        const hasChanged = newWidth !== width || newHeight !== height || newRatio !== ratio;

        if (hasChanged) {
            width = newWidth;
            height = newHeight;
            ratio = newRatio;
            callCallbacks();
        }
    }

    function start() {
        window.addEventListener('resize', updateScreen);
        window.addEventListener('orientationchange', updateScreen);
        callCallbacks();
    }

    function stop() {
        window.removeEventListener('resize', updateScreen);
        window.removeEventListener('orientationchange', updateScreen);
        debouncedUpdate.cancel();
    }
}
