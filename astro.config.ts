import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svgSprite from 'astro-svg-sprite';
import tailwindConfig from './tailwind.config';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import vercelStatic from '@astrojs/vercel/static';

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    output: 'static',
    adapter: vercelStatic(),
    i18n: {
        defaultLocale: 'fr',
        locales: ['fr', 'en'],
        routing: {
            prefixDefaultLocale: true,
            fallbackType: 'redirect'
        }
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "sass:math";
                        @use "sass:list";
                        @use "@styles/tools/maths" as *;
                        @use "@styles/tools/functions" as *;
                    `
                }
            },
            postcss: {
                plugins: [postcssTailwindShortcuts(tailwindConfig.theme)]
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
