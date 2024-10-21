import { atom } from 'nanostores';

export type ComponentElementInstance = {
    uid: string;
    name: string;
    instance: ComponentElement;
};

export class ComponentElement extends HTMLElement {
    public uid: string;

    constructor() {
        super();
        this.uid = (() => {
            $componentsManagerIncrement.set($componentsManagerIncrement.get() + 1);
            return $componentsManagerIncrement.get().toString();
        })();
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
        $componentsManager.set([
            ...$componentsManager.get(),
            {
                uid: this.uid,
                name: this.constructor.name,
                instance: this
            }
        ]);
    }
    unregister() {
        $componentsManager.set(
            $componentsManager.get().filter((component) => component.uid !== this.uid)
        );
    }
}

export const $componentsManagerIncrement = atom<number>(0);
export const $componentsManager = atom<ComponentElementInstance[]>([]);
