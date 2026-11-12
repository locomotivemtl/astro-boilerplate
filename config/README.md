# define

Astro integration that fills Vite's `define` option with compile-time global constants and auto-generates matching TypeScript declarations.

## Setup

```ts
// astro.config.ts
import defineAstroIntegration from './config/define/defineAstroIntegration.ts';

export default defineConfig({
    integrations: [defineAstroIntegration()]
});
```

## Built-in constants

| Constant        | Type      | Value                                              |
| --------------- | --------- | -------------------------------------------------- |
| `__IS_PROD__`   | `boolean` | `true` for `astro build`                           |
| `__TIMESTAMP__` | `string`  | Build time as `YYYY-MM-DD_HH:MM:SS`, in local time |

Production means `astro build`. `astro dev`, `astro check` and `astro sync` are not production. Set `NODE_ENV=development` on `astro build` to get a debug build with dev-only code kept.

In dev, Vite's client (`/@vite/client`) sets the constants on `globalThis` before page scripts run, so they work there too. In builds they are replaced by text, and the minifier drops dead branches.

## Adding custom constants

Pass an object to merge additional constants:

```ts
defineAstroIntegration({
    __API_URL__: JSON.stringify('https://api.example.com'),
    __FEATURE_FLAG__: true,
    __MAX_ITEMS__: 12,
    __GLOBAL_REF__: 'window.foo'
});
```

String values are pasted in as raw JS expressions (Vite performs text replacement, not injection), so a literal string must be JSON-stringified. Booleans and numbers are stringified automatically.

## Usage in source

```ts
if (!__IS_PROD__) {
    console.log('dev only', __TIMESTAMP__);
    // dropped from production builds
}
```

## TypeScript

Global declarations are auto-generated into `types/generated/define.d.ts` on integration setup. Types are inferred per value. Booleans and numbers use `typeof`. Strings are raw JS expressions, so a JSON literal gets its own type (`JSON.stringify('x')` gives `string`, `'42'` gives `number`) and anything else (`'window.foo'`) is typed `any`:

```ts
declare const __IS_PROD__: boolean;
declare const __TIMESTAMP__: string;
declare const __API_URL__: string;
declare const __FEATURE_FLAG__: boolean;
declare const __MAX_ITEMS__: number;
declare const __GLOBAL_REF__: any;
```
