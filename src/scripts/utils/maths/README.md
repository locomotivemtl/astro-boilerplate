# Maths utils

Small number helpers: ranges, easing, wrapping, stats. Import them from the folder index:

```ts
import { clamp, damp, mapRange } from '#utils/maths/index.ts';
```

| File             | Exports                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `index.ts`       | `GOLDEN_RATIO`, `PLASTIC_RATIO`, `TAU`                             |
| `range.ts`       | `clamp`, `mapRange`, `mapClamp`, `normalize`, `smoothstep`, `yoyo` |
| `interpolate.ts` | `lerp`, `damp`                                                     |
| `mod.ts`         | `mod`, `symmetricMod`                                              |
| `round.ts`       | `roundToDecimal`                                                   |
| `stats.ts`       | `average`, `median`                                                |
| `random.ts`      | `shuffle`                                                          |

## Argument order

Every function takes the value first, including `smoothstep`. GLSL puts the value last: `smoothstep(min, max, value)` there is `smoothstep(value, min, max)` here.

`mapRange` is not called `map` because nanostores already exports `map`.

## Damp

`damp` eases `start` towards `end` and gives the same result at any frame rate, as long as you pass the real time since the last frame.

- `dt` is in milliseconds.
- `t` is the speed. `t = 0.1` halves the gap to `end` in about 140ms. In decay-rate terms, that is `t` × 50 per second.
- `precision` snaps to `end` once the value is closer than `precision`, so the loop can stop. Pass `0` to never snap. The default is `0.0001`.

```ts
let x = 0;
let last = performance.now();

const tick = (now: number) => {
    const dt = now - last;
    last = now;
    x = damp(x, target, 0.1, dt, 0.001);
    requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## Zero-width ranges

`normalize` and `smoothstep` return a step instead of NaN when `min` equals `max`: 0 below the edge, 1 at or above it. This covers cases such as an element with zero height.
