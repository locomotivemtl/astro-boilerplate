export default class SkipLink extends HTMLElement {
    private $button: ChildNode | null;

    constructor() {
        super();

        // Binding
        this.onClick = this.onClick.bind(this);

        // UI
        this.$button = this.firstElementChild;
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
        if (this.$button) {
            this.$button.addEventListener('click', this.onClick);
        }
    }
    unbindEvents() {
        if (this.$button) {
            this.$button.removeEventListener('click', this.onClick);
        }
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    onClick(e: Event) {
        e.preventDefault();

        const $mainContent = document.querySelector(
            this.parentElement?.getAttribute('target') ?? 'main[tabindex]'
        ) as HTMLElement;

        if (!$mainContent) {
            return;
        }

        $mainContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        $mainContent.focus();

        if (document.activeElement === $mainContent) {
            return;
        }

        $mainContent.setAttribute('tabindex', '-1');
        $mainContent.focus();

        $mainContent.addEventListener(
            'blur',
            () => $mainContent.removeAttribute('tabindex'),
            { once: true }
        );
    }
}

customElements.define('c-skip-link', SkipLink);
