import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import postcssUtopia from 'postcss-utopia';
import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';
import { storyblok } from '@storyblok/astro';
import basicSsl from '@vitejs/plugin-basic-ssl';

const { STORYBLOK_ACCESS_TOKEN, STORYBLOK_SERVER_LOCATION } = loadEnv(
    process.env.NODE_ENV as string,
    process.cwd(),
    ''
);

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
        plugins: [tailwindcss(), basicSsl()]
    },
    output: 'server',
    integrations: [
        icon({
            iconDir: './src/assets/svgs'
        }),
        storyblok({
            accessToken: STORYBLOK_ACCESS_TOKEN,
            apiOptions: {
                region: STORYBLOK_SERVER_LOCATION
            },
            livePreview: true,
            components: {
                page: 'storyblok/Page',
                feature: 'storyblok/Feature',
                grid: 'storyblok/Grid',
                teaser: 'storyblok/Teaser'
            }
        })
    ],
    devToolbar: {
        enabled: false
    },
    env: {
        schema: {
            STORYBLOK_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret' }),
            STORYBLOK_SPACE_ID: envField.string({ context: 'server', access: 'secret' }),
            STORYBLOK_SERVER_LOCATION: envField.string({ context: 'server', access: 'secret' })
        }
    }
});
