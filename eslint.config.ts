import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginImport from 'eslint-plugin-import';
import stylistic from '@stylistic/eslint-plugin';

export default [
    {
        ignores: [
            '.astro/*',
            'node_modules',
            'dist',
            'vendors',
            'types/gen-*.d.ts',
            '.vercel/**/*',
            '.vercel'
        ]
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        rules: {
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'error'
        }
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        }
    },
    {
        plugins: {
            '@stylistic': stylistic
        }
    },
    stylistic.configs.customize({
        semi: true,
        indent: 4,
        commaDangle: 'never',
        braceStyle: '1tbs',
        jsx: false
    }),
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'no-debugger': 'off',
            '@stylistic/no-floating-decimal': 'warn',
            '@stylistic/operator-linebreak': 'off',
            '@stylistic/arrow-parens': 'off',
            '@stylistic/multiline-ternary': 'off'
        }
    },
    {
        files: ['**/*.astro'],
        rules: {
            // Disable no-undef for Astro files - TypeScript handles type checking
            // Global types like Seo are defined in types/global.d.ts
            'no-undef': 'off'
        }
    },
    ...eslintPluginAstro.configs.recommended,
    {
        files: ['src/pages/*.astro'],
        plugins: {
            import: eslintPluginImport
        },
        rules: {
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
                    pathGroups: [
                        {
                            pattern: '#layouts/**',
                            group: 'internal',
                            position: 'before'
                        }
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'external']
                }
            ]
        }
    }
];
