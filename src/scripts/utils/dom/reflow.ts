import { $body } from './nodes.ts';

export function forceReflow($node: HTMLElement = $body): void {
    void $node.offsetHeight;
}
