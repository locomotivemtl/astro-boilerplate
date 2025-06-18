import { map } from 'nanostores';
import { debounce } from 'ts-debounce';

export type ScreenValues = {
    width: number;
    height: number;
};

export type ScreenDebounceValues = {
    width: number;
    height: number;
};

export const $screen = map<ScreenValues>({
    width: window.innerWidth,
    height: window.innerHeight
});

export const $screenDebounce = map<ScreenDebounceValues>({
    width: window.innerWidth,
    height: window.innerHeight
});

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    $screen.set({ width, height });
});

const debouncedFunction: any = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    $screenDebounce.set({ width, height });
};
window.addEventListener('resize', debounce(debouncedFunction, 200));
