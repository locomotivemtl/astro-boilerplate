/** Upper-cases the first character. Returns `''` for an empty string. */
export const ucfirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/** Lower-cases the first character. Returns `''` for an empty string. */
export const lcfirst = (str: string): string => str.charAt(0).toLowerCase() + str.slice(1);

// Splits on case changes, spaces, dashes and underscores; acronyms stay one word (XMLHttp is XML, Http)
const words = (str: string): string[] =>
    str
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((word) => word.toLowerCase());

/** `fooBarBaz` becomes `foo-bar-baz`, `myURL` becomes `my-url`. */
export const camelToKebab = (str: string): string => words(str).join('-');

/** `fooBarBaz` becomes `foo_bar_baz`, `myURL` becomes `my_url`. */
export const camelToSnake = (str: string): string => words(str).join('_');

/** `foo-bar-baz` becomes `fooBarBaz`. */
export const kebabToCamel = (str: string): string =>
    words(str)
        .map((word, i) => (i ? ucfirst(word) : word))
        .join('');

/** `foo-bar`, `foo_bar` or `fooBar` become `FooBar`. Acronyms lose their caps: `XMLHttp` becomes `XmlHttp`. */
export const toPascal = (str: string): string => words(str).map(ucfirst).join('');
