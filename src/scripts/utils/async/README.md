# Async utils

Small helpers to delay, wait and settle promises. Import them from the folder index:

```ts
import { debounce, wait, nextFrame } from '#utils/async/index.ts';
```

| File                 | Exports                                  | Clock                    |
| -------------------- | ---------------------------------------- | ------------------------ |
| `debounce.ts`        | `debounce`, `throttle`, `Cancelable`     | `setTimeout`             |
| `timers.ts`          | `wait`, `nextMacrotask`, `nextMicrotask` | `setTimeout`, microtasks |
| `frames.ts`          | `nextFrame`, `rafWait`, `rafSetInterval` | `requestAnimationFrame`  |
| `deferredPromise.ts` | `deferredPromise`, `DeferredPromise`     | none                     |

## Hidden tabs

Browsers slow `setTimeout` in background tabs to about once per second. `requestAnimationFrame` stops completely: everything in `frames.ts` pauses while the tab is hidden and resumes when the user returns.

## Debounce and throttle

| Function   | Runs `fn`                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------- |
| `debounce` | Once, `ms` after the last call, with the latest arguments                                     |
| `throttle` | Right away, then at most once every `ms`; calls inside the window collapse into one last call |

Both return the wrapped function with a `cancel()` that drops the pending call.

```ts
const onResize = debounce(() => updateLayout(), 200);
window.addEventListener('resize', () => onResize());

const onScroll = throttle((y: number) => updateProgress(y), 100);
onScroll.cancel();
```

## Timers

| Function               | Resolves                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| `wait(ms)`             | After `ms` milliseconds                                           |
| `nextMacrotask(n = 1)` | After `n` `setTimeout(0)` tasks                                   |
| `nextMicrotask()`      | Once the current synchronous code ends, before any task or render |

Browsers raise `setTimeout(0)` to about 4ms after 5 chained timers, so `nextMacrotask(10)` takes longer than it looks.

## Frames

| Function                 | Does                                                                         |
| ------------------------ | ---------------------------------------------------------------------------- |
| `nextFrame()`            | Resolves after the next frame has painted (two `requestAnimationFrame`)      |
| `rafWait(ms)`            | Resolves on the first frame after `ms`; always waits at least one frame      |
| `rafSetInterval(cb, ms)` | Calls `cb` every `ms` on frames, first call after `ms`; returns `{ cancel }` |

`rafSetInterval` keeps the leftover time between calls, so a 20ms interval averages 20ms at 60Hz instead of rounding up to 33ms. `cb` receives `cancel`, so it can stop the loop itself.

```ts
el.classList.add('is-start');
await nextFrame();
el.classList.add('is-end'); // the transition plays from the start state

const interval = rafSetInterval((cancel) => {
    if (isDone()) cancel();
}, 100);
```

## Deferred promise

A promise whose `resolve` and `reject` live outside it, so other code can settle it. Same shape as `Promise.withResolvers()`, which needs Safari 17.4+.

```ts
const ready = deferredPromise<void>();
image.addEventListener('load', () => ready.resolve());
await ready.promise;
```
