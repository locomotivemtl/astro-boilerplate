# breakpoint-helper

Astro integration exposing Tailwind's `--breakpoint-*` CSS variables at runtime via a virtual module, with auto-generated types.

## Setup

```ts
// astro.config.ts
// TODO: switch back to `#config/...` once PR#58 is merged
import breakpointsIntegration from '@config/breakpoint-helper/breakpointsHelperAstroIntegration.ts';

export default defineConfig({
    integrations: [breakpointsIntegration()]
});
```

**Options**

| Option             | Type     | Default                   |
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

> Changes require a dev server restart — generation runs at `astro:config:setup`.

## Usage

```ts
import {
    $currentBreakpoint,
    BREAKPOINT_NAMES,
    breakpoints,
    isBelowBreakpoint
} from '@scripts/stores/breakpoints.ts';
import { computed } from 'nanostores';

console.log(breakpoints.md); // 1000
console.log(BREAKPOINT_NAMES); // ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
console.log(isBelowBreakpoint('sm')); // Boolean true/false
console.log($currentBreakpoint.get()); // current BreakpointName

// React to breakpoint changes without listening to screen resize event
const isMobile = computed($currentBreakpoint, () => isBelowBreakpoint('sm'));
isMobile.subscribe((v) => console.log(v));
```

## Generated Types

Types are written to `types/generated/breakpoints.d.ts` on setup. Each name in the `BreakpointName` union is documented with its `px` value for autocomplete.
