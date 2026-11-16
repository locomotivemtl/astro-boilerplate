import { fileURLToPath } from 'node:url';

import type { AstroIntegration } from 'astro';

import { writeGeneratedTypes } from '../utils/writeGeneratedTypes.ts';
import { defineToType } from './defineToType.ts';

export type Define = Record<string, unknown>;

function stringifyDefine(define: Define): Record<string, string> {
    return Object.fromEntries(
        Object.entries(define).map(([key, value]) => [
            key,
            typeof value === 'string' ? value : JSON.stringify(value),
        ]),
    );
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

/** Build time as `YYYY-MM-DDTHH:MM:SS`, in local time. */
function getTimestamp(): string {
    const now = new Date();

    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return `${date}T${time}`;
}

/**
 * Astro integration that fills Vite's `define` option with compile-time constants.
 * - Provides `__IS_PROD__` and `__TIMESTAMP__`, merged with any constants passed in
 * - Generates types/generated/define.d.ts on dev server start and build
 */
export default function defineAstroIntegration(define: Define = {}): AstroIntegration {
    return {
        name: 'define',
        hooks: {
            'astro:config:setup': ({ command, config, updateConfig, logger }) => {
                const rootDir = fileURLToPath(config.root);
                // `NODE_ENV=development astro build` still produces a debug build
                const isProd = command === 'build' && process.env.NODE_ENV !== 'development';
                const mergedDefine: Define = {
                    __IS_PROD__: isProd,
                    __TIMESTAMP__: JSON.stringify(getTimestamp()),
                    ...define,
                };

                const file = writeGeneratedTypes(
                    rootDir,
                    'define.d.ts',
                    "types for Vite's `define` option",
                    defineToType(mergedDefine),
                );
                logger.info(`Generated ${file} (${Object.keys(mergedDefine).length} constants)`);

                updateConfig({
                    vite: {
                        define: stringifyDefine(mergedDefine),
                    },
                });
            },
        },
    };
}
