import { toDash } from '@scripts/utils/string';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';
import Swup from 'swup'; 

export class Transitions {
    static readonly READY_CLASS = 'is-ready';
    static readonly TRANSITION_CLASS = 'is-transitioning';
    static readonly HIDE_HEADER_CLASS = 'is-header-hidden';
    static readonly SEAMLESS_CLASS = 'is-seamless';

    private onVisitStartBind: any;
    private beforeContentReplaceBind: any;
    private onContentReplaceBind: any;
    private onAnimationInEndBind: any;
    private onAnimationOutStartBind: any;

    private swup: Swup | undefined;

    constructor() {
        // Binding
        this.onVisitStartBind = this.onVisitStart.bind(this);
        this.onContentReplaceBind = this.onContentReplace.bind(this);
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
            console.log('Transitions ready');
            
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
                }),
                new SwupScriptsPlugin(),
            ],
        });

        this.swup.hooks.on('visit:start', this.onVisitStartBind);
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
     * @param visit
     */
    updateDocumentAttributes(visit: VisitType) {
        if (visit.fragmentVisit) return;

        const parser = new DOMParser();
        const nextDOM = parser.parseFromString(visit.to.html, 'text/html');
        const newDataset = Object.assign(
            {},
            nextDOM.querySelector('html')?.dataset
        );

        Object.entries(newDataset).forEach(([key, val]) => {
            document.documentElement.setAttribute(`data-${toDash(key)}`, val || '');
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
     * On animation:out:start
     * Current content starts animating out. Class `.is-animating` is added.
     * 
     * @see https://swup.js.org/hooks/#animation-out-start
     * @param visit
     */
    onAnimationOutStart(visit: VisitType) {
    }

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
        document.documentElement.classList.remove(Transitions.HIDE_HEADER_CLASS);
        document.documentElement.classList.remove(Transitions.SEAMLESS_CLASS);
    }
}
