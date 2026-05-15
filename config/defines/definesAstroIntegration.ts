import type { AstroIntegration } from 'astro';
import { loadEnv } from 'vite';

import { defineToType } from './defineToType.ts';

export type Defines = Record<string, any>;

const ENVS = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');
const IS_PROD =
    ENVS?.PROD ||
    ENVS?.MODE === 'production' ||
    ENVS?.NODE_ENV === 'production' ||
    ENVS?.VERCEL_ENV === 'production' || // Vercel env var
    ENVS?.CONTEXT === 'production'; // Netlify env var

const DEFAULT_DEFINES: Defines = {
    __IS_DEV__: !IS_PROD
};

function stringifyDefines(defines: Defines): Record<string, string> {
    return Object.fromEntries(
        Object.entries(defines).map(([key, value]) => [
            key,
            typeof value === 'string' ? value : JSON.stringify(value)
        ])
    );
}

export default function definesAstroIntegration(defines: Defines = {}): AstroIntegration {
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
