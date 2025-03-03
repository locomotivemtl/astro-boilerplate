/**
 * Get the dimensions of the image from the URL
 * https://www.storyblok.com/faq/image-dimensions-assets-js
 */
export const getDimensions = (url: string) => {
    const dimensions = url.split('/')[5].split('x');
    return {
        width: parseInt(dimensions[0], 10),
        height: parseInt(dimensions[1], 10)
    };
};

/**
 * Get the aspect ratio of the image
 */
export const getAspectRatio = (width: number, height: number) => {
    return height / width;
};
