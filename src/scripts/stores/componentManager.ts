import { atom } from 'nanostores';

export const ComponentElement = <BaseClass extends CustomElementConstructor>(Base: BaseClass) => {
    return class extends Base {
        prototypeType: string;

        constructor(...args: any[]) {
            super(...args);

            this.prototypeType = Base.name;

            if (!this.id) {
                const index = $componentsManagerIncrement.get() + 1;
                $componentsManagerIncrement.set(index);
                this.id = `${Base.name.toLowerCase()}-${index}`;
            }
        }

        connectedCallback() {
            if (typeof (Base.prototype as any).connectedCallback === 'function') {
                (Base.prototype as any).connectedCallback.call(this);
            }

            $componentsManager.set([...$componentsManager.get(), this]);
        }

        disconnectedCallback() {
            if (typeof (Base.prototype as any).disconnectedCallback === 'function') {
                (Base.prototype as any).disconnectedCallback.call(this);
            }

            $componentsManager.set(
                $componentsManager.get().filter(($component) => $component.id !== this.id)
            );
        }
    };
};

export const $componentsManagerIncrement = atom<number>(0);
export const $componentsManager = atom<InstanceType<ReturnType<typeof ComponentElement>>[]>([]);

export const getComponentById = (id: string) => {
    return $componentsManager.get().find(($component) => $component.id === id);
};

export const getComponentsByPrototype = (
    prototype: string,
    selectorsToExclude:
        | string[]
        | string
        | HTMLElement
        | InstanceType<ReturnType<typeof ComponentElement>> = []
) => {
    let excludedSelectors: string[] = [];

    if (typeof selectorsToExclude === 'string') {
        excludedSelectors = [selectorsToExclude];
    } else if (Array.isArray(selectorsToExclude)) {
        excludedSelectors = selectorsToExclude;
    } else if (selectorsToExclude instanceof HTMLElement && selectorsToExclude.id) {
        excludedSelectors = [`#${selectorsToExclude.id}`];
    }

    return ($componentsManager.get() as InstanceType<ReturnType<typeof ComponentElement>>[]).filter(
        ($component: InstanceType<ReturnType<typeof ComponentElement>>) => {
            return (
                prototype === $component.prototypeType &&
                !excludedSelectors.some((selector: string) => $component.matches(selector))
            );
        }
    );
};
