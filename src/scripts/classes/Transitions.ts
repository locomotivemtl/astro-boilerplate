import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';
import Swup from 'swup';

import { Scroll } from '#classes/Scroll.ts';

export class Transitions {
    static readonly READY_CLASS = 'is-ready';
    static readonly TRANSITION_CLASS = 'is-transitioning';

    private swup: Swup | undefined;

    // =============================================================================
    // Lifecycle
    // =============================================================================
    init() {
        this.initSwup();

        requestAnimationFrame(() => {
            document.documentElement.classList.add(Transitions.READY_CLASS);
        });
    }

    destroy() {
        this.swup?.destroy();
    }

    // =============================================================================
    // Methods
    // =============================================================================
    initSwup() {
        this.swup = new Swup({
            animateHistoryBrowsing: true,
            plugins: [
                new SwupHeadPlugin({
                    persistAssets: true,
                    awaitAssets: true,
                }),
                new SwupPreloadPlugin({
                    preloadHoveredLinks: true,
                    preloadInitialPage: !import.meta.env.DEV,
                }),
                new SwupScriptsPlugin(),
            ],
        });

        this.swup.hooks.on('visit:start', this.onVisitStart);
        this.swup.hooks.before('content:replace', this.beforeContentReplace);
        this.swup.hooks.on('content:replace', this.onContentReplace);
        this.swup.hooks.on('animation:in:end', this.onAnimationInEnd);
        this.swup.hooks.on('animation:out:start', this.onAnimationOutStart);

        this.swup.hooks.on('fetch:error', (e) => {
            console.log('fetch:error:', e);
        });
        this.swup.hooks.on('fetch:timeout', (e) => {
            console.log('fetch:timeout:', e);
        });
    }

    /**
     * Retrieve HTML dataset on next container and update our real html element dataset accordingly
     *
     * @param visit: VisitType
     */
    updateDocumentAttributes(visit: VisitType) {
        if (visit.fragmentVisit || !visit.to.html) {
            return;
        }

        const parser = new DOMParser();
        const nextDOM = parser.parseFromString(visit.to.html, 'text/html');
        const newDataset = {
            ...nextDOM.querySelector('html')?.dataset,
        };

        Object.entries(newDataset).forEach(([key, val]) => {
            document.documentElement.dataset[key] = val ?? '';
        });
    }

    // =============================================================================
    // Hooks
    // =============================================================================

    /**
     * On visit:start
     * Transition to a new page begins
     *
     * @see https://swup.js.org/hooks/#visit-start
     * @param visit: VisitType
     */
    onVisitStart = (): void => {
        document.documentElement.classList.add(Transitions.TRANSITION_CLASS);
        document.documentElement.classList.remove(Transitions.READY_CLASS);
    };

    /**
     * On before:content:replace
     * The old content of the page is replaced by the new content.
     *
     * @see https://swup.js.org/hooks/#content-replace
     * @param visit: VisitType
     */
    beforeContentReplace = (): void => {
        Scroll?.destroy();
    };

    /**
     * On content:replace
     * The old content of the page is replaced by the new content.
     *
     * @see https://swup.js.org/hooks/#content-replace
     * @param visit: VisitType
     */
    onContentReplace = (visit: VisitType): void => {
        Scroll?.init();
        this.updateDocumentAttributes(visit);
    };

    /**
     * On animation:out:start
     * Current content starts animating out. Class `.is-animating` is added.
     *
     * @see https://swup.js.org/hooks/#animation-out-start
     * @param visit: VisitType
     */
    onAnimationOutStart = (): void => {};

    /**
     * On animation:in:end
     * New content finishes animating out.
     *
     * @see https://swup.js.org/hooks/#animation-in-end
     * @param visit: VisitType
     */
    onAnimationInEnd = (): void => {
        document.documentElement.classList.remove(Transitions.TRANSITION_CLASS);
        document.documentElement.classList.add(Transitions.READY_CLASS);
    };
}
