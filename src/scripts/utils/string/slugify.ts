/**
 * Turns text into a URL-safe slug: `Hello, World!` becomes `hello-world`,
 * `L'été à Montréal` becomes `lete-a-montreal`.
 */
export const slugify = (str: string): string =>
    str
        .normalize('NFD')
        .replace(/\p{M}/gu, '') // é becomes e instead of being dropped
        .replace(/['’]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
