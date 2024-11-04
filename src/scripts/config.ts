const config: Config = Object.freeze({
    // Utopia
    utopia: {
        minViewport: 320,
        maxViewport: 1440,
        rootSize: 16
    },
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD
});

export { config };
