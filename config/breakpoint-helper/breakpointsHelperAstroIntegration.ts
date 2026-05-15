import fs from 'node:fs';
import path from 'node:path';

import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { breakpointToType } from './breakpointToType.ts';

const BREAKPOINTS_ENTRY_PATH = 'src/styles/tailwind.css';
const VIRTUAL_MODULE_ID = 'virtual:breakpoints';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

type BreakpointEntry = { name: string; value: number };

/**
 * Extract breakpoints with their values from tailwind.css CSS custom properties.
 * Warns on `--breakpoint-*` declarations that are not integer-px (e.g. `1rem`,`1.5px`)
 * since the runtime relies on integer-px values.
 */
function extractBreakpoints(cssContent: string, logger: AstroIntegrationLogger): BreakpointEntry[] {
    const declarationRegex = /--breakpoint-([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
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

        breakpoints.push({ name, value: parseInt(pxMatch[1], 10) });
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
    rootDir: string,
    breakpointsEntry: string,
    logger: AstroIntegrationLogger
): BreakpointEntry[] {
    const cssPath = path.join(rootDir, breakpointsEntry);
    try {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        const breakpoints = extractBreakpoints(cssContent, logger);

        breakpointToType(breakpoints);
        logger.info(
            `Generated types/generated/breakpoints.d.ts (${breakpoints.length} breakpoints)`
        );

        return breakpoints;
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.warn(`Failed to read or generate breakpoints from ${cssPath}: ${message}`);
        return [];
    }
}

/**
 * Astro integration for breakpoint types and virtual module.
 * - Generates types/virtual-breakpoints.d.ts on dev server start and build
 * - Provides virtual:breakpoints module for runtime access to breakpoint values
 */
export default function breakpointsHelperAstroIntegration(
    breakpointsEntry: string = BREAKPOINTS_ENTRY_PATH
): AstroIntegration {
    let breakpoints: BreakpointEntry[] = [];
    let rootDir: string;

    return {
        name: 'breakpoints-helper',
        hooks: {
            'astro:config:setup': ({ config, updateConfig, logger }) => {
                rootDir = config.root.pathname;

                // Generate types and extract breakpoints
                breakpoints = readAndGenerateTypes(rootDir, breakpointsEntry, logger);

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
                                }
                            }
                        ]
                    }
                });
            }
        }
    };
}
