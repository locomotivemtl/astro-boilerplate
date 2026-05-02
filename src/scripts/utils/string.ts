export const toDash = (str: string) =>
    str
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();

export const hash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createUUID = () => {
    // Simple UUID v4 polyfill (RFC4122 compliant, no crypto)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const sanitize = (str: string) => {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .trim() // Trim whitespace
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .toLowerCase(); // Convert to lowercase
};

export const kamelCaseToDash = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Add dash between camelCase words
        .trim()
        .toLowerCase();
};

export const lcfirst = (str = '') => str[0].toLowerCase() + str.slice(1);

export const normalizeSlashHref = (href: string) => {
    if (href.startsWith('/')) return href;
    return '/' + href;
};
