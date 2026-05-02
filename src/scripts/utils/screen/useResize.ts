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

export interface UseResizeInstance {
    width: number;
    height: number;
    ratio: number;
    start: () => void;
    stop: () => void;
    destroy: () => void;
}

export interface UseResizeOptions {
    onUpdate?: (api: UseResizeInstance) => void;
    onDebouncedUpdate?: (api: UseResizeInstance) => void;
    debounceTime?: number;
    autoStart?: boolean;
}

export function useResize($el: HTMLElement, options?: UseResizeOptions): UseResizeInstance {
    const {
        onUpdate = () => {},
        onDebouncedUpdate = () => {},
        debounceTime = 200,
        autoStart = true
    } = options || {};

    let width = $el.clientWidth || 0;
    let height = $el.clientHeight || 0;
    let ratio = width / height || 0;

    const resizeObserver = new ResizeObserver(updateSize);
    const debouncedUpdate = debounce(onDebouncedUpdate, debounceTime);

    const api = {
        observer: resizeObserver,
        get width() {
            return width;
        },
        get height() {
            return height;
        },
        get ratio() {
            return ratio;
        },
        start,
        stop,
        destroy
    };

    if (autoStart) start();

    return api;

    function updateSize(entries: ResizeObserverEntry[]) {
        const entry = entries[0];
        if (!entry) return;

        const contentBoxSize = entry.contentRect;
        const newWidth = contentBoxSize.width || $el.clientWidth || 0;
        const newHeight = contentBoxSize.height || $el.clientHeight || 0;
        const newRatio = newWidth / newHeight || 0;

        const hasChanged = newWidth !== width || newHeight !== height || newRatio !== ratio;

        if (hasChanged) {
            width = newWidth;
            height = newHeight;
            ratio = newRatio;
            callCallbacks();
        }
    }

    function callCallbacks() {
        onUpdate(api);
        debouncedUpdate(api);
    }

    function start() {
        // Ensure we don't observe multiple times
        resizeObserver.unobserve($el);
        resizeObserver.observe($el);
        callCallbacks();
    }

    function stop() {
        resizeObserver.unobserve($el);
        debouncedUpdate.cancel();
    }

    function destroy() {
        stop();
        resizeObserver.disconnect();
    }
}
