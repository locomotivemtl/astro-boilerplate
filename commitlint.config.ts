/* Lenient on purpose: no Conventional Commits types, only a clear, short subject line */
export default {
    plugins: [
        {
            rules: {
                'header-min-word-count': (
                    { header }: { header: string | null },
                    _when?: string,
                    value = 2,
                ) => {
                    const count = header?.trim().split(/\s+/).filter(Boolean).length ?? 0;
                    return [count >= value, `header must contain at least ${value} words`];
                },
            },
        },
    ],
    rules: {
        /* Git tools expect a blank line between the subject and the body */
        'body-leading-blank': [1, 'always'],
        'header-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
        'header-min-length': [2, 'always', 5],
        /* Blocks one-word messages like "wip" or "fix" */
        'header-min-word-count': [2, 'always', 2],
    },
};
