import { lighten, normalizeColor } from '@scripts/utils/colors';

interface LoggerOptions {
    id?: string;
    color?: string;
    backgroundColor?: string;
}

export interface Logger {
    log: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    table: (tabularData: unknown) => void;
    time: (label?: string) => void;
    timeEnd: (label?: string) => void;
    group: (...label: unknown[]) => void;
    groupEnd: () => void;
    groupCollapsed: (...label: unknown[]) => void;
    clear: () => void;
}

const PREDEFINED_COLORS_LIGHT = {
    error: '#ff3333',
    warn: '#ffaa00',
    info: '#3399ff',
    debug: '#999999',
    log: '#312dfb' // default, will be overridden by custom color
} as const;

const PREDEFINED_COLORS_DARK = {
    error: lighten(PREDEFINED_COLORS_LIGHT.error, 0.5),
    warn: lighten(PREDEFINED_COLORS_LIGHT.warn, 0.5),
    info: lighten(PREDEFINED_COLORS_LIGHT.info, 0.5),
    debug: lighten(PREDEFINED_COLORS_LIGHT.debug, 0.5),
    log: lighten(PREDEFINED_COLORS_LIGHT.log, 0.5) // lighter version for dark mode
} as const;

/**
 * Detects if the user's device is in dark mode
 */
function isDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Gets the appropriate color set based on dark mode
 */
function getColors() {
    return isDarkMode() ? PREDEFINED_COLORS_DARK : PREDEFINED_COLORS_LIGHT;
}

/**
 * Converts a color to a background color with opacity
 */
