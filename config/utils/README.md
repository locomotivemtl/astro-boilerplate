# utils

Shared helpers for the integrations in `config/`.

`writeGeneratedTypes.ts` writes a declaration file to `types/generated/<fileName>` under a shared auto-generated header. It skips the write when the file content is unchanged, so the TS server does not reload it for nothing. `config/breakpoint-helper` and `config/define` both use it.
