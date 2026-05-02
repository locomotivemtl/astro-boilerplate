import { atom, type WritableAtom } from 'nanostores';

const p = JSON.parse;
const s = JSON.stringify;

const isAtom = (v: any): v is WritableAtom<any> => {
    return v && typeof v.subscribe === 'function' && typeof v.set === 'function';
};

// Create an writable signal that syncs with localStorage
// independently of the project storage (cf. useStorage)
export function useStorageState(
    id: string,
    state: WritableAtom,
    storage = localStorage,
    { encode = s, decode = p } = {}
) {
    id = `__storage_state:${id}`;

    if (!isAtom(state)) state = atom(state);

    if (storage.getItem(id) === null) storage.setItem(id, encode(state.value));

    state.set(decode(storage.getItem(id) || 'null'));
    state.subscribe((value) => storage.setItem(id, encode(value)));

    return state;
}
