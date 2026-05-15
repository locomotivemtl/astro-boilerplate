import type { AstroIntegration } from 'astro';
import { loadEnv } from 'vite';

import { defineToType } from './defineToType.ts';

export type DefineValue = string | boolean;

const ENVS = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');
const IS_PROD =
    ENVS?.PROD ||
    ENVS?.MODE === 'production' ||
    ENVS?.NODE_ENV === 'production' ||
    ENVS?.VERCEL_ENV === 'production' || // Vercel env var
    ENVS?.CONTEXT === 'production'; // Netlify env var

const DEFAULT_DEFINES: Record<string, DefineValue> = {
    __IS_DEV__: !IS_PROD
};

function stringifyDefines(defines: Record<string, DefineValue>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(defines).map(([key, value]) => [
            key,
            typeof value === 'string' ? value : JSON.stringify(value)
        ])
    );
}

export default function definesAstroIntegration(
    defines: Record<string, DefineValue> = {}
): AstroIntegration {
    return {
        name: 'defines-astro-integration',
        hooks: {
            'astro:config:setup': ({ updateConfig, logger }) => {
                const mergedDefines = Object.assign(DEFAULT_DEFINES, defines);
                defineToType(mergedDefines);

                logger.info('Generated types/generated/defines.d.ts');

                updateConfig({
                    vite: {
                        define: stringifyDefines(mergedDefines)
                    }
                });
            }
        }
    };
}
