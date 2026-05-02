import type { AstroIntegration } from 'astro';

import postcssHelpersFunctions from '@locomotivemtl/postcss-helpers-functions';

import { postcssHelpersToType } from './postcssHelpersToType';
import { generateVirtualModuleCode, type Helper } from './virtual-module';

type PostcssHelpersFunctionsPlugin = ReturnType<typeof postcssHelpersFunctions> & {
    helpers: Helper[];
    regex: RegExp;
};

const VIRTUAL_MODULE_ID = 'virtual:postcss-processors';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export default function postCssProcessorsHelpersIntegration(): AstroIntegration {
    const plugin = postcssHelpersFunctions() as PostcssHelpersFunctionsPlugin;

    return {
        name: 'postcss-processors',
        hooks: {
            'astro:config:setup': ({ config, updateConfig, logger }) => {
                const rootDir = config.root.pathname;
                postcssHelpersToType(rootDir);
                logger.info('Generated types/gen-postcss-processors.d.ts');

                updateConfig({
                    vite: {
                        css: {
                            postcss: {
                                plugins: [plugin]
                            }
                        },
                        plugins: [
                            {
                                name: 'postcss-processors',
                                resolveId(id: string) {
                                    if (id === VIRTUAL_MODULE_ID) {
                                        return RESOLVED_VIRTUAL_MODULE_ID;
                                    }
                                },
                                load(id: string) {
                                    if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                                        return generateVirtualModuleCode(
                                            plugin.helpers,
                                            plugin.regex
                                        );
                                    }
                                }
                            }
                        ]
                    }
                });
            }
        }
    };
}
