const $html = document.documentElement;
const $body = document.body;

export { $html, $body };

export function forceReflow(node: HTMLElement = $body): void {
    void node.offsetHeight;
}

export const onDOMReady = (callback: () => void): void => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};
