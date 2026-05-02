// Type declarations for the User-Agent Client Hints API (navigator.userAgentData).
// Supported in Chromium-based browsers (Arc, Chrome, Edge) — not in Safari or Firefox.
// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData

interface UABrandVersion {
    readonly brand: string;
    readonly version: string;
}

interface UADataValues {
    readonly brands?: ReadonlyArray<UABrandVersion>;
    readonly mobile?: boolean;
    readonly platform?: string;
    readonly architecture?: string;
    readonly bitness?: string;
    readonly model?: string;
    readonly platformVersion?: string;
    readonly fullVersionList?: ReadonlyArray<UABrandVersion>;
    readonly uaFullVersion?: string;
    readonly wow64?: boolean;
}

interface NavigatorUAData {
    readonly brands: ReadonlyArray<UABrandVersion>;
    readonly mobile: boolean;
    readonly platform: string;
    getHighEntropyValues(hints: ReadonlyArray<string>): Promise<UADataValues>;
    toJSON(): Pick<NavigatorUAData, 'brands' | 'mobile' | 'platform'>;
}

interface Navigator {
    readonly userAgentData?: NavigatorUAData;
}
