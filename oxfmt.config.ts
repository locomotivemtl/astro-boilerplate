import { defineConfig } from 'oxfmt';

export default defineConfig({
    tabWidth: 4,
    singleQuote: true,
    printWidth: 100,
    /* Mirrors Astro's compressHTML so same-line spaces in markup stay as text, not `{' '}` */
    astro: { compressHTML: 'html' },
    sortTailwindcss: { stylesheet: './src/styles/tailwind.css' },
    sortImports: {
        /* A comment between imports starts a new block; imports never move across it */
        partitionByComment: true,
        /* Layout first: it imports the global CSS, so the cascade breaks if a component loads before it */
        customGroups: [
            {
                groupName: 'layouts',
                elementNamePattern: ['#layouts/**'],
            },
        ],
        groups: [
            'layouts',
            'builtin',
            'external',
            ['internal', 'subpath'],
            ['parent', 'sibling', 'index'],
            'style',
            'unknown',
        ],
    },
    overrides: [{ files: ['*.yaml', '*.yml'], options: { tabWidth: 2 } }],
});
