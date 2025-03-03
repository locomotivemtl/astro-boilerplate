type BuildSrcSetOptions = {
    src: string;
    width: number;
    height?: number;
    candidates?: number[];
};

export const buildSrcSet = (options: BuildSrcSetOptions) => {
    const { src, width, height, candidates } = options;

    if (!(src && width)) {
        return undefined;
    }

    return (candidates || [])
        .map((multiplier) => {
            const url = new URL(src);
            const finalWidth = Math.floor(width * multiplier);
            const finalHeight = height ? Math.floor(height * multiplier) : undefined;

            if (finalWidth < 50) {
                return null;
            }

            // Append Storyblok modifiers to the existing pathname
            url.pathname += `/m/${finalWidth}x${finalHeight ?? 0}/filters:format(auto):no_upscale():quality(70)`;

            return `${url.toString()} ${finalWidth}w`;
        })
        .filter(Boolean)
        .join(',');
};
