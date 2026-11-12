import { map } from 'nanostores';

/** Whether each media query the site reacts to currently matches. */
export type MediaQueries = {
    canHover: boolean;
    isReducedMotion: boolean;
    isTouchScreen: boolean;
    isTouchOrSmall: boolean;
    isPortrait: boolean;
};

// TODO: read `sm` from the breakpoints store once https://github.com/locomotivemtl/astro-boilerplate/pull/60 lands
const breakpointSm =
    getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-sm').trim() ||
    '700px';

// Keyed by the store property each query drives, so a query and its value cannot drift apart.
const mediaQueryLists: Record<keyof MediaQueries, MediaQueryList> = {
    canHover: matchMedia('(hover: hover)'),
    isReducedMotion: matchMedia('(prefers-reduced-motion: reduce)'),
    isTouchScreen: matchMedia('(hover: none)'),
    isTouchOrSmall: matchMedia(`(max-width: ${breakpointSm}), (hover: none)`),
    isPortrait: matchMedia('(orientation: portrait)')
};

export const $mediaQueries = map<MediaQueries>({
    canHover: mediaQueryLists.canHover.matches,
    isReducedMotion: mediaQueryLists.isReducedMotion.matches,
    isTouchScreen: mediaQueryLists.isTouchScreen.matches,
    isTouchOrSmall: mediaQueryLists.isTouchOrSmall.matches,
    isPortrait: mediaQueryLists.isPortrait.matches
});

for (const [key, mediaQueryList] of Object.entries(mediaQueryLists)) {
    mediaQueryList.addEventListener('change', (event) =>
        $mediaQueries.setKey(key as keyof MediaQueries, event.matches)
    );
}
