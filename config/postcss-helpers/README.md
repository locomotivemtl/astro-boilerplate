# postcss-helpers

Astro integration that registers `@locomotivemtl/postcss-helpers-functions` as a PostCSS plugin and exposes its helpers at runtime via a virtual module.

## Setup

```ts
// astro.config.ts
import postCssProcessorsIntegration from '#config/postcss-helpers/postcss-integration.ts';

export default defineConfig({
    integrations: [postCssProcessorsIntegration()]
});
```

The integration registers the PostCSS plugin and the virtual module. Available helpers are defined by `@locomotivemtl/postcss-helpers-functions`.

## Virtual module — `virtual:postcss-processors`

Exposes a `processStyle` function for applying the same transformations at runtime in JS/TS:

```ts
import { processStyle } from 'virtual:postcss-processors';

const result = processStyle('width: dvh(100)');
// → 'width: calc(100 * var(--dvh, 1dvh))'
```

TypeScript types for this module live in `types/gen-postcss-processors.d.ts`.

## Files

| File                     | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `postcss-integration.ts` | Astro entry point — registers PostCSS plugin + virtual module |
| `virtual-module.ts`      | Generates virtual module JS code from the helpers list        |
