// Revoking too early can cancel the download in Safari and Firefox; FileSaver.js waits 40s.
const REVOKE_DELAY = 40_000;

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const $link = document.createElement('a');
    $link.href = url;
    $link.download = filename;
    $link.click();
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY);
}
