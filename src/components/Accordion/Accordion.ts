import { ComponentElement } from '@scripts/stores/componentManager';

export default class Accordion extends HTMLDetailsElement {
    static readonly DURATION = 300;
    static readonly CLASS_OPEN = 'is-open';
    private onClickBind: any;
    private $summary: HTMLElement;
    private $content: HTMLElement;
    private $parent: HTMLElement | null;
    private animation: Animation | null;
    private isClosing: boolean;
    private isExpanding: boolean;

    constructor() {
        super();

        // Binding
        this.onClickBind = this.onClick.bind(this);

        // UI
        this.$summary = this.querySelector('summary.c-accordion_summary')!;
        this.$content = this.querySelector('.c-accordion_content')!;
        this.$parent = this.closest('[data-accordion-parent]') || null;

        // Data
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
    }

    // =============================================================================
    // Lifecycle
    // =============================================================================
    connectedCallback() {
        this.bindEvents();
    }

    disconnectedCallback() {
        this.unbindEvents();
    }

    // =============================================================================
    // Events
    // =============================================================================
    bindEvents() {
        this.$summary.addEventListener('click', this.onClickBind);
    }
    unbindEvents() {
        this.$summary.removeEventListener('click', this.onClickBind);
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    onClick(e: Event) {
        e.preventDefault();

        this.style.overflow = 'hidden';

        if (this.isClosing || !this.open) {
            this.start();
        } else if (this.isExpanding || this.open) {
            this.shrink();
        }
    }

    // =============================================================================
    // Methods
    // =============================================================================
    shrink() {
        this.isClosing = true;
        this.classList.remove(Accordion.CLASS_OPEN);

        if (this.$parent) this.$parent.classList.remove(Accordion.CLASS_OPEN);

        const startHeight = `${this.offsetHeight}px`;
        const endHeight = `${this.$summary.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.animate(
            {
                height: [startHeight, endHeight]
            },
            {
                duration: Accordion.DURATION,

                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            }
        );

        if (this.animation) {
            this.animation.onfinish = () => this.onAnimationFinish(false);
            this.animation.oncancel = () => {
                this.isClosing = false;
                this.classList.add(Accordion.CLASS_OPEN);
            };
        }
    }

    start() {
        this.style.height = `${this.offsetHeight}px`;

        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        this.isExpanding = true;
        this.classList.add(Accordion.CLASS_OPEN);

        if (this.$parent) this.$parent.classList.add(Accordion.CLASS_OPEN);

        const startHeight = `${this.offsetHeight}px`;
        const endHeight = `${this.$summary.offsetHeight + this.$content.offsetHeight}px`;

        if (this.animation) {
            this.animation?.cancel();
        }

        this.animation = this.animate(
            {
                height: [startHeight, endHeight]
            },
            {
                duration: Accordion.DURATION,
                easing: 'linear'
            }
        );

        if (this.animation) {
            this.animation.onfinish = () => this.onAnimationFinish(true);
            this.animation.oncancel = () => {
                this.isExpanding = false;
                this.classList.remove(Accordion.CLASS_OPEN);
            };
        }
    }

    onAnimationFinish(open: boolean) {
        this.open = open;

        this.animation = null;

        this.isClosing = false;
        this.isExpanding = false;

        this.style.height = this.style.overflow = '';
    }
}

customElements.define('c-accordion', ComponentElement(Accordion, 'Accordion'), {
    extends: 'details'
});
