import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svgSprite from 'astro-svg-sprite';

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "sass:math";
                        @use "sass:list";
                        @import "@styles/tools/maths";
                        @import "@styles/tools/functions";
                    `
                }
            }
        }
    },
    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        svgSprite({
            include: './src/assets/svgs',
        }),
    ],
    devToolbar: {
        enabled: false
    },
    image: {
        domains: ['locomotive.ca'],
        remotePatterns: [{ protocol: 'https' }],
    }
});
