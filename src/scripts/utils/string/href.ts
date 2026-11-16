/** Prefixes `/` unless `href` already starts with one. */
export const normalizeSlashHref = (href: string): string =>
    href.startsWith('/') ? href : `/${href}`;
