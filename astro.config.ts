import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';

const isProd = import.meta.env.PROD;

const FONTS_FALLBACKS = {
    SANS: [
        '-apple-system',
        'BlinkMacSystemFont',
        'avenir next',
        'avenir',
        'segoe ui',
        'helvetica neue',
        'helvetica',
        'Cantarell',
        'Ubuntu',
        'roboto',
        'noto',
        'arial',
        'sans-serif'
    ],
    SERIF: [
        'Iowan Old Style',
        'Apple Garamond',
        'Baskerville',
        'Times New Roman',
        'Droid Serif',
        'Times',
        'Source Serif Pro',
        'serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol'
    ],
    MONO: ['Menlo', 'Consolas', 'Monaco', 'Liberation Mono', 'Lucida Console', 'monospace']
};

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
        css: {
            postcss: {
                plugins: [postcssUtopia(), postcssHelpersFunctions(), postcssTailwindShortcuts()]
            }
        },
        esbuild: {
            drop: isProd ? ['console', 'debugger'] : []
        },
        plugins: [tailwindcss()]
    },

    experimental: {
        fonts: [
            {
                provider: 'local',
                name: 'Source Sans Pro',
                cssVariable: '--custom-font-sans',
                fallbacks: FONTS_FALLBACKS.SANS,
                variants: [
                    {
                        weight: 400,
                        style: 'normal',
                        display: 'swap',
                        src: ['./src/assets/fonts/SourceSans3-Regular.woff2']
                    },
                    {
                        weight: 700,
                        style: 'normal',
                        display: 'swap',
                        src: ['./src/assets/fonts/SourceSans3-Bold.woff2']
                    }
                ]
            }
            // {
            //     provider: 'local',
            //     name: '[FONT SERIF NAME]',
            //     cssVariable: '--custom-font-serif',
            //     fallbacks: FONTS_FALLBACKS.SERIF,
            //     variants: [
            //         {
            //             weight: 400,
            //             style: 'normal',
            //             display: 'swap',
            //             src: ['./src/assets/fonts/[filename].woff2']
            //         },
            //     ]
            // },
            // {
            //     provider: 'local',
            //     name: '[FONT MONO NAME]',
            //     cssVariable: '--custom-font-mono',
            //     fallbacks: FONTS_FALLBACKS.MONO,
            //     variants: [
            //         {
            //             weight: 400,
            //             style: 'normal',
            //             display: 'swap',
            //             src: ['./src/assets/fonts/[filename].woff2']
            //         },
            //     ]
            // },
        ]
    },
    integrations: [
        icon({
            iconDir: './src/assets/svgs'
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
