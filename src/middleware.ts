import { defineMiddleware } from "astro:middleware";
import { defaultLocale } from "./scripts/utils/i18n";

const supportedLanguages = ['en', 'fr'];

const getPreferredLanguage = (languages: any) => {
    // Get preferred languages
    const userLanguages = languages;

    const preferredLanguage = userLanguages.map((lang: string) => {
            // Check if the language has a quality value
            if (lang.includes(';')) {
                return lang.split(';')[0];
            }

            return new Intl.Locale(lang).language || lang;
        }) .find((lang: string) => supportedLanguages.includes(lang)); // Find the first supported language


    // Default to 'en' if no match
    return preferredLanguage || defaultLocale;
};

export const onRequest = defineMiddleware(async (context, next) => {
    console.log('onRequest middleware');

    // Only run the middleware on the home page
    if (context.request.url.endsWith('/')) {
        // Get the user's preferred language
        const userLanguages = context.request.headers.get('accept-language');
        const userLanguagesArray = userLanguages?.split(',') || [];

        const preferredLocale = getPreferredLanguage(userLanguagesArray);

        // Rewrite the path to the localized page (e.g., /en)
        const newPath = `/${preferredLocale}`;

        // Redirect to the new path
        return new Response(null, {
            status: 302,
            headers: {
                Location: newPath,
            },
        });
    }

    return next();
});
