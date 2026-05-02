import { $screen } from '@scripts/stores/screen.ts';
// import { $html } from '@scripts/utils/dom/dom.ts';
const $html = document.documentElement;
import { atom, computed, map, subscribeKeys } from 'nanostores';

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

export const $hasScrolled = computed($scroll, (store) => {
    return store.scroll > 40;
});

export const $hasPassedFold = computed($scroll, (store) => {
    return store.scroll > $screen.get().height;
});

$hasScrolled.subscribe((hasScrolled) => {
    $html.classList.toggle('has-scrolled', hasScrolled);
});

$hasPassedFold.subscribe((hasPassedFold) => {
    $html.classList.toggle('has-passed-fold', hasPassedFold);
});

subscribeKeys($scroll, ['direction'], (store) => {
    $html.classList.toggle('is-scrolling-up', store.direction === -1);
    $html.classList.toggle('is-scrolling-down', store.direction === 1);
});

export const $hasScrolledBeyond = (value: number) => {
    return computed($scroll, (store) => store.scroll > value);
};

export const $hasScrolledPastHeader = atom(false);
export const $hasReachedFooter = atom(false);
