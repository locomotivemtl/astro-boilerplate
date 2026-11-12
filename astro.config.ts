/* PostCSS plugins */
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
/* Vite plugins */
import tailwindcss from '@tailwindcss/vite';
/* Astro Integrations / Plugins */
import icon from 'astro-icon';
import { defineConfig, fontProviders } from 'astro/config';
import postcssUtopia from 'postcss-utopia';
import { loadEnv } from 'vite';

/* Get server allowed hosts from .env */
const ENVS = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');
const SERVER_ALLOWED_HOSTS = (ENVS?.SERVER_ALLOWED_HOSTS || '').split(',') || [];

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
        css: {
            postcss: {
                plugins: [
                    // Run after @tailwindcss/vite, which transforms CSS in a `pre` hook
                    postcssUtopia(),
                    postcssHelpersFunctions(),
                    postcssTailwindShortcuts(),
                ],
            },
        },
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: [
                '@locomotivemtl/grid-helper',
                '@locomotivemtl/component-manager',
                'locomotive-scroll',
                '@swup/head-plugin',
                '@swup/preload-plugin',
                '@swup/scripts-plugin',
                'swup',
                'nanostores',
            ],
        },
        build: {
            chunkSizeWarningLimit: 1000,
        },
    },
    integrations: [
        icon({
            iconDir: './src/assets/svgs',
        }),
    ],
    server: {
        allowedHosts: SERVER_ALLOWED_HOSTS,
    },
    devToolbar: {
        enabled: false,
    },
    image: {
        domains: ['locomotive.ca'],
        remotePatterns: [{ protocol: 'https' }],
    },
    fonts: [
        {
            provider: fontProviders.local(),
            name: 'Source Sans Pro',
            cssVariable: '--custom-font-sans',
            fallbacks: ['sans-serif'],
            options: {
                variants: [
                    {
                        weight: 400,
                        style: 'normal',
                        display: 'swap',
                        src: ['./src/assets/fonts/SourceSans3-Regular.woff2'],
                    },
                    {
                        weight: 700,
                        style: 'normal',
                        display: 'swap',
                        src: ['./src/assets/fonts/SourceSans3-Bold.woff2'],
                    },
                ],
            },
        },
    ],
});
