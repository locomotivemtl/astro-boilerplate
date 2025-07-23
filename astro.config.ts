import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';

const isProd = import.meta.env.PROD;

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
    },
    experimental: {
        fonts: [
            {
                provider: 'local',
                name: 'Source Sans Pro',
                cssVariable: '--custom-font-sans',
                fallbacks: ['sans-serif'],
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
        ]
    }
});
