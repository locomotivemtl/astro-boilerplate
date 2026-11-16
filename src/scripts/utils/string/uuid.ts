/**
 * Random RFC 4122 version 4 UUID, for example `3b241101-e2bb-4255-8caf-4136c566a962`.
 */
export const createUUID = (): string => {
    // getRandomValues, not randomUUID: randomUUID needs a secure context, and `astro dev --host` over LAN http is not one
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const hex = Array.from(b, (n) => n.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
