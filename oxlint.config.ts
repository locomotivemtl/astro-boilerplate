import { defineConfig } from 'oxlint';

export default defineConfig({
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'import'],
    categories: {
        correctness: 'error',
        suspicious: 'warn'
    },
    env: { browser: true, node: true },
    ignorePatterns: ['.astro/**', '.vercel/**', 'dist/**', 'types/generated-*.d.ts', 'vendors/**'],
    rules: {
        'typescript/no-explicit-any': 'warn',
        'typescript/no-unused-expressions': 'error',
        'eslint/no-debugger': 'warn',
        'import/no-duplicates': 'error',
        'import/no-cycle': 'error'
    }
});
