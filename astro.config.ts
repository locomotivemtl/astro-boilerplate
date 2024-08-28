import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import svgSprite from 'astro-svg-sprite';
import tailwindConfig from './tailwind.config';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';

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
            },
            postcss: {
                plugins: [
                    postcssTailwindShortcuts(tailwindConfig.theme),
                ],
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
    },
    output: 'hybrid',
    adapter: vercel(),
    experimental: {
        env: {
            schema: {
                BASIC_AUTH_ENABLED: envField.boolean({
                    context: 'server',
                    access: 'secret',
                }),
                BASIC_AUTH_USERNAME: envField.string({
                    context: 'server',
                    access: 'secret',
                }),
                BASIC_AUTH_PASSWORD: envField.string({
                    context: 'server',
                    access: 'secret',
                }),
            }
        }
    }
});
