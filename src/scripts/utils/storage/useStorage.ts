import { ddv, dlv, dsv } from '@scripts/utils/object.ts';
// import { hash } from '@scripts/utils/string.ts';
import { atom, type WritableAtom } from 'nanostores';

/* Hotfix for the PR */
/* Will be imported from '@scripts/utils/string.ts' */
export const hash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
};

const IS_PROD = (typeof __IS_PROD__ !== 'undefined' && __IS_PROD__) || false;
// @ts-ignore
const TIMESTAMP = (typeof __TIMESTAMP__ !== 'undefined' && __TIMESTAMP__) || '';

const list = new Map();
const p = JSON.parse;
const s = JSON.stringify;

const isAtom = (v: any): v is WritableAtom<any> => {
    return v && typeof v.subscribe === 'function' && typeof v.set === 'function';
};

export interface StorageObject {
    id: string;
    storage: Storage;
    datas: Record<string, any>;
    sync: (key: string, state: any, resetStorage?: boolean) => WritableAtom;
    get: (key: string, def?: any) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
    folder: (subKey: string) => StorageObject;
}

function createStorage(id: string, storage = localStorage, encode = s, decode = p): StorageObject {
    const _storage = storage;
    const _id = id;

    // Map to keep track of nanostores subscription disposers for each key.
    // This allows us to unsubscribe when a key is re‑synced or when the storage
    // is disposed, preventing dangling listeners that could cause memory leaks.
    const _unsubMap = new Map<string, () => void>();

    // ---------------------------------------------------------------------
    // Simple write‑queue to avoid concurrent writes to the underlying storage.
    // All mutating operations (set, remove, clear) are enqueued and executed
    // sequentially using requestIdleCallback. This prevents race conditions when
    // multiple parts of the app (or multiple tabs) try to write at the same time.
    // ---------------------------------------------------------------------
    const _writeQueue: Array<() => void> = [];
    let _processingQueue = false;

    const enqueueWrite = (op: () => void) => {
        _writeQueue.push(op);
        if (!_processingQueue) {
            _processingQueue = true;
            // Use requestIdleCallback if available, otherwise fallback to setTimeout.
            const schedule =
                typeof requestIdleCallback === 'function'
                    ? requestIdleCallback
                    : (cb: any) => setTimeout(cb, 0);
            schedule(processWriteQueue);
        }
    };

    const processWriteQueue = (deadline?: any) => {
        while (_writeQueue.length && (!deadline || deadline.timeRemaining() > 0)) {
            const op = _writeQueue.shift();
            if (op) op();
        }
        if (_writeQueue.length) {
            const schedule =
                typeof requestIdleCallback === 'function'
                    ? requestIdleCallback
                    : (cb: any) => setTimeout(cb, 0);
            schedule(processWriteQueue);
        } else {
            _processingQueue = false;
        }
    };

    // Initialise storage if missing
    if (_storage.getItem(_id) === null) {
        _storage.setItem(_id, encode({}));
    }

    const datas = decode(_storage.getItem(_id) || '{}') as Record<string, any>;

    // ----- Helper functions -----
    function sync(key: string, state: WritableAtom, resetStorage = IS_PROD) {
        if (!isAtom(state)) state = atom(state);

        if (resetStorage) set(key, state.get());

        const data = get(key, state.get());
        state.set(data);

        // If we already have a subscription for this key, unsubscribe first.
        const previousUnsub = _unsubMap.get(key);
        if (previousUnsub) previousUnsub();

        const unsub = state.subscribe((value) => set(key, value));
        _unsubMap.set(key, unsub);
        return state;
    }

    function set(childId: string, data: any) {
        enqueueWrite(() => {
            dsv(datas, childId, data);
            _storage.setItem(_id, encode(datas));
        });
    }

    function get(childId: string, def: any = null) {
        return dlv(datas, childId, def);
    }

    function remove(childId: string) {
        enqueueWrite(() => {
            try {
                ddv(datas, childId);
                _storage.setItem(_id, encode(datas));
            } catch (e) {
                if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
                    console.error(e);
                }
            }
        });
    }

    function clear() {
        enqueueWrite(() => {
            // Remove the stored item.
            _storage.removeItem(_id);
        });
        // Unsubscribe all listeners to avoid leaks.
        _unsubMap.forEach((unsub) => unsub());
        _unsubMap.clear();
    }

    // Return all the methods of this storage with the subKey as a prefix
    function folder(subKey: string) {
        subKey = subKey.toLowerCase();

        // Ensure the subKey exists
        if (!get(subKey)) {
            set(subKey, {});
        }

        return {
            get id() {
                return `${_id}.${subKey}`;
            },
            get subId() {
                return subKey;
            },
            get storage() {
                return _storage;
            },
            get datas() {
                return dlv(datas, subKey, {});
            },
            sync: (key: string, state: WritableAtom, resetStorage = IS_PROD) =>
                sync(`${subKey}.${key}`, state, resetStorage),
            get: (key: string, def: any) => get(`${subKey}.${key}`, def),
            set: (key: string, value: any) => set(`${subKey}.${key}`, value),
            remove: (key: string) => remove(`${subKey}.${key}`),
            // Reset the sub‑folder to an empty object and clean up any listeners for that sub‑key
            clear: () => {
                // Unsubscribe any listeners that were created for keys belonging to this sub‑folder.
                const prefix = `${subKey}.`;
                for (const key of _unsubMap.keys()) {
                    if (key === subKey || key.startsWith(prefix)) {
                        const unsub = _unsubMap.get(key);
                        if (unsub) unsub();
                        _unsubMap.delete(key);
                    }
                }
                // Reset the stored object for the sub‑folder.
                set(subKey, {});
            },
            folder: (key: string) => folder(`${subKey}.${key}`)
        };
    }

    // ----- Public storage object -----
    return {
        get id() {
            return _id;
        },
        get storage() {
            return _storage;
        },
        get datas() {
            return datas;
        },
        sync,
        get,
        set,
        remove,
        clear,
        folder
    };
}

// Create a storage object
export function useStorage(
    _id = 'dummy',
    _storage = localStorage,
    { encode = s, decode = p } = {}
): StorageObject {
    // return the dummy storage if no id

    // normalize id
    _id = _id.toLowerCase();

    // Avoid leaking storage objects in production
    if (IS_PROD) _id += hash(_id + TIMESTAMP);

    // return storage if it exists
    if (list.has(_id)) {
        if (list.get(_id).storage === _storage) {
            return list.get(_id);
        }
    }

    // create storage if it doesn't exist
    const id = `__storage.${_id}`;
    const storage = createStorage(id, _storage, encode, decode);
    list.set(_id, storage);

    return storage;
}

export function useLocalStorage(id: string, { encode = s, decode = p } = {}): StorageObject {
    return useStorage(id, localStorage, { encode, decode });
}

export function useSessionStorage(id: string, { encode = s, decode = p } = {}): StorageObject {
    return useStorage(id, sessionStorage, { encode, decode });
}
