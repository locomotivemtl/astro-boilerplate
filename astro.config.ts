import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svgSprite from 'astro-svg-sprite';
import tailwindConfig from './tailwind.config';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import removeDoubleParentheses from '@locomotivemtl/postcss-remove-double-parentheses';
import vercel from '@astrojs/vercel/serverless';

const isProd = import.meta.env.PROD;

import { defaultLocale, locales } from './src/scripts/utils/i18n';

// https://astro.build/config
export default defineConfig({
    site: 'https://astro-boilerplate-git-feat-i18n-routing-locomotivemtl.vercel.app',
    output: 'hybrid',
    adapter: vercel(),
    i18n: {
        defaultLocale: defaultLocale,
        locales: locales,
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: false,
            fallbackType: 'redirect'
        }
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    additionalData: `
                        @use "sass:math";
                        @use "sass:list";
                        @use "@styles/tools/maths" as *;
                        @use "@styles/tools/functions" as *;
                    `
                }
            },
            postcss: {
                plugins: [
                    postcssTailwindShortcuts(tailwindConfig.theme, { prefix: 'theme' }),
                    removeDoubleParentheses()
                ]
            }
        },
        esbuild: {
            drop: isProd ? ['console', 'debugger'] : []
        }
    },
    integrations: [
        tailwind({
            applyBaseStyles: false
        }),
        svgSprite({
            include: './src/assets/svgs'
        })
    ],
    devToolbar: {
        enabled: false
    },
    image: {
        domains: ['locomotive.ca'],
        remotePatterns: [{ protocol: 'https' }]
    }
});
