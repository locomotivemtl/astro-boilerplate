# [Nano stores](https://github.com/nanostores/nanostores?tab=readme-ov-file#vanilla-js)

A tiny state manager.
It uses **many atomic stores** and direct manipulation.

-   **Small.** Between 286 and 818 bytes (minified and brotlied).
    Zero dependencies. It uses [Size Limit] to control size.
-   **Fast.** With small atomic and derived stores, you do not need to call
    the selector function for all components on every store change.
-   **Tree Shakable.** A chunk contains only stores used by components
    in the chunk.
-   Designed to move logic from components to stores.
-   Good **TypeScript** support.

## Screen

### $screen

| Prop     | Type     | Description                 |
| -------- | -------- | --------------------------- |
| `width`  | `number` | Updated window inner width  |
| `height` | `number` | Updated window inner height |

```ts
import { $screen, type IScreenValues } from './stores/screen';

$screen.listen(({ width, height }: IScreenDebounceValues) => {
    console.log('Screen:', { width, height });
});
```

### $screenDebounce

This one use a debounce of 200ms by default

| Prop     | Type     | Description                 |
| -------- | -------- | --------------------------- |
| `width`  | `number` | Updated window inner width  |
| `height` | `number` | Updated window inner height |

```ts
import { $screenDebounce, type IScreenDebounceValues } from './stores/screen';

$screenDebounce.listen(({ width, height }: IScreenDebounceValues) => {
    console.log('Screen Debounce:', { width, height });
});
```

## Mouse

### $mouse

| Prop          | Type     | Description                                                             |
| ------------- | -------- | ----------------------------------------------------------------------- |
| `x`           | `number` | The x-coordinate position of the cursor on the window, in pixels.       |
| `y`           | `number` | The y-coordinate position of the cursor on the window, in pixels.       |
| `normalizedX` | `number` | The x-coordinate position of the cursor on the window, between 0 and 1. |
| `normalizedY` | `number` | The y-coordinate position of the cursor on the window, between 0 and 1. |

```ts
import { $mouse, type IMouseState } from './stores/mouse';

$mouse.listen(({ x, y, normalizedX, normalizedY }: IMouseState) => {
    console.log('Mouse:', { x, y, normalizedX, normalizedY });
});
```

### $smoothMouse

This script utilizes a default lerp value of 0.8. Notably, the RAF (RequestAnimationFrame) stops when there's no mouse movement detected. If you're incorporating GSAP (GreenSock Animation Platform), it's recommended to utilize gsap.ticker instead of a custom RequestAnimationFrame implementation for optimal performance.

| Prop                | Type     | Description                                                                    |
| ------------------- | -------- | ------------------------------------------------------------------------------ |
| `smoothX`           | `number` | The lerped x-coordinate position of the cursor on the window, in pixels.       |
| `smoothY`           | `number` | The lerped y-coordinate position of the cursor on the window, in pixels.       |
| `smoothNormalizedX` | `number` | The lerped x-coordinate position of the cursor on the window, between 0 and 1. |
| `smoothNormalizedY` | `number` | The lerped y-coordinate position of the cursor on the window, between 0 and 1. |
| `lerp`              | `number` | The lerp value (.8 by default)                                                 |

```ts
import { $smoothMouse, type ISmoothMouseState } from './stores/mouse';

$smoothMouse.listen(
    ({ smoothX, smoothY, smoothNormalizedX, smoothNormalizedY }: ISmoothMouseState) => {
        console.log('SmoothMouse:', { smoothX, smoothY, smoothNormalizedX, smoothNormalizedY });
    }
);
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
import { $scroll, type IScrollValues } from './stores/scroll';

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
import { $mediaStatus, type MediaStatus } from '@scripts/stores/deviceStatus';

subscribeKeys($mediaStatus, ['isTouchOrSmall'], (value: MediaStatus) => {
    console.log(value);
});
```

## Local Storage

