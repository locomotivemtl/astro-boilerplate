import { $screen } from '@scripts/stores/screen.ts';
import { dampPrecise, normalize } from '@scripts/utils/maths.ts';
import { map } from 'nanostores';

export type MouseState = {
    x: number;
    y: number;
    normalizedX: number;
    normalizedY: number;
    velocityX: number;
    velocityY: number;
};

export type SmoothMouseState = MouseState & {
    smoothing: number;
};

const HALF_SCREEN_WIDTH = $screen.value!.width * 0.5;
const HALF_SCREEN_HEIGHT = $screen.value!.height * 0.5;

export const $mouse = map<MouseState>({
    x: HALF_SCREEN_WIDTH,
    y: HALF_SCREEN_HEIGHT,
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0
});

export const $smoothMouse = map<SmoothMouseState>({
    x: HALF_SCREEN_WIDTH,
    y: HALF_SCREEN_HEIGHT,
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0,
    smoothing: 0.08
});

/* Mouse Update Loop */
let mouseRAF: null | number = null;
let isMouseLoopRunning = false;

const updateMouse = (): void => {
    // Mouse updates happen directly on mousemove event
    // This loop can be used for additional mouse-related updates if needed
    mouseRAF = requestAnimationFrame(updateMouse);
};

export const startMouseLoop = (): void => {
    if (isMouseLoopRunning || mouseRAF) return;
    updateMouse();
    isMouseLoopRunning = true;
};

export const stopMouseLoop = (): void => {
    if (!isMouseLoopRunning || !mouseRAF) return;
    cancelAnimationFrame(mouseRAF);
    mouseRAF = null;
    isMouseLoopRunning = false;
};

const onMouseMove = (event: MouseEvent | PointerEvent): void => {
    const { clientX, clientY } = event;

    const screen = $screen.get();
    const width = screen?.width ?? window.innerWidth;
    const height = screen?.height ?? window.innerHeight;

    const { x: prevX, y: prevY } = $mouse.value;

    $mouse.setKey('x', clientX);
    $mouse.setKey('y', clientY);
    $mouse.setKey('normalizedX', normalize(clientX, 0, width));
    $mouse.setKey('normalizedY', normalize(clientY, 0, height));
    $mouse.setKey('velocityX', clientX - prevX);
    $mouse.setKey('velocityY', clientY - prevY);
};

/* Smooth Mouse Update Loop */
let smoothMouseRAF: null | number = null;
let isSmoothMouseLoopRunning = false;
let lastFrameTime = performance.now();

const updateSmoothMouse = (): void => {
    const currentTime = performance.now();
    const dt = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    const { x, y } = $mouse.value;
    const { x: smoothX, y: smoothY, smoothing } = $smoothMouse.value;

    const screen = $screen.get();
    const width = screen?.width ?? window.innerWidth;
    const height = screen?.height ?? window.innerHeight;

    const updatedSmoothX = dampPrecise(smoothX, x, smoothing, dt);
    const updatedSmoothY = dampPrecise(smoothY, y, smoothing, dt);

    const smoothNormalizedX = normalize(updatedSmoothX, 0, width);
    const smoothNormalizedY = normalize(updatedSmoothY, 0, height);

    $smoothMouse.setKey('velocityX', updatedSmoothX - smoothX);
    $smoothMouse.setKey('velocityY', updatedSmoothY - smoothY);
    $smoothMouse.setKey('x', updatedSmoothX);
    $smoothMouse.setKey('y', updatedSmoothY);
    $smoothMouse.setKey('normalizedX', smoothNormalizedX);
    $smoothMouse.setKey('normalizedY', smoothNormalizedY);

    smoothMouseRAF = requestAnimationFrame(updateSmoothMouse);
};

export const startSmoothMouseLoop = (): void => {
    if (isSmoothMouseLoopRunning || smoothMouseRAF) return;
    lastFrameTime = performance.now();
    updateSmoothMouse();
    isSmoothMouseLoopRunning = true;
};

export const stopSmoothMouseLoop = (): void => {
    if (!isSmoothMouseLoopRunning || !smoothMouseRAF) return;
    cancelAnimationFrame(smoothMouseRAF);
    smoothMouseRAF = null;
    isSmoothMouseLoopRunning = false;
};

/* Events */
window.addEventListener('mousemove', onMouseMove);

/* Initialize smooth mouse loop */
startMouseLoop();
startSmoothMouseLoop();
