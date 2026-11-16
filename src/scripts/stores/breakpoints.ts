import { atom } from 'nanostores';
import { breakpoints, BREAKPOINT_NAMES, type BreakpointName } from 'virtual:breakpoints';

// Re-export so we can import everything from this file instead of two sources.
export * from 'virtual:breakpoints';

export type Breakpoint = BreakpointName | number;

const IS_CLIENT = typeof window !== 'undefined';

const mediaQueryLists = new Map<BreakpointName, MediaQueryList>(
    IS_CLIENT
        ? BREAKPOINT_NAMES.map((name) => [
              name,
              window.matchMedia(`(min-width: ${breakpoints[name]}px)`),
          ])
        : [],
);

/**
 * The largest breakpoint the viewport has reached.
 * Below every breakpoint it is the smallest one, by design.
 */
function getCurrentBreakpoint(): BreakpointName {
    let current: BreakpointName = BREAKPOINT_NAMES[0];

    for (const name of BREAKPOINT_NAMES) {
        if (mediaQueryLists.get(name)?.matches) {
            current = name;
        }
    }

    return current;
}

export const $currentBreakpoint = atom<BreakpointName>(getCurrentBreakpoint());

for (const mql of mediaQueryLists.values()) {
    mql.addEventListener('change', () => $currentBreakpoint.set(getCurrentBreakpoint()));
}

function getMediaQueryList(breakpoint: Breakpoint): MediaQueryList | undefined {
    if (typeof breakpoint === 'number') {
        return IS_CLIENT ? window.matchMedia(`(min-width: ${breakpoint}px)`) : undefined;
    }

    return mediaQueryLists.get(breakpoint);
}

/** Whether the viewport is at least this breakpoint wide, same test as CSS `min-width`. */
export function isAboveBreakpoint(breakpoint: Breakpoint): boolean {
    return getMediaQueryList(breakpoint)?.matches ?? false;
}
export function isBelowBreakpoint(breakpoint: Breakpoint): boolean {
    return !isAboveBreakpoint(breakpoint);
}
export function isBetweenBreakpoints(min: Breakpoint, max: Breakpoint): boolean {
    return isAboveBreakpoint(min) && isBelowBreakpoint(max);
}

export function getBreakpointValue(name: BreakpointName): number {
    return breakpoints[name];
}
