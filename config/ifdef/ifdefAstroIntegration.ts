import type { AstroIntegration } from 'astro';
import fs from 'node:fs/promises';

import { type CommentStyle, parse } from './preprocessor.js';

export type { CommentStyle };

export type IfdefAstroIntegrationOptions = {
    extensions?: string[];
    verbose?: boolean;
    commentStyles?: CommentStyle[];
    fillWithBlanks?: boolean;
    uncommentPrefix?: string;
};

const DEFAULT_EXTS = ['.cjs', '.jsx', '.js', '.mjs', '.astro', '.ts', '.tsx'];
const DEFAULT_COMMENT_STYLES: CommentStyle[] = [{ open: '///' }, { open: '<!--', close: '-->' }];

export default function ifdefAstroIntegration(
    options: IfdefAstroIntegrationOptions = {}
): AstroIntegration {
    const extRegex = new RegExp(
        `(${[...DEFAULT_EXTS, ...(options.extensions ?? [])].map((e) => e.replace('.', '\\.')).join('|')})(?:\\?|$)`
    );

    const commentStyles = [...(options.commentStyles ?? []), ...DEFAULT_COMMENT_STYLES].filter(
        (cs, index, self) =>
            index === self.findIndex((c) => c.open === cs.open && c.close === cs.close)
    );

    return {
        name: 'ifdef-astro-integration',
        hooks: {
            'astro:config:setup': ({ updateConfig, config }) => {
                updateConfig({
                    vite: {
                        plugins: [
                            {
                                name: 'ifdef-vite-plugin',
                                enforce: 'pre',

                                async load(id) {
                                    if (!id.endsWith('.astro') || id.includes('node_modules'))
                                        return;
                                    const src = await fs.readFile(id, 'utf-8');
                                    return parse(
                                        src,
                                        id,
                                        config.vite.define ?? {},
                                        options.verbose ?? false,
                                        commentStyles,
                                        options.fillWithBlanks ?? true,
                                        options.uncommentPrefix ?? '/// #code'
                                    );
                                },

                                async transform(src, id) {
                                    if (id.endsWith('.astro')) return;
                                    const isNodeModule = id.includes('node_modules');
                                    if (!extRegex.test(id) || isNodeModule) return;

                                    return {
                                        code: parse(
                                            src,
                                            id,
                                            config.vite.define ?? {},
                                            options.verbose ?? false,
                                            commentStyles,
                                            options.fillWithBlanks ?? true,
                                            options.uncommentPrefix ?? '/// #code'
                                        ),
                                        map: null
                                    };
                                }
                            }
                        ]
                    }
                });
            }
        }
    };
}
