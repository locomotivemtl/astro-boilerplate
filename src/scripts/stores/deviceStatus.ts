import { map } from 'nanostores';
import { breakpoints } from './breakpoints.ts';

// =============================================================================
// MediaQueries
// =============================================================================
export type MediaQueries = {
    reducedMotion: string;
    touchScreen: string;
    touchOrSmall: string;
};

export const $mediaQueries = map<MediaQueries>({
    reducedMotion: `(prefers-reduced-motion: reduce)`,
    touchScreen: `(hover: none)`,
    touchOrSmall: `(max-width: ${breakpoints.sm}px), (hover: none)`
});

// =============================================================================
// States
// =============================================================================
type MediaStatusQueries = {
    reducedMotion: MediaQueryList;
    touchScreen: MediaQueryList;
    touchOrSmall: MediaQueryList;
};

const mediaStatusQueries = {
    reducedMotion: matchMedia($mediaQueries.value?.reducedMotion || ''),
    touchScreen: matchMedia($mediaQueries.value?.touchScreen || ''),
    touchOrSmall: matchMedia($mediaQueries.value?.touchOrSmall || '')
};

export type MediaStatus = {
    isReducedMotion: boolean;
    isTouchScreen: boolean;
    isTouchOrSmall: boolean;
};

export const $mediaStatus = map<MediaStatus>({
    isReducedMotion: mediaStatusQueries.reducedMotion.matches,
    isTouchScreen: mediaStatusQueries.touchScreen.matches,
    isTouchOrSmall: mediaStatusQueries.touchOrSmall.matches
});

for (const mediaQuery in mediaStatusQueries) {
    mediaStatusQueries[mediaQuery as keyof MediaStatusQueries].addEventListener('change', () => {
        const property = `is${mediaQuery.charAt(0).toUpperCase() + mediaQuery.slice(1)}`;
        $mediaStatus.setKey(
            property as keyof MediaStatus,
            mediaStatusQueries[mediaQuery as keyof MediaStatusQueries].matches
        );
    });
}

// =============================================================================
