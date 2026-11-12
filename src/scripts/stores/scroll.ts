import { $screen } from '@scripts/stores/screen.ts';
import { computed, map } from 'nanostores';

const $html = document.documentElement;

export type ScrollValues = {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
};

export const $scroll = map<ScrollValues>({
    scroll: window.scrollY,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0
});

export const $hasPassedFold = computed($scroll, (store) => {
    return store.scroll > $screen.get().height;
});

export const hasScrolledBeyond = (value: number) => {
    return $scroll.get().scroll > value;
};

$hasPassedFold.subscribe((hasPassedFold) => {
    $html.classList.toggle('has-passed-fold', hasPassedFold);
});
