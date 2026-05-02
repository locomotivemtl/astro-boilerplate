export type CommentStyle = { open: string; close?: string };

/**
 * Processes conditional compilation directives (#if, #elif, #else, #endif)
 * in source code using the provided defines map.
 *
 * @param source Source code string to process
 * @param filePath File path shown in verbose log messages
 * @param defs Map of define names to their values (from Vite's `define`)
 * @param verbose Log which branches are taken to the console
 * @param commentStyles Comment styles to recognize (e.g. `[{ open: '///' }]` or `[{ open: '<!--', close: '-->' }]`)
 * @param fillWithBlanks Replace excluded lines with spaces (preserves line numbers)
 * @param uncommentPrefix Prefix string marking lines to un-comment when revealed
 * @returns Processed source code string
 */
export function parse(
    source: string,
    filePath: string,
    defs: Record<string, unknown>,
    verbose: boolean,
    commentStyles: CommentStyle[],
    fillWithBlanks: boolean,
    uncommentPrefix: string | undefined
): string;
