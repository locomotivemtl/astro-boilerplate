# defines

Astro integration that injects compile-time global constants into Vite's `define` map and auto-generates matching TypeScript declarations.

## Setup

```ts
// astro.config.ts
import definesAstroIntegration from '#config/defines/definesAstroIntegration.ts';

export default defineConfig({
    integrations: [definesAstroIntegration()]
});
```

## Built-in defines

| Constant     | Type      | Value                                                            |
| ------------ | --------- | ---------------------------------------------------------------- |
| `__IS_DEV__` | `boolean` | `false` when `NODE_ENV` / `VERCEL_ENV` / `CONTEXT` is production |

Production is detected from any of: `PROD`, `MODE=production`, `NODE_ENV=production`, `VERCEL_ENV=production`, or `CONTEXT=production`.

## Adding custom defines

Pass an object to merge additional constants:

```ts
definesAstroIntegration({
    __API_URL__: JSON.stringify('https://api.example.com'),
    __FEATURE_FLAG__: true
});
```

String values must be JSON-stringified (Vite performs text replacement, not injection). Booleans and numbers are stringified automatically.

## Usage in source

```ts
if (__IS_DEV__) {
    console.log('dev only');
    // tree-shaken in production builds
}
```

## TypeScript

Global declarations are auto-generated into `types/generated/defines.d.ts` on integration setup. Types are inferred from the raw values via `typeof`:

```ts
declare const __IS_DEV__: boolean;
declare const __API_URL__: string;
declare const __FEATURE_FLAG__: boolean;
```
