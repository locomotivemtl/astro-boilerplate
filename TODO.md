- [x] Eslint → Oxlint https://oxc.rs/docs/guide/usage/linter/editors.html
- [ ] When `feature/oxc` merges with `feature/vscode-setup`, swap Prettier for `oxc.oxc-vscode` in `.vscode/extensions.json` and `.vscode/settings.json`
- [ ] $mediaQueries stores
- [ ] Remove $mouse
- [ ] Vite plugin: defines https://github.com/locomotivemtl/astro-boilerplate/pull/61
- [ ] Update vite config → codeSplitting, optimizeDeps

## Shortcuts

- [ ] Both `#layouts/**` and `@layouts/**` in `oxfmt.config.ts` `sortImports.customGroups`
    - Why: pages still import `@layouts/...`; PR #58 switches aliases to `#`. Until then `@` aliases also sort as `external`, mixed with npm packages.
    - Ceiling: only the layout group is pinned; other `@` aliases sort alphabetically among npm packages.
    - Proper fix: once PR #58 lands, drop `@layouts/**` and keep `#layouts/**`.
- [ ] `[astro]` formatter override in `.vscode/settings.json` points to `oxc.oxc-vscode`, unverified
    - Why: not confirmed that the Oxc extension's LSP formats `.astro`, though the `oxfmt` CLI does.
    - Proper fix: open an `.astro` file in VS Code, format on save, and drop the override if the Astro extension wins or nothing happens.
- [ ] Alias map declared twice: `package.json` `imports` and `tsconfig.json` `paths`
    - Why: kept for linters or IDE language servers that read only `paths`. TypeScript, Vite and Astro already resolve every `#` import from `package.json` alone (checked 2026-11-11 with `paths` emptied).
    - Ceiling: adding an alias means editing both files, and they can drift.
    - Proper fix: once the linter is chosen (see Oxlint item), check that it resolves `package.json` `imports`, then drop `paths`.
