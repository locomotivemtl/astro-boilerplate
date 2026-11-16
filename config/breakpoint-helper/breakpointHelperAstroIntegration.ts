import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AstroIntegration, AstroIntegrationLogger } from 'astro';

import { writeGeneratedTypes } from '../utils/writeGeneratedTypes.ts';
import { breakpointToType, type BreakpointEntry } from './breakpointToType.ts';

const BREAKPOINTS_ENTRY_PATH = 'src/styles/breakpoints.css';
const VIRTUAL_MODULE_ID = 'virtual:breakpoints';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

/**
 * Extract breakpoints with their values from the breakpoints stylesheet's CSS custom properties.
 * Warns on `--breakpoint-*` declarations that are not integer-px (e.g. `1rem`,`1.5px`)
 * since the runtime relies on integer-px values.
 */
export function extractBreakpoints(
    cssContent: string,
    logger: AstroIntegrationLogger,
): BreakpointEntry[] {
    const declarationRegex = /--breakpoint-([\w-]+)\s*:\s*([^;}]+?)\s*(?:[;}]|$)/g;
    const integerPxRegex = /^(\d+)px$/;
    const breakpoints: BreakpointEntry[] = [];
    const css = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
    let match: RegExpExecArray | null;

    while ((match = declarationRegex.exec(css)) !== null) {
        const name = match[1];
        const rawValue = match[2].trim();
        const pxMatch = rawValue.match(integerPxRegex);

        if (!pxMatch) {
            logger.warn(
                `Skipping --breakpoint-${name}: "${rawValue}" — expected an integer-px value (e.g. "700px").`,
            );
            continue;
        }

        const value = parseInt(pxMatch[1], 10);
        const existing = breakpoints.find((bp) => bp.name === name);

        if (existing) {
            logger.warn(`Duplicate --breakpoint-${name}: keeping the last value (${value}px).`);
            existing.value = value;
            continue;
        }

        breakpoints.push({ name, value });
    }

    return breakpoints.toSorted((a, b) => a.value - b.value);
}

/**
 * Generate virtual module content with breakpoint values (pure JavaScript)
 */
function generateVirtualModule(breakpoints: BreakpointEntry[]): string {
    const entries = breakpoints.map((bp) => `    '${bp.name}': ${bp.value}`).join(',\n');
    const names = breakpoints.map((bp) => `'${bp.name}'`).join(', ');

    return `/**
 * Auto-generated breakpoint values from breakpoints.css
 * This is a virtual module - import from 'virtual:breakpoints'
 */

export const breakpoints = Object.freeze({
${entries}
});

export const BREAKPOINT_NAMES = Object.freeze([${names}]);
`;
}

/**
 * Read the CSS file and extract its breakpoints, or null when the file can't be read.
 */
function readBreakpoints(
    cssPath: string,
    logger: AstroIntegrationLogger,
): BreakpointEntry[] | null {
    try {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        const breakpoints = extractBreakpoints(cssContent, logger);

        if (breakpoints.length === 0) {
            logger.error(
                `No integer-px --breakpoint-* declarations found in ${cssPath} (rem is not supported yet).`,
            );
        }

        return breakpoints;
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.warn(`Failed to read breakpoints from ${cssPath}: ${message}`);
        return null;
    }
}

function writeTypes(
    breakpoints: BreakpointEntry[],
    rootDir: string,
    logger: AstroIntegrationLogger,
): void {
    const file = writeGeneratedTypes(
        rootDir,
        'breakpoints.d.ts',
        'types for the `virtual:breakpoints` module',
        breakpointToType(breakpoints),
    );
    logger.info(`Generated ${file} (${breakpoints.length} breakpoints)`);
}

/**
 * Astro integration for breakpoint types and virtual module.
 * - Generates types/generated/breakpoints.d.ts on dev server start and build
 * - Provides virtual:breakpoints module for runtime access to breakpoint values
 * - Re-reads the stylesheet when it changes in dev
 */
export default function breakpointHelperAstroIntegration(
    breakpointsEntry: string = BREAKPOINTS_ENTRY_PATH,
): AstroIntegration {
    let breakpoints: BreakpointEntry[] = [];
    let rootDir: string;
    let cssPath: string;
    let logger: AstroIntegrationLogger;
    // The hook runs once per environment per save, regenerate only once
    let lastHotUpdateTimestamp = 0;

    return {
        name: 'breakpoint-helper',
        hooks: {
            'astro:config:setup': ({ config, updateConfig, logger: setupLogger }) => {
                rootDir = fileURLToPath(config.root);
                cssPath = path.join(rootDir, breakpointsEntry);
                logger = setupLogger;

                breakpoints = readBreakpoints(cssPath, logger) ?? [];
                writeTypes(breakpoints, rootDir, logger);

                updateConfig({
                    vite: {
                        plugins: [
                            {
                                name: 'breakpoints-virtual-module',
                                resolveId(id) {
                                    if (id === VIRTUAL_MODULE_ID) {
                                        return RESOLVED_VIRTUAL_MODULE_ID;
                                    }
                                },
                                load(id) {
                                    if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                                        return generateVirtualModule(breakpoints);
                                    }
                                },
                                // Keeps script values in sync with the stylesheet in dev
                                hotUpdate({ file, timestamp }) {
                                    if (path.normalize(file) !== path.normalize(cssPath)) {
                                        return;
                                    }

                                    if (timestamp !== lastHotUpdateTimestamp) {
                                        lastHotUpdateTimestamp = timestamp;

                                        // A transient read failure (editor atomic save) must not wipe good values
                                        const next = readBreakpoints(cssPath, logger);
                                        if (next) {
                                            breakpoints = next;
                                            writeTypes(breakpoints, rootDir, logger);
                                        }
                                    }

                                    const mod = this.environment.moduleGraph.getModuleById(
                                        RESOLVED_VIRTUAL_MODULE_ID,
                                    );
                                    if (!mod) {
                                        return;
                                    }

                                    this.environment.moduleGraph.invalidateModule(mod);
                                    this.environment.hot.send({ type: 'full-reload' });
                                },
                            },
                        ],
                    },
                });
            },
        },
    };
}
