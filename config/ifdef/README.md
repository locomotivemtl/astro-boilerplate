# ifdef — Conditional Compilation for Astro/Vite

A preprocessor that strips or reveals blocks of source code at build time based on `#if` / `#elif` / `#else` / `#endif` directives, similar to C/C++ preprocessor conditionals. Directives are written inside comments so the source remains valid before processing.

---

## Setup

Register the integration in `astro.config.ts` **after** any integration that populates `vite.define` (e.g. `definesAstroIntegration`):

```ts
// astro.config.ts
import ifdefAstroIntegration from '#config/ifdef/ifdefAstroIntegration.ts';

export default defineConfig({
    integrations: [
        ifdefAstroIntegration() // reads vite.define automatically
    ]
});
```

The integration reads `config.vite.define` to resolve all `#if` conditions — no extra config required for defines already declared there.

---

## Syntax

Directives are placed inside line comments (`///`) or block comments (`<!-- -->`). The comment wrapper is stripped during processing; the rest of the file is left exactly as-is.

### TypeScript / JavaScript / Astro script

```ts
/// #if <condition>
// …included when condition is true…
/// #elif <other condition>
// …included when other condition is true…
/// #else
// …included otherwise…
/// #endif
```

### Astro / HTML templates

```html
<!-- #if <condition> -->
<script src="analytics.js"></script>
<!-- #endif -->
```

### Conditions

Conditions are plain JavaScript expressions evaluated against the defines map. Any define declared in `vite.define` whose key is a valid JS identifier is available as a variable.

```ts
/// #if __IS_DEV__
/// #if __IS_PROD__
/// #if __IS_DEV__ && __USER__ == 'lisa'
/// #if someFlag || otherFlag
```

> **Note on string defines** — Vite stores string values as JSON-stringified literals (e.g. `'"lisa"'`). The preprocessor automatically unwraps these before evaluation, so you can compare with plain string literals: `__USER__ == 'lisa'`.

---

## The `#code` uncomment prefix

Lines prefixed with `/// #code` inside an included block are _uncommented_ (the prefix is stripped) when the block is revealed. This lets you write code that is syntactically inert while the block is excluded but becomes live code when included:

```ts
/// #if __IS_DEV__ && __USER__ == 'lisa'
/// #code const name = "Lisa";
/// #else
const name = 'Locomotive';
/// #endif
```

When the `#if` is true the revealed line becomes `const name = "Lisa";`.
When false the `#else` branch is kept and the `#code` line is blanked out.

---

## Options

```ts
ifdefAstroIntegration({
    extensions?:      string[];        // extra file extensions to process (default: see below)
    verbose?:         boolean;         // log which branches are taken (default: false)
    commentStyles?:   CommentStyle[];  // additional comment wrappers to recognise
    fillWithBlanks?:  boolean;         // replace excluded lines with spaces to preserve line numbers (default: true)
    uncommentPrefix?: string;          // prefix for #code lines (default: '/// #code')
})
```

### Default processed extensions

`.cjs` `.jsx` `.js` `.mjs` `.astro` `.ts` `.tsx`

### Default comment styles

| Style        | Open   | Close |
| ------------ | ------ | ----- |
| Line comment | `///`  | —     |
| HTML comment | `<!--` | `-->` |

---

## How excluded lines are handled

Excluded lines are replaced with whitespace (when `fillWithBlanks: true`, the default) to preserve source maps and line numbers. The original characters are never present in the output.

---

## Standalone Vite plugin

The integration is a thin Astro wrapper around an inline Vite plugin. The core `parse` function has no Astro-specific dependencies. To use in a plain Vite project, extract the plugin into a factory and supply `vite.define` manually:

```ts
// vite.config.ts  (requires extracting the plugin factory first)
import { parse } from '#config/ifdef/preprocessor.js';

const defines = {
    __IS_DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
};

export default defineConfig({
    define: defines,
    plugins: [
        {
            name: 'ifdef-vite-plugin',
            enforce: 'pre',
            transform(src, id) {
                if (!/\.(ts|tsx|js|jsx|mjs|cjs)(\?|$)/.test(id) || id.includes('node_modules'))
                    return;
                return {
                    code: parse(src, id, defines, false, [{ open: '///' }], true, '/// #code'),
                    map: null
                };
            }
        }
    ]
});
```

The only tweak needed is sourcing `vite.define` externally instead of reading it from `config.vite.define` in the Astro hook.

---

## Files

| File                       | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `ifdefAstroIntegration.ts` | Astro integration — wires up the Vite `load`/`transform` hooks       |
| `preprocessor.ts`          | Core parser and evaluator (`parse`, `find_if_blocks`, `evaluate`, …) |
| `preprocessor.d.ts`        | Public type declarations for `parse` and `CommentStyle`              |
