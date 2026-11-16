import { $body, $html } from './nodes.ts';

const SUPPORTS_VIEWPORT_UNITS = ['svh', 'dvh', 'lvh'].every((unit) =>
    CSS.supports('height', `100${unit}`),
);

/** Sets `--vw` (1% of viewport width without the scrollbar) and, in browsers without svh/dvh/lvh, `--svh`, `--dvh` and `--lvh` fallbacks in px. */
export function setViewportSize(): void {
    const style = $html.style;
    style.setProperty('--vw', `${$html.clientWidth * 0.01}px`);

    if (SUPPORTS_VIEWPORT_UNITS) {
        return;
    }

    style.setProperty('--svh', `${$html.clientHeight * 0.01}px`);
    style.setProperty('--dvh', `${window.innerHeight * 0.01}px`);
    style.setProperty('--lvh', `${measureLvh() * 0.01}px`);
}

// Without svh/dvh/lvh support, 100vh is the large viewport.
function measureLvh(): number {
    const $probe = document.createElement('div');
    $probe.style.cssText =
        'position: fixed; top: 0; left: 0; width: 1px; height: 100vh; visibility: hidden;';
    $body.append($probe);
    const height = $probe.clientHeight;
    $probe.remove();
    return height;
}
