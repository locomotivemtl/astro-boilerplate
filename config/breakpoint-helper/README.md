# breakpoint-helper

Astro integration exposing Tailwind's `--breakpoint-*` CSS variables at runtime via a virtual module, with auto-generated types.

## Setup

```ts
// astro.config.ts
import breakpointsHelperAstroIntegration from './config/breakpoint-helper/breakpointsHelperAstroIntegration';

export default defineConfig({
    integrations: [breakpointsHelperAstroIntegration()],
});
```

**Argument**

The integration takes one optional positional argument, not an options object: `breakpointsHelperAstroIntegration('path/to/entry.css')`.

| Argument           | Type     | Default                   |
| ------------------ | -------- | ------------------------- |
| `breakpointsEntry` | `string` | `src/styles/tailwind.css` |

## Source format

Declare breakpoints as `--breakpoint-<name>: <value>px` in the CSS entry (root or `@theme`):

```css
@theme static {
    --breakpoint-2xs: 340px;
    --breakpoint-xs: 500px;
    --breakpoint-sm: 700px;
    --breakpoint-md: 1000px;
    --breakpoint-lg: 1200px;
    --breakpoint-xl: 1400px;
    --breakpoint-2xl: 1600px;
}
```

Values must be integer px for now (`700px`, not `43.75rem`); rem support is planned.

> In dev, saving the CSS entry reloads the page only when a breakpoint changed, and regenerates the types then. Renaming or adding a breakpoint may need the editor's TS server to pick up the new `.d.ts`.

## Usage

```ts
import { computed } from 'nanostores';

import {
    $currentBreakpoint,
    BREAKPOINT_NAMES,
    breakpoints,
    isBelowBreakpoint,
} from '#stores/breakpoints.ts';

console.log(breakpoints.md); // 1000
console.log(BREAKPOINT_NAMES); // ['2xs', 'xs', 'sm', …]
console.log(isBelowBreakpoint('sm')); // Boolean true/false
console.log($currentBreakpoint.get()); // current BreakpointName

// React to breakpoint changes without listening to screen resize event
const isMobile = computed($currentBreakpoint, () => isBelowBreakpoint('sm'));
isMobile.subscribe((v) => console.log(v));
```

`$currentBreakpoint` is the largest breakpoint the viewport has reached, or the smallest one when below all of them. `isAboveBreakpoint`, `isBelowBreakpoint` and `isBetweenBreakpoints` take a breakpoint name or a width in px, and test the viewport the same way CSS `min-width` does. At a 900px window, `isAboveBreakpoint('md')` is `false`, `isAboveBreakpoint(750)` is `true` and `isBetweenBreakpoints('sm', 950)` is `true`.

## Generated Types

Types are written to `types/generated/breakpoints.d.ts` on setup. Each name in the `BreakpointName` union is documented with its `px` value for autocomplete.

## Check

Node strips the types natively, so both checks run as plain scripts:

- `node config/breakpoint-helper/test.mjs` checks the CSS parsing, the generated types and the dev reload.
- `node config/breakpoint-helper/test-store.mjs` checks the runtime store against a mocked `window`.
