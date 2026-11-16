# DOM utils

Small helpers for the document, the viewport and downloads. Import them from the folder index:

```ts
import { $body, forceReflow, setViewportSize } from '#utils/dom/index.ts';
```

Client only. These modules read `document` and `CSS` when they load, so import them from `<script>` tags, never from Astro frontmatter or other server code.

| File                 | Exports           |
| -------------------- | ----------------- |
| `elements.ts`        | `$html`, `$body`  |
| `reflow.ts`          | `forceReflow`     |
| `download.ts`        | `downloadBlob`    |
| `ready.ts`           | `onDOMReady`      |
| `setViewportSize.ts` | `setViewportSize` |

## Elements

`$body` is read when the module loads. Import it only from module scripts (Astro `<script>` tags are deferred modules). Never import it from an inline script in `<head>`, where `document.body` is still `null`.

## Viewport size

`setViewportSize()` sets `--vw` on every call, because `100vw` includes the scrollbar.

The height variables `--svh`, `--dvh` and `--lvh` are set only in browsers without `svh`, `dvh` and `lvh` support (Safari before 15.4, Chrome before 108, Firefox before 101). Write CSS with the unit as the fallback:

```css
height: calc(var(--dvh, 1dvh) * 100);
```

`Layout.astro` calls it on each debounced screen resize.

## Download

`downloadBlob(blob, filename)` revokes the object URL after 40 seconds. Revoking earlier can cancel the download in Safari and Firefox.
