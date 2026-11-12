# [Nano stores](https://github.com/nanostores/nanostores?tab=readme-ov-file#vanilla-js)

A tiny state manager.
It uses **many atomic stores** and direct manipulation.

- **Small.** Between 286 and 818 bytes (minified and brotlied).
  Zero dependencies. It uses [Size Limit] to control size.
- **Fast.** With small atomic and derived stores, you do not need to call
  the selector function for all components on every store change.
- **Tree Shakable.** A chunk contains only stores used by components
  in the chunk.
- Designed to move logic from components to stores.
- Good **TypeScript** support.

## Screen

### $screen / $screenDebounce

| Prop     | Type     | Description                         |
| -------- | -------- | ----------------------------------- |
| `width`  | `number` | Updated window inner width          |
| `height` | `number` | Updated window inner height         |
| `dpr`    | `number` | Device pixel ratio of the window    |
| `ratio`  | `number` | Width to height ratio of the window |

```ts
import { $screen, type ScreenValues } from './stores/screen.ts';

$screen.listen(({ width, height, dpr, ratio }: ScreenValues) => {
    console.log('Screen:', { width, height, dpr, ratio });
});
```

```ts
import { $screenDebounce, type ScreenValues } from './stores/screen.ts';

// This one use a debounce of 200ms by default
$screenDebounce.listen(({ width, height, dpr, ratio }: ScreenValues) => {
    console.log('Screen Debounce:', { width, height, dpr, ratio });
});
```

## Scroll

### $scroll

To access scroll values from the Locomotive Scroll instance.

| Prop        | Type     | Description                                     |
| ----------- | -------- | ----------------------------------------------- |
| `scroll`    | `number` | Current scrolled value on the window, in pixels |
| `limit`     | `number` | Max pixels that can be scrolled                 |
| `velocity`  | `number` | Current scroll velocity.                        |
| `direction` | `number` | Current scroll direction (1/-1).                |
| `progress`  | `number` | Normalized scroll progress between 0 and 1      |

```ts
import { $scroll, type IScrollValues } from './stores/scroll.ts';

$scroll.listen(({ scroll, limit, velocity, direction, progress }: IScrollValues) => {
    console.log('Scroll:', { scroll, limit, velocity, direction, progress });
});
```

## Device Status

### $mediaStatus

| Prop              | Type      | Description                                                                                                      |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `isReducedMotion` | `boolean` | Returns `true` if the user has enabled reduced motion preferences, otherwise returns `false`                     |
| `isTouchScreen`   | `boolean` | Returns `true` if the condition match with the touchscreen mediaquery, otherwise returns `false`                 |
| `isTouchOrSmall`  | `boolean` | Returns `true` if the condition match with the touchscreen or small screen mediaquery, otherwise returns `false` |

```ts
import { subscribeKeys } from 'nanostores';
import { $mediaStatus, type MediaStatus } from '@scripts/stores/deviceStatus.ts';

subscribeKeys($mediaStatus, ['isTouchOrSmall'], (value: MediaStatus) => {
    console.log(value);
});
```

## Example Usage

### In our component

In the following example, we store the event listener in a variable, which returns a function capable of unbinding the event when called. This technique provides a convenient way to manage event listeners and efficiently remove them when necessary. Here's how it works:

```ts
import { $screen, type ScreenValues } from './stores/screen.ts';

export class Example {
    private unbindScreenListener?: (() => void) | undefined

    // =============================================================================
    // Lifecycle
    // =============================================================================
    init() {
        this.bindEvents();
    }

    destroy() {
        this.unbindEvents();
    }

    // =============================================================================
    // Events
    // =============================================================================
    bindEvents() {
        this.unbindScreenListener = $screen.listen(this.onResize);
    }

    unbindEvents() {
        this.unbindScreenListener?.();
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    private onResize = ({ width, height, dpr, ratio }: ScreenValues) => {
        console.log('Screen:', { width, height, dpr, ratio });
    })
}
```

> ⚠️ **Warning**: When working with the store, it's important to understand the distinction between `Store#subscribe()` and `Store#listen(cb)` methods.

- `Store#subscribe()` immediately calls the callback function and subscribes to store changes. It passes the store's current value to the callback upon subscription.
- `Store#listen(cb)`, on the other hand, only triggers the callback function on the next store change.

Be mindful of this difference and choose the appropriate method based on your requirements to ensure the expected behavior in your application.
