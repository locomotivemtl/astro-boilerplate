# defines

Astro integration that injects compile-time global constants into Vite's `define` map and auto-generates matching TypeScript declarations.

## Setup

```ts
// astro.config.ts
import definesAstroIntegration from '#config/defines/definesAstroIntegration.ts';

export default defineConfig({
    integrations: [
        definesAstroIntegration() // must come before ifdefAstroIntegration
    ]
});
```

> **Order matters** — register this integration before `ifdefAstroIntegration`, which reads `config.vite.define` to resolve `#if` conditions.

## Built-in defines

| Constant           | Type      | Value                                                                            |
| ------------------ | --------- | -------------------------------------------------------------------------------- |
| `__IS_PROD__`      | `boolean` | `true` when `NODE_ENV` / `VERCEL_ENV` / `CONTEXT` is production                  |
| `__IS_DEV__`       | `boolean` | `!__IS_PROD__`                                                                   |
| `__DEBUG__`        | `boolean` | `!__IS_PROD__`                                                                   |
| `__PROJECT_NAME__` | `string`  | Package name from `package.json`, uppercased and sanitised (`@`, `/`, `-` → `_`) |

Production is detected from any of: `PROD`, `MODE=production`, `NODE_ENV=production`, or `VERCEL_ENV=production`.

## Adding custom defines

Pass an object to merge additional constants:

```ts
definesAstroIntegration({
    __API_URL__: JSON.stringify('https://api.example.com'),
    __FEATURE_FLAG__: JSON.stringify(true)
});
```

String values must be JSON-stringified (Vite performs text replacement, not injection).

## Usage in source

```ts
/// #if __IS_DEV__
console.log('dev only');
/// #endif

if (__IS_PROD__) {
    // tree-shaken in dev builds
}
```

## TypeScript

Global declarations are auto-generated into `types/gen-defines.d.ts` on integration setup. Types are inferred from the stringified values — booleans become `boolean`, strings become `string`, etc.:

```ts
declare const __IS_PROD__: boolean;
declare const __IS_DEV__: boolean;
declare const __DEBUG__: boolean;
declare const __PROJECT_NAME__: string;
```

## Standalone Vite config

The integration is a thin Astro wrapper — no Vite plugin is involved, only `vite.define`. To use the same defines in a plain Vite project:

```ts
// vite.config.ts
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');
const isProd = env.MODE === 'production' || env.NODE_ENV === 'production';

export default defineConfig({
    define: {
        __IS_PROD__: JSON.stringify(isProd),
        __IS_DEV__: JSON.stringify(!isProd),
        __DEBUG__: JSON.stringify(!isProd)
    }
});
```

## Files

| File                         | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `definesAstroIntegration.ts` | Entry point — resolves env, builds define map, calls `defineToType`  |
| `../utils/defineToType.ts`   | Writes `types/gen-<filename>.d.ts` from a stringified defines record |
