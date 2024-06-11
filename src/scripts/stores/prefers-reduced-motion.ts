import { atom } from 'nanostores'

const motionQuery: MediaQueryList = matchMedia('(prefers-reduced-motion)');

const $prefersReducedMotion = atom(motionQuery.matches)

motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) {
        $prefersReducedMotion.set(true)
    } else {
        $prefersReducedMotion.set(false)
    }
});

export { $prefersReducedMotion }