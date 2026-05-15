import { atom } from 'nanostores';
import { breakpoints, BREAKPOINT_NAMES, type BreakpointName } from 'virtual:breakpoints';

// Re-export so we can import everything from this file instead of two sources.
export * from 'virtual:breakpoints';

function getCurrentBreakpoint(): BreakpointName {
    let current: BreakpointName = BREAKPOINT_NAMES[0];

    const width = window.innerWidth;
    for (const name of BREAKPOINT_NAMES) {
        if (width >= breakpoints[name]) current = name;
    }

    return current;
}

export const $currentBreakpoint = atom<BreakpointName>(getCurrentBreakpoint());

const mediaQueryListeners: Map<BreakpointName, MediaQueryList> = new Map();

function handleMediaQueryChange(): void {
    $currentBreakpoint.set(getCurrentBreakpoint());
}

function setupMediaQueryListeners(): void {
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
    return breakpoints[$currentBreakpoint.get()] >= value;
}
export function isBetweenBreakpointsValue(min: number, max: number): boolean {
    return isAboveBreakpointValue(min) && isBelowBreakpointValue(max);
}
export function getBreakpointValue(name: BreakpointName): number {
    return breakpoints[name];
}

setupMediaQueryListeners();
