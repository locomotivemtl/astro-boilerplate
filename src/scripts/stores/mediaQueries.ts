import { map } from 'nanostores';

import { getBreakpointValue } from './breakpoints';

/** Whether each media query the site reacts to currently matches. */
export type MediaQueries = {
    canHover: boolean;
    isReducedMotion: boolean;
    isTouchScreen: boolean;
    isTouchOrSmall: boolean;
    isPortrait: boolean;
};

// Keyed by the store property each query drives, so a query and its value cannot drift apart.
const mediaQueryLists: Record<keyof MediaQueries, MediaQueryList> = {
    canHover: matchMedia('(hover: hover)'),
    isReducedMotion: matchMedia('(prefers-reduced-motion: reduce)'),
    isTouchScreen: matchMedia('(hover: none)'),
    isTouchOrSmall: matchMedia(`(width < ${getBreakpointValue('sm')}px), (hover: none)`),
    isPortrait: matchMedia('(orientation: portrait)'),
};

export const $mediaQueries = map<MediaQueries>({
    canHover: mediaQueryLists.canHover.matches,
    isReducedMotion: mediaQueryLists.isReducedMotion.matches,
    isTouchScreen: mediaQueryLists.isTouchScreen.matches,
    isTouchOrSmall: mediaQueryLists.isTouchOrSmall.matches,
    isPortrait: mediaQueryLists.isPortrait.matches,
});

for (const [key, mediaQueryList] of Object.entries(mediaQueryLists)) {
    mediaQueryList.addEventListener('change', (event) =>
        $mediaQueries.setKey(key as keyof MediaQueries, event.matches),
    );
}
