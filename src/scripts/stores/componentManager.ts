import { atom } from 'nanostores';

export class ComponentElement extends HTMLElement {
    constructor() {
        super();

        if (this.id === '') {
            const index = $componentsManagerIncrement.get() + 1;
            $componentsManagerIncrement.set(index);
            this.id = `${this.constructor.name.toLowerCase()}-${index}`;
        }
    }

    // =============================================================================
    // Lifecycle
    // =============================================================================
    connectedCallback() {
        this.register();
    }

    disconnectedCallback() {
        this.unregister();
    }

    // =============================================================================
    // Methods
    // =============================================================================
    register() {
        $componentsManager.set([...$componentsManager.get(), this]);
    }
    unregister() {
        $componentsManager.set(
            $componentsManager.get().filter((component) => component.id !== this.id)
        );
    }
}

export const $componentsManagerIncrement = atom<number>(0);
export const $componentsManager = atom<HTMLElement[]>([]);
