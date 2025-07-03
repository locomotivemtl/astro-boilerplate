import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
    {
        ignores: ['.astro/*', 'node_modules', 'dist']
    },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        files: ['../*.{astro}'],
        ...eslintPluginAstro.configs.recommended
    }
];
