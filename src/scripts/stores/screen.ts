import { map } from 'nanostores';
import { debounce } from 'ts-debounce';

export type ScreenValues = {
    width: number;
    height: number;
    dpr: number;
    ratio: number;
};

export const $screen = map<ScreenValues>({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio,
    ratio: window.innerWidth / window.innerHeight,
});

export const $screenDebounce = map<ScreenValues>({
    ...$screen.get(),
});

const updateScreen = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio;
    const ratio = width / height;

    $screen.set({ width, height, dpr, ratio });
};

const updateScreenDebounce = () => {
    const { width, height, dpr, ratio } = $screen.get();
    $screenDebounce.set({ width, height, dpr, ratio });
};
const updateScreenDebounced = debounce(updateScreenDebounce, 200);

window.addEventListener('resize', updateScreen);
window.addEventListener('resize', () => updateScreenDebounced());
