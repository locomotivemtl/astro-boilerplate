import { map } from 'nanostores';
import { useScreen } from '@scripts/utils/screen/useScreen.ts';

export type ScreenValues = {
    width: number;
    height: number;
    dpr: number;
    ratio: number;
};

export const $screen = map<ScreenValues>({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
    ratio: window.innerWidth / window.innerHeight
});

export const $screenDebounce = map<ScreenValues>({
    ...$screen.get()
});

// Use useScreen hook to watch for screen changes
useScreen({
    onUpdate: (api) => {
        $screen.set({
            width: api.width,
            height: api.height,
            dpr: api.dpr,
            ratio: api.ratio
        });
    },
    onDebouncedUpdate: (api) => {
        $screenDebounce.set({
            width: api.width,
            height: api.height,
            dpr: api.dpr,
            ratio: api.ratio
        });
    },
    debounceTime: 200
});
