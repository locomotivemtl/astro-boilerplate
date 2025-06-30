export default {
    rules: {
        // Subject must exist
        'subject-empty': [2, 'never'],
        // Subject must contain at least three words
        'subject-min-word-count': [2, 'always', 3],
        // Subject must be reasonable in length
        'subject-min-length': [2, 'always', 5],
        'subject-max-length': [1, 'always', 100],
        'subject-full-stop': [2, 'never', '.'],

        // Optional body formatting
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [1, 'always', 120]
    },
    parserPreset: {
        // We're not looking for any header pattern (yet)
        parserOpts: {
            headerPattern: /^(.*)$/,
            headerCorrespondence: ['subject']
        }
    },

    // Custom plugin to enforce word count
    plugins: [
        {
            rules: {
                'subject-min-word-count': ({ header }, _when = 'always', value = 3) => {
                    const wordCount = header.trim().split(/\s+/).length;
                    const pass = wordCount >= value;
                    return [pass, `subject must contain at least ${value} words`];
                }
            }
        }
    ]
};
