import { ComponentElement } from '@locomotivemtl/component-manager';

export class Accordion extends HTMLElement {
    static CLASS_ACTIVE = 'is-active';
    static EASING = 'cubic-bezier(0.33, 1, 0.68, 1)';
    static DURATION = 300;

    private $summary: HTMLElement | null = null;
    private $content: HTMLElement | null = null;
    private $details: HTMLDetailsElement | null = null;
    private animation: Animation | null = null;
    private isClosing: boolean = false;
    private isExpanding: boolean = false;

    constructor() {
        super();

        this.$summary = this.querySelector('summary');
        this.$details = this.querySelector('details');
        this.$content = this.querySelector('[data-accordion="content"]');
    }

    // =============================================================================
    // Lifecycle
    // =============================================================================
    connectedCallback() {
        if (!this.validateElements()) return;
        this.bindEvents();
    }

    disconnectedCallback() {
        this.unbindEvents();
        this.cancelAnimation();
    }

    // =============================================================================
    // Events
    // =============================================================================
    private bindEvents(): void {
        this.$summary?.addEventListener('click', this.onClick);
    }

    private unbindEvents(): void {
        this.$summary?.removeEventListener('click', this.onClick);
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    private onClick = (e: Event): void => {
        e.preventDefault();

        if (this.isAnimating()) return;

        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    };

    // =============================================================================
    // Animation Methods
    // =============================================================================
    private cancelAnimation(): void {
        if (this.animation) {
            this.animation.cancel();
            this.animation = null;
        }
    }

    private createAnimation(startHeight: string, endHeight: string): Animation {
        this.cancelAnimation();

        return this.animate(
            { height: [startHeight, endHeight] },
            {
                duration: Accordion.DURATION,
                easing: Accordion.EASING
            }
        );
    }

    private prepareForAnimation(): void {
        this.style.overflow = 'hidden';
    }

    private cleanupAfterAnimation(): void {
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.$details!.style.height = '';
        this.style.overflow = '';
    }

    // =============================================================================
    // Methods
    // =============================================================================
    private close(): void {
        this.isClosing = true;
        this.$details!.classList.remove(Accordion.CLASS_ACTIVE);
        this.prepareForAnimation();

        const startHeight = `${this.$details!.offsetHeight}px`;
        const endHeight = `${this.$summary!.offsetHeight}px`;

        this.animation = this.createAnimation(startHeight, endHeight);
        this.animation.onfinish = () => this.onAnimationFinish(false);
        this.animation.oncancel = () => this.onCloseCancel();

        this.dispatchCustomEvent('accordion-closed');
    }

    private open(): void {
        this.isExpanding = true;
        this.$details!.style.height = `${this.offsetHeight}px`;
        this.$details!.setAttribute('open', '');
        this.$details!.classList.add(Accordion.CLASS_ACTIVE);
        this.prepareForAnimation();

        window.requestAnimationFrame(() => {
            const startHeight = `${this.$details!.offsetHeight}px`;
            const endHeight = `${this.$summary!.offsetHeight + this.$content!.offsetHeight}px`;

            this.animation = this.createAnimation(startHeight, endHeight);
            this.animation.onfinish = () => this.onAnimationFinish(true);
            this.animation.oncancel = () => this.onExpandCancel();
        });

        this.dispatchCustomEvent('accordion-opened');
    }

    // =============================================================================
    // Animation Callbacks
    // =============================================================================
    private onAnimationFinish(open: boolean): void {
        if (open) {
            this.$details!.setAttribute('open', '');
        } else {
            this.$details!.removeAttribute('open');
        }

        this.cleanupAfterAnimation();

        this.dispatchCustomEvent('accordion-animation-finished', {
            isOpen: open
        });
    }

    private onCloseCancel(): void {
        this.isClosing = false;
        this.$details!.classList.add(Accordion.CLASS_ACTIVE);
    }

    private onExpandCancel(): void {
        this.isExpanding = false;
        this.$details!.classList.remove(Accordion.CLASS_ACTIVE);
    }

    // =============================================================================
    // Utilities
    // =============================================================================
    private dispatchCustomEvent(eventName: string, detail: any = {}): void {
        this.dispatchEvent(
            new CustomEvent(eventName, {
                detail: { target: this, ...detail },
                bubbles: true
            })
        );
    }

    private validateElements(): boolean {
        if (!this.$summary || !this.$details || !this.$content) {
            console.warn('Accordion: Missing required elements (summary, details, or content)');
            return false;
        }
        return true;
    }

    // =============================================================================
    // Public API
    // =============================================================================
    public toggle(): void {
        if (this.isAnimating()) return;

        if (this.isOpen()) {
            this.close();
        } else {
            this.openAccordion();
        }
    }

    public openAccordion(): void {
        if (!this.isOpen() && !this.isAnimating()) {
            this.open();
        }
    }

    public closeAccordion(): void {
        if (this.isOpen() && !this.isAnimating()) {
            this.close();
        }
    }

    public isOpen(): boolean {
        return this.$details?.hasAttribute('open') ?? false;
    }

    public isAnimating(): boolean {
        return this.isClosing || this.isExpanding;
    }
}

// Register the custom element
customElements.define('c-accordion', ComponentElement(Accordion, 'Accordion'));
