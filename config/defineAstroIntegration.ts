import type { AstroIntegration } from 'astro';

import { defineToType } from './defineToType.ts';

export type Define = Record<string, any>;

function stringifyDefine(define: Define): Record<string, string> {
    return Object.fromEntries(
        Object.entries(define).map(([key, value]) => [
            key,
            typeof value === 'string' ? value : JSON.stringify(value)
        ])
    );
}

/** Build time as `YYYY-MM-DD_HH:MM:SS`, in local time. */
function getTimestamp(): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    const now = new Date();

    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return `${date}_${time}`;
}

export default function defineAstroIntegration(define: Define = {}): AstroIntegration {
    return {
        name: 'define-astro-integration',
        hooks: {
            'astro:config:setup': ({ command, updateConfig, logger }) => {
                // `NODE_ENV=development astro build` still produces a debug build
                const isProd = command === 'build' && process.env.NODE_ENV !== 'development';
                const mergedDefine: Define = {
                    __IS_PROD__: isProd,
                    __TIMESTAMP__: JSON.stringify(getTimestamp()),
                    ...define
                };
                defineToType(mergedDefine);

                logger.info('Generated types/generated/define.d.ts');

                updateConfig({
                    vite: {
                        define: stringifyDefine(mergedDefine)
                    }
                });
            }
        }
    };
}
