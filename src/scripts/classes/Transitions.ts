import { toDash } from '@scripts/utils/string';
import SwupA11yPlugin from '@swup/a11y-plugin';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';
import Swup from 'swup';
import { Scroll } from '@scripts/classes/Scroll';

export class Transitions {
    static readonly READY_CLASS = 'is-ready';
    static readonly TRANSITION_CLASS = 'is-transitioning';

    private onVisitStartBind: any;
    private beforeContentReplaceBind: any;
    private onContentReplaceBind: any;
    private onAnimationInEndBind: any;
    private onAnimationOutStartBind: any;

    private swup: Swup | undefined;

    constructor() {
        this.onVisitStartBind = this.onVisitStart.bind(this);
        this.beforeContentReplaceBind = this.beforeContentReplace.bind(this);
        this.onContentReplaceBind = this.onContentReplace.bind(this);
        this.onAnimationInEndBind = this.onAnimationInEnd.bind(this);
        this.onAnimationOutStartBind = this.onAnimationOutStart.bind(this);
    }

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
                    awaitAssets: true
                }),
                new SwupPreloadPlugin({
                    preloadHoveredLinks: true,
                    preloadInitialPage: !import.meta.env.DEV
                }),
                new SwupScriptsPlugin(),
                new SwupA11yPlugin()
            ]
        });

        this.swup.hooks.on('visit:start', this.onVisitStartBind);
        this.swup.hooks.before('content:replace', this.beforeContentReplaceBind);
        this.swup.hooks.on('content:replace', this.onContentReplaceBind);
        this.swup.hooks.on('animation:in:end', this.onAnimationInEndBind);
        this.swup.hooks.on('animation:out:start', this.onAnimationOutStartBind);

        this.swup.hooks.on('fetch:error', (e) => {
            console.log('fetch:error:', e);
            debugger;
        });
        this.swup.hooks.on('fetch:timeout', (e) => {
            console.log('fetch:timeout:', e);
            debugger;
        });
    }

    /**
     * Retrieve HTML dataset on next container and update our real html element dataset accordingly
     *
     * @param visit: VisitType
     */
    updateDocumentAttributes(visit: VisitType) {
        if (visit.fragmentVisit) return;

        const parser = new DOMParser();
        const nextDOM = parser.parseFromString(visit.to.html, 'text/html');
        const newDataset = {
            ...nextDOM.querySelector('html')?.dataset
        };

        Object.entries(newDataset).forEach(([key, val]) => {
            document.documentElement.setAttribute(`data-${toDash(key)}`, val ?? '');
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
    onVisitStart(visit: VisitType) {
        document.documentElement.classList.add(Transitions.TRANSITION_CLASS);
        document.documentElement.classList.remove(Transitions.READY_CLASS);

        if (visit.a11y) {
            visit.a11y.focus = 'h1#page-heading';

            // Best not to assume where to move the focus on fragment visits
            if (visit.fragmentVisit) {
                visit.a11y.focus = false;
            }
        }
    }

    /**
     * On before:content:replace
     * The old content of the page is replaced by the new content.
     *
     * @see https://swup.js.org/hooks/#content-replace
     * @param visit: VisitType
     */
    beforeContentReplace() {
        Scroll?.destroy();
    }

    /**
     * On content:replace
     * The old content of the page is replaced by the new content.
     *
     * @see https://swup.js.org/hooks/#content-replace
     * @param visit: VisitType
     */
    onContentReplace(visit: VisitType) {
        Scroll?.init();
        this.updateDocumentAttributes(visit);
    }

    /**
     * On animation:out:start
     * Current content starts animating out. Class `.is-animating` is added.
     *
     * @see https://swup.js.org/hooks/#animation-out-start
     * @param visit: VisitType
     */
    onAnimationOutStart() {}

    /**
     * On animation:in:end
     * New content finishes animating out.
     *
     * @see https://swup.js.org/hooks/#animation-in-end
     * @param visit: VisitType
     */
    onAnimationInEnd() {
        document.documentElement.classList.remove(Transitions.TRANSITION_CLASS);
        document.documentElement.classList.add(Transitions.READY_CLASS);
    }
}
