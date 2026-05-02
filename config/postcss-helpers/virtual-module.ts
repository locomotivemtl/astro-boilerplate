export type Helper = {
    name: string;
    process: (value: string) => string;
};

export function generateVirtualModuleCode(helpers: Helper[], regex: RegExp): string {
    const processorEntries = helpers
        .map(({ name, process }) => {
            return `    '${name}': ${process.toString()}`;
        })
        .join(',\n');

    const regexSource = regex.source;
    const regexFlags = regex.flags;

    return `
const processors = {
${processorEntries}
};

const helperPattern = new RegExp(${JSON.stringify(regexSource)}, ${JSON.stringify(regexFlags)});

export function processStyle(styleString) {
    if (!helperPattern.test(styleString)) {
        return styleString;
    }

    helperPattern.lastIndex = 0;
    let result = styleString;

    for (const processor of Object.values(processors)) {
        result = processor(result);
    }

    return result;
}
    `;
}
