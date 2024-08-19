import metaImage from '@images/meta.png';

export const defaultSeo: Seo = {
    title: 'Astro boilerplate',
    description: 'Boilerplate for Astro',
    social: {
        facebook: {
            title: 'Astro boilerplate',
            image: {
                url: metaImage.src
            },
            description: 'Boilerplate for Astro'
        },
        twitter: {
            creator: '@LocomotiveMTL',
            title: 'Astro boilerplate',
            image: {
                url: metaImage.src
            },
            description: 'Boilerplate for Astro'
        }
    },
    advanced: {
        robots: ['noindex', 'nofollow'],
        canonical: 'https://locomotive.ca'
    }
};
