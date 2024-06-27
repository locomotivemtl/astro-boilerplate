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
                        @use "@styles/tools/maths" as *;
                        @use "@styles/tools/functions" as *;
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
