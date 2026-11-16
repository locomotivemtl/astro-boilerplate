<p align="center">
    <a href="https://github.com/locomotivemtl/locomotive-boilerplate">
        <img src="https://user-images.githubusercontent.com/4596862/54868065-c2aea200-4d5e-11e9-9ce3-e0013c15f48c.png" height="140">
    </a>
</p>
<h1 align="center">Locomotive Astro Boilerplate</h1>
<p align="center">Astro boilerplate for projects by <a href="https://locomotive.ca/">Locomotive</a>.</p>

## Features

- [PostCSS] for a feature rich superset of CSS.
- [Tailwind CSS] for a sane and scalable CSS architecture.
- [Locomotive Scroll] for smooth scrolling with parallax effects.
- [Swup] for versatile and extensible page transitions.
- [Oxlint] and [Oxfmt] for a linted, formatted and easy to maintain codebase.
- [Nanostores] as state manager.

## Getting started

Make sure you have the following installed:

- [Node] — at least 24.0, the latest LTS is recommended.
- [NPM] — at least 8.0, the latest LTS is recommended.

> 💡 You can use [NVM] to install and use different versions of Node via the command-line.

```sh
# Clone the repository.
git clone https://github.com/locomotivemtl/astro-boilerplate.git my-new-project

# Enter the newly-cloned directory.
cd my-new-project
```

## Installation

```sh
# Switch to recommended Node version from .nvmrc
nvm use

# Install dependencies from package.json
npm install
```

## Development

```sh
# Start development server, watch for changes, and compile assets
npm start

# Compile and minify assets
npm run build
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run check`           | Type check, lint and check formatting            |
| `npm run lint`            | Lint files using Oxlint                          |
| `npm run lint:fix`        | Lint files and apply safe fixes                  |
| `npm run format`          | Format files using Oxfmt                         |
| `npm run format:check`    | Check formatting without writing                 |

## Commit messages

A `commit-msg` hook runs [commitlint] on every commit. The rules are lenient on purpose: no Conventional Commits types, only a clear subject line.

| Rule                                | Level   |
| ----------------------------------- | ------- |
| Subject has at least 2 words        | Error   |
| Subject is 5 to 100 characters      | Error   |
| Subject doesn't end with a period   | Error   |
| Blank line between subject and body | Warning |

If 100 characters isn't enough, keep the subject short and explain in the body.

## Documentation

- [Astro]
- [Locomotive Scroll]
- [Tailwind CSS]
- [Swup]
- [Oxlint]
- [Oxfmt]
- [Nanostores]
- [commitlint]

[Astro]: https://docs.astro.build/en/getting-started/
[Tailwind CSS]: https://tailwindcss.com/docs/installation
[Locomotive Scroll]: https://scroll.locomotive.ca/docs
[Swup]: https://swup.js.org/getting-started/
[Node]: https://nodejs.org/
[NPM]: https://npmjs.com/
[NVM]: https://github.com/nvm-sh/nvm
[Oxlint]: https://oxc.rs/docs/guide/usage/linter.html
[Oxfmt]: https://oxc.rs/docs/guide/usage/formatter.html
[Nanostores]: https://github.com/nanostores/nanostores
[PostCSS]: https://postcss.org/
[commitlint]: https://commitlint.js.org/
