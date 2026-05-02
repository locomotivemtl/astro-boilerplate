export interface UseDPRInstance {
    value: number;
    start: () => void;
    stop: () => void;
}

export function useDPR(onUpdate: (value: number) => void = () => {}): UseDPRInstance {
    let pixelRatio = window.devicePixelRatio || 1;
    let mediaQueryList: MediaQueryList | null = null;

    const api = {
        get value() {
            return pixelRatio;
        },
        start,
        stop
    };

    start();

    function updatePixelRatio() {
        pixelRatio = window.devicePixelRatio || 1;
        onUpdate(pixelRatio);
        setupMediaQuery();
    }

    function setupMediaQuery() {
        stop();

        const query = `(resolution: ${pixelRatio}dppx)`;
        mediaQueryList = window.matchMedia(query);
        mediaQueryList.addEventListener('change', updatePixelRatio);
    }

    function start() {
        setupMediaQuery();
        updatePixelRatio();
    }

    function stop() {
        mediaQueryList?.removeEventListener('change', updatePixelRatio);
        mediaQueryList = null;
    }

    return api;
}
