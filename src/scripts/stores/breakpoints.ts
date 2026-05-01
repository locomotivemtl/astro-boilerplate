import { computed, map } from 'nanostores';
import { breakpoints, BREAKPOINT_NAMES, type BreakpointName } from 'virtual:breakpoints';

/**
 This re-export allows other files to import everything
 from a single location (#stores/breakpoint.ts) instead
 of having to import from two different sources.
*/
export * from 'virtual:breakpoints';

/**
 * Breakpoint store values
 */
export type BreakpointsValues = {
    current: BreakpointName;
    list: typeof breakpoints;
    keys: readonly BreakpointName[];
    isBelow: (name: BreakpointName) => boolean;
    isAbove: (name: BreakpointName) => boolean;
};

/**
 * Get current breakpoint based on window width
 */
function getCurrentBreakpoint(): BreakpointName {
    const width = window.innerWidth;
    let current: BreakpointName = 'md';

    for (let i = 0; i < BREAKPOINT_NAMES.length; i++) {
        const name = BREAKPOINT_NAMES[i];
        if (width >= breakpoints[name]) current = name;
    }

    return current;
}

/**
 * Main breakpoints store
 */
export const $breakpoints = map<BreakpointsValues>({
    current: getCurrentBreakpoint(),
    list: breakpoints,
    keys: BREAKPOINT_NAMES,
    isBelow: isBelowBreakpoint,
    isAbove: isAboveBreakpoint
});

/**
 * Computed store for just the current breakpoint name
 */
export const $currentBreakpoint = computed($breakpoints, (state) => state.current);

/**
 * Media query listeners storage
 */
const mediaQueryListeners: Map<BreakpointName, MediaQueryList> = new Map();

/**
 * Handle media query change event
 */
function handleMediaQueryChange(): void {
    $breakpoints.setKey('current', getCurrentBreakpoint());
}

/**
 * Setup media query listeners for all breakpoints
 */
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

/**
 * Check if current viewport matches or exceeds a breakpoint
 */
export function isBreakpoint(name: BreakpointName): boolean {
    const mql = mediaQueryListeners.get(name);
    return mql?.matches ?? false;
}

/**
 * Check if current viewport is below a breakpoint
 */
export function isBelowBreakpointValue(value: number): boolean {
    return breakpoints[$currentBreakpoint.get()] < value;
}

/**
 * Check if current viewport is below a breakpoint
 */
export function isBelowBreakpoint(name: BreakpointName): boolean {
    return !isBreakpoint(name);
}

/**
 * Check if current viewport is above a breakpoint
 */
export function isAboveBreakpointValue(value: number): boolean {
    return breakpoints[$currentBreakpoint.get()] > value;
}

/**
 * Check if current viewport is above a breakpoint
 */
export function isAboveBreakpoint(name: BreakpointName): boolean {
    return isBreakpoint(name);
}

/**
 * Check if current viewport is between two breakpoints (inclusive of min, exclusive of max)
 */
export function isBetweenBreakpoints(min: BreakpointName, max: BreakpointName): boolean {
    return isBreakpoint(min) && !isBreakpoint(max);
}

/**
 * Check if current viewport is between two breakpoints (inclusive of min, exclusive of max)
 */
export function isBetweenBreakpointsValue(min: number, max: number): boolean {
    return isAboveBreakpointValue(min) && isBelowBreakpointValue(max);
}

/**
 * Get the pixel value for a breakpoint
 */
export function getBreakpointValue(name: BreakpointName): number {
    return breakpoints[name];
}

// Initialize media query listeners
setupMediaQueryListeners();
