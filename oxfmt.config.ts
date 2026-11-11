import { defineConfig } from 'oxfmt';

export default defineConfig({
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 100,
    sortPackageJson: false,
    // Mirrors Astro's compressHTML so same-line spaces in markup stay as text, not `{' '}`
    astro: { compressHTML: 'html' },
    sortTailwindcss: { stylesheet: './src/styles/tailwind.css' },
    sortImports: {
        // Layout first: it imports the global CSS, so the cascade breaks if a component loads before it
        customGroups: [
            { groupName: 'layouts', elementNamePattern: ['#layouts/**', '@layouts/**'] }
        ],
        groups: [
            'layouts',
            'builtin',
            'external',
            ['internal', 'subpath'],
            ['parent', 'sibling', 'index'],
            'style',
            'unknown'
        ]
    },
    overrides: [{ files: ['*.yaml', '*.yml'], options: { tabWidth: 2 } }]
});
