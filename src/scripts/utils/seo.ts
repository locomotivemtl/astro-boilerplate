export const getSeo = (seo: ISeo, defaultSeo: ISeo, pageTitle: string | null = null) => {

    const title = seo?.title || pageTitle || defaultSeo.title
    const description = seo?.description || defaultSeo.description

    return {
        title,
        description,
        openGraph: {
            basic: {
                type: 'website',
                title: seo?.social?.facebook?.title || defaultSeo.social?.facebook?.title || title || '',
                description: seo?.social?.facebook?.description || defaultSeo.social?.facebook?.description || description,
                image: seo?.social?.facebook?.image?.url || defaultSeo.social?.facebook?.image?.url || ''
            }
        },
        twitter: {
            creator: seo?.social?.twitter?.creator || defaultSeo.social?.twitter?.creator,
            image: seo?.social?.twitter?.image?.url || defaultSeo.social?.twitter?.image?.url,
            title: seo?.social?.twitter?.title || defaultSeo.social?.twitter?.title || title,
            description: seo?.social?.twitter?.description || defaultSeo.social?.twitter?.description || description
        },
        canonical: seo?.advanced?.canonical || defaultSeo.advanced?.canonical,
        noindex: seo?.advanced?.robots?.includes('noindex') || defaultSeo?.advanced?.robots?.includes('noindex'),
        nofollow: seo?.advanced?.robots?.includes('nofollow') || defaultSeo?.advanced?.robots?.includes('noindex'),
        extend: {
            meta: [
                {
                    name: 'robots',
                    content: seo?.advanced?.robots?.join(',') || defaultSeo.advanced?.robots?.join(',')
                }
            ]
        },
    }
}
