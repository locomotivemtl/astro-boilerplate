import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svgSprite from 'astro-svg-sprite';
import tailwindConfig from './tailwind.config';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
        css: {
            postcss: {
                plugins: [
                    postcssTailwindShortcuts(tailwindConfig.theme, { prefix: 'theme' }),
                    postcssHelpersFunctions()
                ]
            }
        },
        esbuild: {
            drop: isProd ? ['console', 'debugger'] : []
        }
    },
    integrations: [
        tailwind({
            applyBaseStyles: false,
            nesting: true
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
