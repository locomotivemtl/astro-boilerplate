import { computed, map } from 'nanostores';
import { breakpoints, BREAKPOINT_NAMES, type BreakpointName } from 'virtual:breakpoints';

/**
 * This re-export allows other files to import everything
 * from a single location (#stores/breakpoint.ts) instead
 * of having to import from two different sources.
 */
export * from 'virtual:breakpoints';

export type BreakpointsValues = {
    current: BreakpointName;
    list: typeof breakpoints;
    keys: readonly BreakpointName[];
    isBelow: (name: BreakpointName) => boolean;
    isAbove: (name: BreakpointName) => boolean;
};

function getCurrentBreakpoint(): BreakpointName {
    const width = window.innerWidth;
    let current: BreakpointName = 'md';

    for (let i = 0; i < BREAKPOINT_NAMES.length; i++) {
        const name = BREAKPOINT_NAMES[i];
        if (width >= breakpoints[name]) current = name;
    }

    return current;
}

export const $breakpoints = map<BreakpointsValues>({
    current: getCurrentBreakpoint(),
    list: breakpoints,
    keys: BREAKPOINT_NAMES,
    isBelow: isBelowBreakpoint,
    isAbove: isAboveBreakpoint
});

export const $currentBreakpoint = computed($breakpoints, (state) => state.current);

const mediaQueryListeners: Map<BreakpointName, MediaQueryList> = new Map();

function handleMediaQueryChange(): void {
    $breakpoints.setKey('current', getCurrentBreakpoint());
}

function setupMediaQueryListeners(): void {
    // Clean up existing listeners
    mediaQueryListeners.forEach((mql) => {
        mql.removeEventListener('change', handleMediaQueryChange);
    });
    mediaQueryListeners.clear();

    // Create media query for each breakpoint
    for (const name of BREAKPOINT_NAMES) {
        const mql = window.matchMedia(`(min-width: ${breakpoints[name]}px)`);
        mediaQueryListeners.set(name, mql);
        mql.addEventListener('change', handleMediaQueryChange);
    }
}

/* Functions based on breakpoint names for easier usage in components */
export function isAboveBreakpoint(name: BreakpointName): boolean {
    const mql = mediaQueryListeners.get(name);
    return mql?.matches ?? false;
}
export function isBelowBreakpoint(name: BreakpointName): boolean {
    return !isAboveBreakpoint(name);
}
export function isBetweenBreakpoints(min: BreakpointName, max: BreakpointName): boolean {
    return isAboveBreakpoint(min) && !isAboveBreakpoint(max);
}

/* Functions based on breakpoint pixel values */
export function isBelowBreakpointValue(value: number): boolean {
    return breakpoints[$currentBreakpoint.get()] < value;
}
export function isAboveBreakpointValue(value: number): boolean {
    return breakpoints[$currentBreakpoint.get()] > value;
}
export function isBetweenBreakpointsValue(min: number, max: number): boolean {
    return isAboveBreakpointValue(min) && isBelowBreakpointValue(max);
}
export function getBreakpointValue(name: BreakpointName): number {
    return breakpoints[name];
}

setupMediaQueryListeners();
