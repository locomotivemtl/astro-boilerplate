import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { breakpointToType, type BreakpointEntry } from './breakpointToType.ts';

const BREAKPOINTS_ENTRY_PATH = 'src/styles/tailwind.css';
const VIRTUAL_MODULE_ID = 'virtual:breakpoints';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

// The hook runs once per environment per save, regenerate only once
let lastHotUpdateTimestamp = 0;

/**
 * Extract breakpoints with their values from tailwind.css CSS custom properties.
 * Warns on `--breakpoint-*` declarations that are not integer-px (e.g. `1rem`,`1.5px`)
 * since the runtime relies on integer-px values.
 */
export function extractBreakpoints(
    cssContent: string,
    logger: AstroIntegrationLogger
): BreakpointEntry[] {
    const declarationRegex = /--breakpoint-([a-zA-Z0-9-]+)\s*:\s*([^;}]+?)\s*(?:[;}]|$)/g;
    const integerPxRegex = /^(\d+)px$/;
    const breakpoints: BreakpointEntry[] = [];
    let match: RegExpExecArray | null;

    while ((match = declarationRegex.exec(cssContent)) !== null) {
        const name = match[1];
        const rawValue = match[2].trim();
        const pxMatch = rawValue.match(integerPxRegex);

        if (!pxMatch) {
            logger.warn(
                `Skipping --breakpoint-${name}: "${rawValue}" — expected an integer-px value (e.g. "700px").`
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
    // Sort by value ascending
    return breakpoints.sort((a, b) => a.value - b.value);
}

/**
 * Generate virtual module content with breakpoint values (pure JavaScript)
 */
function generateVirtualModule(breakpoints: BreakpointEntry[]): string {
    const entries = breakpoints.map((bp) => `    '${bp.name}': ${bp.value}`).join(',\n');
    const names = breakpoints.map((bp) => `'${bp.name}'`).join(', ');

    return `/**
 * Auto-generated breakpoint values from tailwind.css
 * This is a virtual module - import from 'virtual:breakpoints'
 */

export const breakpoints = Object.freeze({
${entries}
});

export const BREAKPOINT_NAMES = Object.freeze([${names}]);
`;
}

/**
 * Read CSS and extract breakpoints, generate type declaration file
 */
function readAndGenerateTypes(
    cssPath: string,
    rootDir: string,
    logger: AstroIntegrationLogger
): BreakpointEntry[] | null {
    try {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        const breakpoints = extractBreakpoints(cssContent, logger);

        breakpointToType(breakpoints, rootDir);
        logger.info(
            `Generated types/generated/breakpoints.d.ts (${breakpoints.length} breakpoints)`
        );

        return breakpoints;
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.warn(`Failed to read or generate breakpoints from ${cssPath}: ${message}`);
        return null;
    }
}

/**
 * Astro integration for breakpoint types and virtual module.
 * - Generates types/generated/breakpoints.d.ts on dev server start and build
 * - Provides virtual:breakpoints module for runtime access to breakpoint values
 * - Re-reads the stylesheet when it changes in dev
 */
export default function breakpointsHelperAstroIntegration(
    breakpointsEntry: string = BREAKPOINTS_ENTRY_PATH
): AstroIntegration {
    let breakpoints: BreakpointEntry[] = [];
    let rootDir: string;
    let cssPath: string;
    let logger: AstroIntegrationLogger;

    return {
        name: 'breakpoints-helper',
        hooks: {
            'astro:config:setup': ({ config, updateConfig, logger: setupLogger }) => {
                rootDir = fileURLToPath(config.root);
                cssPath = path.join(rootDir, breakpointsEntry);
                logger = setupLogger;

                // Generate types and extract breakpoints
                breakpoints = readAndGenerateTypes(cssPath, rootDir, logger) ?? [];

                // Add minimal Vite plugin for virtual module resolution
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
                                    if (path.normalize(file) !== path.normalize(cssPath)) return;

                                    if (timestamp !== lastHotUpdateTimestamp) {
                                        lastHotUpdateTimestamp = timestamp;

                                        const next = readAndGenerateTypes(cssPath, rootDir, logger);
                                        // A transient read failure (editor atomic save) must not wipe good values
                                        if (!next) return;
                                        breakpoints = next;
                                    }

                                    const mod = this.environment.moduleGraph.getModuleById(
                                        RESOLVED_VIRTUAL_MODULE_ID
                                    );
                                    if (!mod) return;

                                    this.environment.moduleGraph.invalidateModule(mod);
                                    this.environment.hot.send({ type: 'full-reload' });
                                }
                            }
                        ]
                    }
                });
            }
        }
    };
}
