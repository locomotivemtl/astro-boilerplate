export default class SkipLink extends HTMLElement {
    private onClickBind: (e: Event) => void;

    constructor() {
        super();

        // Binding
        this.onClickBind = this.onClick.bind(this);
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
        this.addEventListener('click', this.onClickBind);
    }
    unbindEvents() {
        this.removeEventListener('click', this.onClickBind);
    }

    // =============================================================================
    // Callbacks
    // =============================================================================
    onClick(e: Event) {
        e.preventDefault();

        const $mainContent = document.querySelector(
            this.getAttribute('target') ?? 'main[tabindex]'
        ) as HTMLElement;

        if ($mainContent) {
            $mainContent.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            $mainContent.focus();

            if (document.activeElement != $mainContent) {
                $mainContent.setAttribute('tabindex', '-1');
                $mainContent.focus();

                $mainContent.addEventListener(
                    'blur',
                    () => {
                        $mainContent.removeAttribute('tabindex');
                    },
                    { once: true }
                );
            }
        }
    }
}

customElements.define('c-skip-link', SkipLink);
