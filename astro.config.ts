import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import tailwindcss from '@tailwindcss/postcss';

// https://astro.build/config
export default defineConfig({
    site: 'https://locomotive-astro-boilerplate.vercel.app',
    vite: {
        css: {
            postcss: {
                plugins: [
                    tailwindcss(),
                    postcssUtopia(),
                    postcssHelpersFunctions(),
                    postcssTailwindShortcuts()
                ]
            }
        }
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
            }
        ]
    }
});
