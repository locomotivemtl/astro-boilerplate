// import { $html } from '@scripts/utils/dom/dom.ts';
const $html = document.documentElement;
import { setViewportSize } from '@scripts/utils/setViewportSize.ts';
import { atom } from 'nanostores';

// =============================================================================
// Types
// =============================================================================

export type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown';

export type BrowserName =
    | 'arc'
    | 'chrome'
    | 'edge'
    | 'opera'
    | 'samsung'
    | 'firefox'
    | 'safari'
    | 'unknown';

export type DeviceInfo = {
    type: DeviceType;
    name: string;
    browser: BrowserName;
    canHover: boolean;
    hasDvh: boolean;
};

// =============================================================================
// Device maps
// =============================================================================

const iosDeviceMapping = new Map<string, string>([
    ['320x480', 'iPhone 4S, 4, 3GS, 3G, 1st gen'],
    ['320x568', 'iPhone 5, SE 1st Gen, 5C, 5S'],
    ['375x667', 'iPhone SE 2nd Gen, 6, 6S, 7, 8'],
    ['375x812', 'iPhone X, XS, 11 Pro, 12 Mini, 13 Mini'],
    ['390x844', 'iPhone 14, 13, 13 Pro, 12, 12 Pro'],
    ['393x852', 'iPhone 16, 15 Pro, 15, 14 Pro'],
    ['402x874', 'iPhone 16 Pro'],
    ['414x736', 'iPhone 8+'],
    ['414x896', 'iPhone 11, XR, XS Max, 11 Pro Max'],
    ['428x926', 'iPhone 14 Plus, 13 Pro Max, 12 Pro Max'],
    ['430x932', 'iPhone 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max'],
    ['440x956', 'iPhone 16 Pro Max'],
    ['476x847', 'iPhone 7+, 6+, 6S+'],
    ['744x1133', 'iPad mini 6th–7th Gen'],
    [
        '768x1024',
        'iPad mini (5th Gen), iPad (1–6th Gen), iPad Pro 9.7", iPad mini (1–4), iPad Air (1–2)'
    ],
    ['810x1080', 'iPad 7–9th Gen'],
    ['820x1180', 'iPad Air 11" M2, iPad Air (4th gen)'],
    ['834x1112', 'iPad Air (3rd gen), iPad Pro 10.5"'],
    ['834x1194', 'iPad Pro 11" M4, iPad Pro 11" (3–5th Gen)'],
    ['1024x1366', 'iPad Air 13" M2, iPad Pro 12.9" (1–5th Gen)'],
    ['1032x1376', 'iPad Pro 13" M4']
]);

// navigator.userAgentData.platform values for Chromium-based browsers (Arc, Chrome, Edge).
const desktopDeviceMapping = new Map<string, string>([
    ['Windows', 'Windows'],
    ['macOS', 'Mac OS']
]);

// =============================================================================
// Helpers
// =============================================================================

// Chrome 110+ freezes the UA model field to "K" — this regex is kept as a
// sync fallback but will return "K" on modern Android Chrome. The async
// getHighEntropyValues call below is the authoritative source for Android model.
const getAndroidDeviceName = (): string => {
    const match = /Android[^;]*;\s*([^)]+)\)/.exec(window.navigator.userAgent);
    if (match?.[1]) return match[1].trim().split(' ')[0];
    return 'Android';
};

const getIosDeviceName = (): string => {
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    return iosDeviceMapping.get(screenResolution) ?? 'iPhone';
};

const getDesktopDeviceName = (): string => {
    const platform = navigator.userAgentData?.platform;
    if (platform) return desktopDeviceMapping.get(platform) ?? 'Desktop';
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'Mac OS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Desktop';
};

function getBrowserName(): BrowserName {
    // navigator.userAgentData.brands is the modern way to identify Chromium-based browsers
    // (Arc, Chrome, Edge, Opera, Samsung Internet) without brittle UA string parsing.
    // The array always contains noise entries like "Not/A)Brand" — filter those out first.
    const brands =
        navigator.userAgentData?.brands
            .filter(({ brand }) => !brand.includes('Not'))
            .map(({ brand }) => brand) ?? [];

    if (brands.length > 0) {
        if (brands.some((b) => b === 'Arc')) return 'arc';
        if (brands.some((b) => b === 'Microsoft Edge')) return 'edge';
        if (brands.some((b) => b === 'Opera')) return 'opera';
        if (brands.some((b) => b === 'Samsung Internet')) return 'samsung';
        if (brands.some((b) => b === 'Google Chrome' || b === 'Chromium')) return 'chrome';
    }

    // Fallback for Safari and Firefox (no userAgentData support)
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';

    return 'unknown';
}

function getDeviceType(): DeviceType {
    const ua = window.navigator.userAgent;
    if (!ua.toLowerCase().includes('mobi')) return 'desktop';
    if (ua.includes('Android')) return 'android';
    if (/iP(hone|ad|od)/.test(ua)) return 'ios';
    return 'unknown';
}

// =============================================================================
// Default export — backwards compat
// =============================================================================

export default function getDeviceName(): string {
    const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');
    if (isMobile) {
        if (window.navigator.userAgent.includes('Android')) return getAndroidDeviceName();
        return getIosDeviceName();
    }
    return getDesktopDeviceName();
}

// =============================================================================
// Store
// =============================================================================

setViewportSize();

export const $deviceInfo = atom<DeviceInfo>({
    type: getDeviceType(),
    name: getDeviceName(),
    browser: getBrowserName(),
    canHover: window.matchMedia('(hover: hover)').matches,
    hasDvh:
        document.documentElement.style.getPropertyValue('--svh') !==
        document.documentElement.style.getPropertyValue('--lvh')
});

// Async upgrade via UA Client Hints (Chromium-based browsers: Arc, Chrome, Edge).
// Chrome 110+ reduces the UA string Android model to "K" — getHighEntropyValues
// is the only way to retrieve the real device model on modern Android browsers.
navigator.userAgentData
    ?.getHighEntropyValues(['model'])
    .then(({ model }) => {
        if (model && model !== 'K') {
            $deviceInfo.set({ ...$deviceInfo.get(), name: model });
        }
    })
    .catch(() => {
        // Non-secure context or permission denied — sync value is kept.
    });

$html.classList.toggle('can-hover', $deviceInfo.get().canHover);
$html.classList.toggle('has-dvh', $deviceInfo.get().hasDvh);
