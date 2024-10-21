export default class SkipLink extends HTMLElement {
    private $link: HTMLLinkElement | null;

    constructor() {
        super();

        // Binding
        this.onClick = this.onClick.bind(this);

        // UI
        this.$link = this.firstElementChild as HTMLLinkElement;
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
        if (this.$link) {
            this.$link.addEventListener('click', this.onClick);
        }
    }
    unbindEvents() {
        if (this.$link) {
            this.$link.removeEventListener('click', this.onClick);
        }
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    onClick(e: Event) {
        e.preventDefault();

        const $target = document.querySelector(
            this.$link?.getAttribute('href') ?? 'main'
        ) as HTMLElement;

        if (!$target) {
            return;
        }

        $target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        $target.focus();

        if (document.activeElement === $target) {
            return;
        }

        $target.setAttribute('tabindex', '-1');
        $target.focus();

        $target.addEventListener('blur', () => $target.removeAttribute('tabindex'), { once: true });
    }
}

customElements.define('c-skip-link', SkipLink);
