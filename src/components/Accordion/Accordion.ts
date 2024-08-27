export default class Accordion extends HTMLElement {

    private $el: HTMLDetailsElement;
    private $summary: HTMLElement;
    private $content: HTMLElement;
    private $parent: HTMLElement | null;

    private animation: Animation | null;
    private isOpen: boolean;

    static readonly DURATION = 300;
    static readonly CLASS_OPEN = 'is-open';

    constructor() {
        super();

        // UI
        this.$el = this.querySelector('details.c-accordion_details')!;
        this.$summary = this.$el.querySelector('summary.c-accordion_summary')!;
        this.$content = this.$el.querySelector('.c-accordion_content')!;
        this.$parent = this.closest('[data-accordion-parent]') || null;

        // Data
        this.animation = null;
        this.isOpen = this.$el.open;

        // Binding
        this.onClick = this.onClick.bind(this);
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
        this.$summary.addEventListener('click', this.onClick);
    }
    unbindEvents() {
        this.$summary.removeEventListener('click', this.onClick);
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    onClick(e: Event) {
        e.preventDefault();

        this.$el.style.overflow = 'hidden';

        if (this.isOpen) {
            this.shrink();
        } else {
            this.expand();
        }
    }

    // =============================================================================
    // Methods
    // =============================================================================
    shrink() {
        this.isOpen = false;
        this.$el.classList.remove(Accordion.CLASS_OPEN);

        if (this.$parent) {
            this.$parent.classList.remove(Accordion.CLASS_OPEN);
        }

        const startHeight = `${this.$el.offsetHeight}px`;
        const endHeight = `${this.$summary.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.$el.animate(
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
                this.$el.classList.add(Accordion.CLASS_OPEN);
            };
        }
    }

    start() {
    }

    expand() {
        this.isOpen = true;
        this.$el.style.height = `${this.$el.offsetHeight}px`;

        window.requestAnimationFrame(() => {

            this.$el.classList.add(Accordion.CLASS_OPEN);

            if (this.$parent) {
                this.$parent.classList.add(Accordion.CLASS_OPEN);
            }

            const startHeight = `${this.$el.offsetHeight}px`;
            const endHeight = `${this.$summary.offsetHeight + this.$content.offsetHeight}px`;

            if (this.animation) {
                this.animation?.cancel();
            }

            this.$el.open = true;

            this.animation = this.$el.animate(
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
                    this.$el.classList.remove(Accordion.CLASS_OPEN);
                };
            }
        });
    }

    onAnimationFinish(open: boolean) {
        this.$el.open = open;
        this.$el.setAttribute('aria-expanded', `${open}`);

        this.animation = null;
        this.$el.style.height = this.$el.style.overflow = '';
    }
}

customElements.define('c-accordion', Accordion);
