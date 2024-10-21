import { ComponentElement } from '@root/src/scripts/stores/componentManager';

export default class Accordion extends ComponentElement {
    static readonly DURATION = 300;
    static readonly CLASS_OPEN = 'is-open';
    private onClickBind: any;
    private $root: HTMLDetailsElement;
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
        this.$root = this.querySelector('details.c-accordion_details')!;
        this.$summary = this.$root.querySelector('summary.c-accordion_summary')!;
        this.$content = this.$root.querySelector('.c-accordion_content')!;
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
        super.connectedCallback();

        this.bindEvents();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

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

        this.$root.style.overflow = 'hidden';

        if (this.isClosing || !this.$root.open) {
            this.start();
        } else if (this.isExpanding || this.$root.open) {
            this.shrink();
        }
    }

    // =============================================================================
    // Methods
    // =============================================================================
    shrink() {
        this.isClosing = true;
        this.$root.classList.remove(Accordion.CLASS_OPEN);

        if (this.$parent) this.$parent.classList.remove(Accordion.CLASS_OPEN);

        const startHeight = `${this.$root.offsetHeight}px`;
        const endHeight = `${this.$summary.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.$root.animate(
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
                this.$root.classList.add(Accordion.CLASS_OPEN);
            };
        }
    }

    start() {
        this.$root.style.height = `${this.$root.offsetHeight}px`;

        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        this.isExpanding = true;
        this.$root.classList.add(Accordion.CLASS_OPEN);

        if (this.$parent) this.$parent.classList.add(Accordion.CLASS_OPEN);

        const startHeight = `${this.$root.offsetHeight}px`;
        const endHeight = `${this.$summary.offsetHeight + this.$content.offsetHeight}px`;

        if (this.animation) {
            this.animation?.cancel();
        }

        this.animation = this.$root.animate(
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
                this.$root.classList.remove(Accordion.CLASS_OPEN);
            };
        }
    }

    onAnimationFinish(open: boolean) {
        this.$root.open = open;

        this.animation = null;

        this.isClosing = false;
        this.isExpanding = false;

        this.$root.style.height = this.$root.style.overflow = '';
    }
}

customElements.define('c-accordion', Accordion);
