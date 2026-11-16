# String utils

Small helpers to reshape text and build ids. Import them from the folder index:

```ts
import { slugify, camelToKebab, hash } from '#utils/string/index.ts';
```

| File         | Exports                                                                          |
| ------------ | -------------------------------------------------------------------------------- |
| `case.ts`    | `camelToKebab`, `camelToSnake`, `kebabToCamel`, `toPascal`, `ucfirst`, `lcfirst` |
| `slugify.ts` | `slugify`                                                                        |
| `hash.ts`    | `hash`                                                                           |
| `uuid.ts`    | `createUUID`                                                                     |
| `href.ts`    | `normalizeSlashHref`                                                             |

## Case

`ucfirst` and `lcfirst` return `''` for an empty string.

All four converters split words on case changes, spaces, dashes and underscores, so any of them accepts any of those inputs. `toPascal` lowercases acronyms: `XMLHttp` becomes `XmlHttp`.

`camelToKebab` keeps acronyms together: `fooBarBaz` is `foo-bar-baz`, `myURL` is `my-url`, `XMLHttp` is `xml-http`. That makes it not the inverse of `dataset` keys, where `data-my-url` reads back as `myUrl`. To read or write a `data-*` attribute, use `el.dataset[key]` and skip the conversion.

## Slugify

```ts
slugify('Hello, World!'); // 'hello-world'
slugify("L'été à Montréal"); // 'lete-a-montreal'
```

- Accents fold to their base letter.
- Apostrophes drop without leaving a dash.
- Any other run of non-alphanumerics becomes one dash; leading and trailing dashes are cut.
- Characters that do not decompose, such as `œ` or `ß`, are dropped.

## Hash

32-bit FNV-1a in base 36. Same input, same output, on every run. Use it for cache keys and ids, never for security: two different strings can share a hash.

## UUID

`createUUID()` returns a random v4 UUID. It uses `crypto.getRandomValues` because `crypto.randomUUID` needs a secure context (`astro dev --host` over LAN http is not one).
