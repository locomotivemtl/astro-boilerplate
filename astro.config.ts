import { defineConfig } from 'astro/config';
import svgSprite from 'astro-svg-sprite';
import tailwindcss from '@tailwindcss/vite';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
        css: {
            postcss: {
                plugins: [postcssUtopia(), postcssHelpersFunctions()]
            }
        },
        esbuild: {
            drop: isProd ? ['console', 'debugger'] : []
        },
        plugins: [tailwindcss()]
    },
    integrations: [
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
