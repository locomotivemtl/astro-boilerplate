# breakpoint-helper

Astro integration exposing Tailwind's `--breakpoint-*` CSS variables at runtime via a virtual module, with auto-generated types.

## Setup

```ts
// astro.config.ts
import breakpointHelperAstroIntegration from './config/breakpoint-helper/breakpointHelperAstroIntegration.ts';

export default defineConfig({
    integrations: [breakpointHelperAstroIntegration()],
});
```

**Argument**

The integration takes one optional positional argument, not an options object: `breakpointHelperAstroIntegration('path/to/entry.css')`.

| Argument           | Type     | Default                      |
| ------------------ | -------- | ---------------------------- |
| `breakpointsEntry` | `string` | `src/styles/breakpoints.css` |

## Source format

Declare breakpoints as `--breakpoint-<name>: <value>px` in `src/styles/breakpoints.css` (root or `@theme`). `tailwind.css` imports it, so Tailwind's responsive variants use the same values:

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

Values must be integer px for now (`700px`, not `43.75rem`).

> In dev, saving the CSS entry reloads the page and regenerates the types. Renaming or adding a breakpoint may need the editor's TS server to pick up the new `.d.ts`.

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

Types are written to `types/generated/breakpoints.d.ts` on setup, under the shared header from `config/utils/writeGeneratedTypes.ts`. The file is only rewritten when its content changes. Each name in the `BreakpointName` union is documented with its `px` value for autocomplete.
