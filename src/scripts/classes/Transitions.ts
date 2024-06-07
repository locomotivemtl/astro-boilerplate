import { toDash } from '@scripts/utils/string';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';
import Swup from 'swup';
import { Scroll } from './Scroll';

export class Transitions {
    static readonly READY_CLASS = 'is-ready';
    static readonly TRANSITION_CLASS = 'is-transitioning';

    private onVisitStartBind: any;
    private onContentReplaceBind: any;
    private beforeContentScrollBind: any;
    private onContentScrollBind: any;
    private onAnimationInEndBind: any;
    private onAnimationOutStartBind: any;

    private swup: Swup | undefined;

    constructor() {
        this.onVisitStartBind = this.onVisitStart.bind(this);
        this.onContentReplaceBind = this.onContentReplace.bind(this);
        this.beforeContentScrollBind = this.beforeContentScroll.bind(this);
        this.onContentScrollBind = this.onContentScroll.bind(this);
        this.onAnimationInEndBind = this.onAnimationInEnd.bind(this);
        this.onAnimationOutStartBind = this.onAnimationOutStart.bind(this);

        this.init();
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
                    preloadHoveredLinks: true
                }),
                new SwupScriptsPlugin()
            ]
        });

        this.swup.hooks.on('visit:start', this.onVisitStartBind);
        this.swup.hooks.on('content:replace', this.onContentReplaceBind);
        this.swup.hooks.before('content:scroll', this.beforeContentScrollBind);
        this.swup.hooks.on('content:scroll', this.onContentScrollBind);
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
     * @param visit
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
     * @param visit
     */
    onVisitStart(visit: VisitType) {
        document.documentElement.classList.add(Transitions.TRANSITION_CLASS);
        document.documentElement.classList.remove(Transitions.READY_CLASS);
    }

    /**
     * On content:replace
     * The old content of the page is replaced by the new content.
     *
     * @see https://swup.js.org/hooks/#content-replace
     * @param visit
     */
    onContentReplace(visit: VisitType) {
        this.updateDocumentAttributes(visit);
    }

    /**
     * On before:content:scroll
     * Before the scroll position is reset after replacing the content.
     *
     * @see https://swup.js.org/hooks/#content-scroll
     * @param visit
     */
    beforeContentScroll(visit: VisitType) {
        // Stopping locomotive-scroll before the scroll gets updated
        Scroll.stop();
    }

    /**
     * On content:scroll
     * The scroll position is reset after replacing the content.
     *
     * @see https://swup.js.org/hooks/#content-scroll
     * @param visit
     */
    onContentScroll(visit: VisitType) {
        // Resuming locomotive-scroll after the scroll been updated
        Scroll.start();
    }

    /**
     * On animation:out:start
     * Current content starts animating out. Class `.is-animating` is added.
     *
     * @see https://swup.js.org/hooks/#animation-out-start
     * @param visit
     */
    onAnimationOutStart(visit: VisitType) {}

    /**
     * On animation:in:end
     * New content finishes animating out.
     *
     * @see https://swup.js.org/hooks/#animation-in-end
     * @param visit
     */
    onAnimationInEnd(visit: VisitType) {
        document.documentElement.classList.remove(Transitions.TRANSITION_CLASS);
        document.documentElement.classList.add(Transitions.READY_CLASS);
    }
}
