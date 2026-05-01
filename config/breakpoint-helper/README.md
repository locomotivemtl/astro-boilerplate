# breakpoint-helper

Astro integration that reads `--breakpoint-*` CSS custom properties from Tailwind CSS and exposes them at runtime via a virtual module, with auto-generated TypeScript types.

## Setup

```ts
// astro.config.ts
import breakpointsIntegration from '#config/breakpoint-helper/breakpointsHelperAstroIntegration.ts';

export default defineConfig({
    integrations: [breakpointsIntegration()]
});
```

### Options

| Option             | Type     | Default                   | Description                                      |
| ------------------ | -------- | ------------------------- | ------------------------------------------------ |
| `breakpointsEntry` | `string` | `src/styles/tailwind.css` | CSS file to read `--breakpoint-*` variables from |

## Source format

Breakpoints are declared as CSS custom properties using the `--breakpoint-<name>` convention in pixels:

```css
/* src/styles/tailwind.css */
:root {
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
}
```

## Usage

```ts
import { breakpoints, BREAKPOINT_NAMES } from 'virtual:breakpoints';

// breakpoints.md === 768
// BREAKPOINT_NAMES === ['sm', 'md', 'lg', 'xl']

const isMobile = window.innerWidth < breakpoints.md;
```

## TypeScript

Types for the virtual module are auto-generated into `types/gen-breakpoints.d.ts` on integration setup. Each breakpoint name is documented with its `px` value in the union type for autocomplete:

```ts
declare module 'virtual:breakpoints' {
    export type BreakpointName =
        | 'sm' /** 640px */
        | 'md' /** 768px */
        | 'lg' /** 1024px */
        | 'xl' /** 1280px */;

    export type BreakpointValues = Record<BreakpointName, number>;

    export const breakpoints: BreakpointValues;
    export const BREAKPOINT_NAMES: BreakpointName[];
}
```

## How it works

At config setup:

1. The CSS entry file is read and all `--breakpoint-<name>: <value>px` declarations are extracted and sorted by value ascending.
2. `breakpointToType` writes the typed `virtual:breakpoints` declaration to `types/gen-breakpoints.d.ts`.
3. A Vite virtual module plugin resolves `virtual:breakpoints` to a generated JS module exporting the `breakpoints` record and `BREAKPOINT_NAMES` array.

## Standalone Vite plugin

The integration is a thin Astro wrapper. To use in a plain Vite project, extract the inline virtual module plugin into a factory and call it from `vite.config.ts`. The core helpers — `extractBreakpoints`, `generateVirtualModule`, and `breakpointToType` — contain no Astro-specific dependencies; only the hook wiring needs adjustment.

## Files

| File                                   | Purpose                                               |
| -------------------------------------- | ----------------------------------------------------- |
| `breakpointsHelperAstroIntegration.ts` | Entry point — CSS parsing, virtual module, Astro hook |
| `breakpointToType.ts`                  | Generates `types/gen-breakpoints.d.ts`                |
