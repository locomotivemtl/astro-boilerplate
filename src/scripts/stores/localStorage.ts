import { useLocalStorage } from '@scripts/utils/storage/useStorage.ts';

const PROJECT_NAME = (typeof __PROJECT_NAME__ !== 'undefined' && __PROJECT_NAME__) || 'finalfinal';
export const $storage = useLocalStorage(PROJECT_NAME);
