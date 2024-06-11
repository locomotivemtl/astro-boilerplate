import { $scroll } from '@scripts/stores/scroll';
import LocomotiveScroll from 'node_modules/locomotive-scroll';

import type {
    ILenisScrollToOptions,
    lenisTargetScrollTo
} from 'node_modules/locomotive-scroll/dist/types/types';

export class Scroll {
    static locomotiveScroll: LocomotiveScroll;

    // =============================================================================
    // Lifecycle
    // =============================================================================
    static init() {
        this.locomotiveScroll = new LocomotiveScroll({
            scrollCallback({ scroll, limit, velocity, direction, progress }) {
                $scroll.set({
                    scroll,
                    limit,
                    velocity,
                    direction,
                    progress
                });
            }
        });
    }

    static destroy() {
        this.locomotiveScroll?.destroy();
    }

    // =============================================================================
    // Methods
    // =============================================================================
    static start() {
        this.locomotiveScroll?.start();
    }

    static stop() {
        this.locomotiveScroll?.stop();
    }

    static addScrollElements(container: HTMLElement) {
        this.locomotiveScroll?.addScrollElements(container);
    }

    static removeScrollElements(container: HTMLElement) {
        this.locomotiveScroll?.removeScrollElements(container);
    }

    static scrollTo(target: lenisTargetScrollTo, options?: ILenisScrollToOptions) {
        this.locomotiveScroll?.scrollTo(target, options);
    }
}