[Persistent](https://github.com/nanostores/persistent) store to save data to `localStorage` and synchronize changes between browser tabs.

### $locomotiveLocalStorage

This is an example of a usage of persistent to save values in your localStorage with the key `locomotive`

```ts
/* Set a value to the localStorage */
$localStorage.set([new Date().toISOString()]);

/* Get a value to the localStorage */
console.log('Local storage:', $localStorage.get());

/* Listen changes */
$localStorage.listen((values) => {
    console.log('Local storage:', values);
});
```

## Example Usage

### In our component

In the following example, we store the event listener in a variable, which returns a function capable of unbinding the event when called. This technique provides a convenient way to manage event listeners and efficiently remove them when necessary. Here's how it works:

```ts
import { $screen, type IScreenValues } from './stores/screen';
import { $mouse, type IMouseState } from './stores/mouse';

export default class Example {
    unbindScreenListener: () => void;
    unbindMouseListener: () => void;

    constructor() {
        this.onResize = this.onResize.bind(this)
        this.onMouseChange = this.onMouseChange.bind(this)
    }

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
        this.unbindMouseListener = $mouse.subscribe(this.onMouseChange);
    }

    unbindEvents() {
        this.unbindScreenListener?.();
        this.unbindMouseListener?.();
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    onResize({ width, height }: IScreenDebounceValues) {
        console.log('Screen:', { width, height });
    })

    onMouseChange({x, y, normalizedX, normalizedY}: IMouseState) {
        console.log('Mouse:', { x, y, normalizedX, normalizedY });
    })
}
```

> ⚠️ **Warning**: When working with the store, it's important to understand the distinction between `Store#subscribe()` and `Store#listen(cb)` methods.

-   `Store#subscribe()` immediately calls the callback function and subscribes to store changes. It passes the store's current value to the callback upon subscription.
-   `Store#listen(cb)`, on the other hand, only triggers the callback function on the next store change.

Be mindful of this difference and choose the appropriate method based on your requirements to ensure the expected behavior in your application.

## Components Manager

The `$componentsManager` is a global store for managing custom Web Component instances. It allows developers to register, track, and interact with all Web Components that extend the `ComponentElement` class. This store, powered by `nanostores`, provides a centralized way to access component instances by their `uid`, `name`, or other criteria, enabling cross-component communication.

### How It Works

When a Web Component extends the `ComponentElement` class, it is automatically registered in the `$componentsManager` store when connected to the DOM. Similarly, the component is unregistered when disconnected.

#### Component Structure in the Store

Each component in `$componentsManager` is stored as an object with the following structure:

- `uid`: A unique identifier generated for each component (can be overridden in the constructor).
- `name`: The constructor name of the component.
- `instance`: The actual component instance, allowing access to its methods and properties.

#### Example

Here’s a simple example demonstrating how components are registered and how you can interact with them using `$componentsManager`.

1. **Create your component by extending `ComponentElement`:**

```ts
import { ComponentElement } from '@root/src/scripts/stores/componentManager';

class Foo extends ComponentElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

customElements.define('c-foo', Foo);
```

2. **Access component instances from `$componentsManager`:**

You can use `$componentsManager.get()` to retrieve the current list of components and interact with them.

- **Access all components of a specific type:**

```ts
import { $componentsManager } from '@root/src/scripts/stores/componentManager';

$componentsManager.get().forEach((component) => {
  if (component.name === 'Foo') {
    const $foo = component.instance as Foo;
    $foo.doSomething(); // Call method on each Foo instance
  }
});
```

- **Access a specific component by its `uid`:**

```ts
const $foo = $componentsManager.get().find((component) => component.uid === 'foo') as Foo;
if ($foo) {
  $foo.doSomething(); // Call method on the Foo instance
}
```

- **Exclude the current instance:**

```ts
$componentsManager.get().forEach((component) => {
  if (component.name === 'Foo' && component.uid !== this.uid) {
    const $foo = component.instance as Foo;
    $foo.doSomething(); // Call method on each Foo instance
  }
});
```

### Best Practices

- **Always call `super.connectedCallback()` and `super.disconnectedCallback()`** in your component’s lifecycle methods to ensure proper registration/unregistration.
- Use `uid`s to uniquely identify components and interact with specific instances.
- Take advantage of the `$componentsManager.get()` method to manage and control components centrally, especially when multiple instances of the same component type are involved.