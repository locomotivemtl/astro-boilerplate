import stylistic from '@stylistic/eslint-plugin';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: [
            // Generated files and build output
            '.astro/*',
            '.vercel/*',
            // Build output and dependencies
            'dist',
            'node_modules',
            // Generated type declaration files
            'types/generated-*.d.ts',
            // Vendor code that we don't control
            'vendors',
        ],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'error',
            'no-unused-expressions': 'off',
        },
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    stylistic.configs.customize({
        semi: true,
        indent: 4,
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        jsx: false,
    }),
    tseslint.configs.eslintRecommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@stylistic/arrow-parens': 'off',
            '@stylistic/multiline-ternary': 'off',
            '@stylistic/no-floating-decimal': 'warn',
            '@stylistic/operator-linebreak': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-debugger': 'warn',
        },
    },
    {
        files: ['**/*.astro'],
        rules: {
            // Disable no-undef for Astro files - TypeScript handles type checking
            // Global types like Seo are defined in types/global.d.ts
            'no-undef': 'off',
        },
    },
    ...eslintPluginAstro.configs.recommended,
    {
        files: ['src/pages/**/*.astro'],
        plugins: {
            import: eslintPluginImport,
        },
        rules: {
            // @mcaskill
            // !! Estlint consider imports prefixed by @ as external deps, not internal (scoped npm package pattern)
            // !! so ESLint puts it before #layouts (which is internal)
            // !! Consider this, this rule doesn't apply for now but will work with PR #58 (https://github.com/locomotivemtl/astro-boilerplate/pull/58)

            // Enforce a specific order for imports in Astro page components
            // Prevent css styles being imported after components, which can cause issues with style application
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
                    pathGroups: [
                        {
                            pattern: '@layouts/**', // => Will be updated to #layouts/* when PR #58 will be approved
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'external'],
                },
            ],
        },
    },
];
