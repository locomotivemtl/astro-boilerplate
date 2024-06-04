import { utopiaClamp } from './src/scripts/utils/utopiaClamp';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    prefix: 'u-',
    corePlugins: {
        text: false,
        heading: false,
        container: false,
    },
    theme: {
        extend: {
            fontFamily: {
                serif: ['Times New Roman', 'serif'],
                sans: ['Arial', 'sans-serif'],
            },
            fontSize: {
                h1: utopiaClamp(82, 124),
                h2: utopiaClamp(58, 92),
                h3: utopiaClamp(42, 52),
                h4: utopiaClamp(20, 36),
                h5: utopiaClamp(16, 22),
                h6: utopiaClamp(12, 14),
                body: utopiaClamp(14, 14),
                subtitle: utopiaClamp(12, 12),
                cta: utopiaClamp(12, 12),
            },
            colors: {
                black: '#000000',
                white: '#ffffff',
            },
            screens: {
                'from-xs': '480px',
                'to-xs': {'max': '479px'},
                'from-sm': '768px',
                'to-sm': {'max': '767px'},
                'from-md': '1000px',
                'to-md': {'max': '999px'},
                'from-lg': '1200px',
                'to-lg': {'max': '1199px'},
                'from-xl': '1400px',
                'to-xl': {'max': '1399px'},
                'from-figma': '1440px',
                'to-figma': {'max': '1439px'},
            },
            spacing: {
                containerMargin: '20px',
                containerMarginMobile: '20px',
                'fluid-xs': utopiaClamp(8, 10),
                'fluid-s': utopiaClamp(16, 24),
                'fluid-md': utopiaClamp(24, 32),
                'fluid-lg': utopiaClamp(32, 40),
                'fluid-xl': utopiaClamp(40, 56),
                'fluid-2xl': utopiaClamp(56, 80),
                'fluid-3xl': utopiaClamp(80, 128),
                'fluid-4xl': utopiaClamp(128, 160),
            },
            gap: {
                gutter: '20px',
                gutterMobile: '20px'
            },
            transitionDuration: {
                fast: "300ms",
                default: "400ms",
                slow: "600ms",
                slower: "800ms",
                long: "1s",
                "very-long": "1.2s"
            },
            transitionTimingFunction: {
                default: "cubic-bezier(0.6,0,0.3,1)"
            },
            zIndex: {
                'header': '100',
                'modal': '120',
                'lightbox': '200',
                'overlay': '9999'
            },
        },
    },
    plugins: [],
};