function colorToBgColor(color: string, opacity: number = 0.1): string {
    // If it's already rgba, extract RGB values and update opacity
    if (color.startsWith('rgba')) {
        const match = color.match(/rgba?\(([^)]+)\)/);
        if (match) {
            const values = match[1].split(',').map((v) => v.trim());
            return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${values[3] ?? opacity})`;
        }
    }

    // If it's rgb, convert to rgba
    if (color.startsWith('rgb')) {
        const match = color.match(/rgb\(([^)]+)\)/);
        if (match) {
            return `rgba(${match[1]}, ${opacity})`;
        }
    }

    // If it's hex, convert to rgba
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Fallback: return as is
    return color;
}

/**
 * Creates a console method wrapper that preserves the original call site
 * by using Function.prototype.bind to maintain the stack trace
 *
 * Using bind() ensures that browser devtools show the actual caller's file
 * instead of this logger wrapper file
 */
function createConsoleMethod(
    consoleMethod: typeof console.log,
    prefix?: string,
    style?: string
): (...args: unknown[]) => void {
    if (prefix && style) {
        // Use bind to prepend prefix and style while preserving call site
        // This creates a bound function that behaves as if console.log was called directly
        return Function.prototype.bind.call(consoleMethod, console, prefix, style);
    } else {
        // For methods without prefix/style, bind directly to preserve call site
        return Function.prototype.bind.call(consoleMethod, console);
    }
}

/**
 * Creates a stylized logger with predefined colors and custom log color
 * @param options - Logger configuration
 * @param options.id - Optional prefix identifier (e.g., 'LOCO'). If not provided, no prefix is added.
 * @param options.color - Custom color for log method (hex or rgb)
 * @returns Logger object with all console methods
 *
 * @example
 * const logger = createLogger({ id: 'LOCO', color: '#312dfb' });
 * logger.log('Hello'); // Outputs: LOCO Hello (in #312dfb)
 * logger.error('Error!'); // Outputs: LOCO • error Error! (in red)
 *
 * @example
 * const logger = createLogger({ color: '#312dfb' });
 * logger.log('Hello'); // Outputs: Hello (no prefix, but with color if supported)
 */
export function createLogger(options: LoggerOptions = {}): Logger {
    /* Disable custom Logger in production */
    if (!__DEBUG__) {
        return {
            log: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
            debug: () => {},
            table: () => {},
            time: () => {},
            timeEnd: () => {},
            group: () => {},
            groupEnd: () => {},
            groupCollapsed: () => {},
            clear: () => {}
        };
    }

    const { id, color, backgroundColor } = options;
    const colors = getColors();
    // const bgColors = getBgColors();
    const normalizedColor = color ? normalizeColor(color) : null;
    const logColor = normalizedColor
        ? lighten(normalizedColor, isDarkMode() ? 0.4 : 0)
        : colors.log;

    // const logBgColor = color
    //     ? colorToBgColor(logColor)
    //     : colorToBgColor(backgroundColor ?? bgColors.log);
    const logBgColor = backgroundColor
        ? colorToBgColor(backgroundColor, 1)
        : lighten(colorToBgColor(logColor, 0.2), isDarkMode() ? 0.4 : 0);
    const hasPrefix = Boolean(id);

    /**
     * Creates CSS style string for the prefix
     */
    function createStyle(color: string, bgColor?: string, borderColor?: string): string {
        const bgStyle = bgColor
            ? `background: ${bgColor}; border-radius: 4px; padding: 1px 6px;`
            : '';
        const borderStyle = borderColor ? `border-left: 2px solid ${borderColor};` : '';
        return `color: ${color}; font-weight: bold; text-box: trim-both cap alphabetic; ${bgStyle} ${borderStyle} padding: 4px 5px;`;
    }

    // Create all prefixes and styles once (only if id is provided)
    const prefixes = hasPrefix
        ? {
              log: `%c${id}`,
              info: `%c${id}`,
              warn: `%c${id}`,
              error: `%c${id}`,
              debug: `%c${id}`,
              table: `%c${id}`,
              time: `%c${id} • time`,
              timeEnd: `%c${id} • timeEnd`,
              group: `%c${id}`,
              groupCollapsed: `%c${id}`
          }
        : null;

    const styles = hasPrefix
        ? {
              log: createStyle(logColor, logBgColor),
              info: createStyle(logColor, logBgColor, colors.info),
              warn: createStyle(logColor, logBgColor, colors.warn),
              error: createStyle(logColor, logBgColor, colors.error),
              debug: createStyle(logColor, logBgColor, colors.debug),
              table: createStyle(logColor, logBgColor),
              time: createStyle(logColor, logBgColor),
              timeEnd: createStyle(logColor, logBgColor),
              group: createStyle(logColor, logBgColor),
              groupCollapsed: createStyle(logColor, logBgColor)
          }
        : null;

    return {
        log: createConsoleMethod(
            console.log,
            hasPrefix && prefixes ? prefixes.log : undefined,
            hasPrefix && styles ? styles.log : undefined
        ),

        info: createConsoleMethod(
            console.info,
            hasPrefix && prefixes ? prefixes.info : undefined,
            hasPrefix && styles ? styles.info : undefined
        ),

        warn: createConsoleMethod(
            console.warn,
            hasPrefix && prefixes ? prefixes.warn : undefined,
            hasPrefix && styles ? styles.warn : undefined
        ),

        error: createConsoleMethod(
            console.error,
            hasPrefix && prefixes ? prefixes.error : undefined,
            hasPrefix && styles ? styles.error : undefined
        ),

        debug: createConsoleMethod(
            console.debug,
            hasPrefix && prefixes ? prefixes.debug : undefined,
            hasPrefix && styles ? styles.debug : undefined
        ),

        table: (tabularData: unknown) => {
            if (hasPrefix && prefixes && styles) {
                // Prefix log will show logger.ts, but table call will show correct call site
                console.log(prefixes.table, styles.table);
            }
            // Use bind to preserve call site for the actual table call
            Function.prototype.bind.call(console.table, console)(tabularData);
        },

        time: (label?: string) => {
            if (hasPrefix && prefixes && styles) {
                // Prefix log will show logger.ts, but time call will show correct call site
                console.log(prefixes.time, styles.time);
            }
            // Use bind to preserve call site
            Function.prototype.bind.call(console.time, console)(label);
        },

        timeEnd: (label?: string) => {
            if (hasPrefix && prefixes && styles) {
                // Prefix log will show logger.ts, but timeEnd call will show correct call site
                console.log(prefixes.timeEnd, styles.timeEnd);
            }
            // Use bind to preserve call site
            Function.prototype.bind.call(console.timeEnd, console)(label);
        },

        group: createConsoleMethod(
            console.group,
            hasPrefix && prefixes ? prefixes.group : undefined,
            hasPrefix && styles ? styles.group : undefined
        ),

        groupEnd: Function.prototype.bind.call(console.groupEnd, console),

        groupCollapsed: createConsoleMethod(
            console.groupCollapsed,
            hasPrefix && prefixes ? prefixes.groupCollapsed : undefined,
            hasPrefix && styles ? styles.groupCollapsed : undefined
        ),

        clear: () => {
            console.clear();
        }
    };
}
