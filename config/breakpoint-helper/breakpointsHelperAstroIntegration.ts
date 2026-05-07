import fs from 'node:fs';
import path from 'node:path';

import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { breakpointToType } from './breakpointToType.ts';

const BREAKPOINTS_ENTRY_PATH = 'src/styles/tailwind.css';
const VIRTUAL_MODULE_ID = 'virtual:breakpoints';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

type BreakpointEntry = { name: string; value: number };

/**
 * Extract breakpoints with their values from tailwind.css CSS custom properties
 */
function extractBreakpoints(cssContent: string): BreakpointEntry[] {
    const breakpointRegex = /--breakpoint-([a-zA-Z0-9-]+)\s*:\s*(\d+)px/g;
    const breakpoints: BreakpointEntry[] = [];
    let match: RegExpExecArray | null;

    while ((match = breakpointRegex.exec(cssContent)) !== null) {
        const name = match[1];
        const value = parseInt(match[2], 10);
        if (!breakpoints.some((bp) => bp.name === name)) {
            breakpoints.push({ name, value });
        }
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

export const breakpoints = {
${entries}
};

export const BREAKPOINT_NAMES = [${names}];
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
        const breakpoints = extractBreakpoints(cssContent);

        breakpointToType(breakpoints);
        logger.info(
            `Generated types/generated/breakpoints.d.ts (${breakpoints.length} breakpoints)`
        );

        return breakpoints;
    } catch {
        logger.warn('Failed to read or generate breakpoints from tailwind.css');
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
        name: 'breakpoints-helper-astro-integration',
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
