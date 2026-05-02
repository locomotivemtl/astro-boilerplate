import { $scroll } from '@scripts/stores/scroll.ts';
import { map, type WritableAtom } from 'nanostores';

export interface DynamicBoundingRect {
    node: HTMLElement;
    data: WritableAtom<DOMRectReadOnly>;
    update: () => void;
    dispose: () => void;
}

export function useBoundingRect(
    node: HTMLElement,
    options: {
        callback: (rect: DOMRectReadOnly) => void;
        updateOnResize: boolean;
        updateOnScroll: boolean;
    } = {
        callback: () => {},
        updateOnResize: true,
        updateOnScroll: false
    }
): DynamicBoundingRect {
    if (!(node instanceof HTMLElement)) {
        throw new TypeError('Expected an HTMLElement');
    }

    let _unlistenResize: () => void = () => {};
    let _unlistenScroll: () => void = () => {};

    const data = map(node.getBoundingClientRect());
    const update = () => {
        data.set(node.getBoundingClientRect());
        options.callback(data.get());
    };

    if (options.updateOnResize) {
        const RO = new ResizeObserver(update);
        RO.observe(node);
        _unlistenResize = () => {
            RO.unobserve(node);
            RO.disconnect();
        };
    }

    if (options.updateOnScroll) {
        _unlistenScroll = $scroll.listen(update);
    }

    update();

    return {
        node,
        update,
        data,
        dispose: () => {
            _unlistenResize?.();
            _unlistenScroll?.();
            data.off();
        }
    };
}
