import fs from 'node:fs';
import path from 'node:path';

import type { AstroIntegration } from 'astro';
import { loadEnv } from 'vite';

import { defineToType } from './defineToType.ts';

const ENVS = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');
const IS_PROD =
    ENVS?.PROD ||
    ENVS?.MODE === 'production' ||
    ENVS?.NODE_ENV === 'production' ||
    ENVS?.VERCEL_ENV === 'production' ||
    ENVS?.CONTEXT === 'production';

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
// Remove special characters and scope from the package name for a cleaner define
const projectName = packageJson.name.replace(/[@/-]/g, '_').toUpperCase();

type DefineValue = string | boolean | number;

// Vite's define requires stringified values for text replacement
const DEFINES: Record<string, DefineValue> = {
    __IS_PROD__: IS_PROD,
    __IS_DEV__: !IS_PROD,
    __DEBUG__: !IS_PROD,
    __PROJECT_NAME__: JSON.stringify(projectName || 'locomotive-project-name')
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
                const mergedDefines = Object.assign(DEFINES, defines);
                const stringifiedDefines = stringifyDefines(mergedDefines);
                defineToType(stringifiedDefines, 'defines');
                logger.info('Generated types/gen-defines.d.ts');

                updateConfig({
                    vite: {
                        define: stringifiedDefines
                    }
                });
            }
        }
    };
}
