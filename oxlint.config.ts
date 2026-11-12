import { defineConfig } from 'oxlint';

export default defineConfig({
    plugins: ['eslint', 'import', 'oxc', 'typescript', 'unicorn'],
    categories: {
        correctness: 'error',
        suspicious: 'warn',
    },
    env: { browser: true, node: true },
    ignorePatterns: ['.astro/**', '.vercel/**', 'dist/**', 'types/generated-*.d.ts', 'vendors/**'],
    options: {
        reportUnusedDisableDirectives: 'error',
    },
    rules: {
        /* Braces around every if/else/loop body, one-liners included */
        'eslint/curly': ['error', 'all'],
        'eslint/no-debugger': 'warn',
        'import/no-cycle': 'error',
        'import/no-duplicates': 'error',
        /* Bans `@ts-ignore`; `@ts-expect-error` needs a description */
        'typescript/ban-ts-comment': 'error',
        'typescript/no-explicit-any': 'warn',
        'typescript/no-unused-expressions': 'error',
        /* Disable comments must name the rules they turn off */
        'unicorn/no-abusive-eslint-disable': 'error',
    },
});
