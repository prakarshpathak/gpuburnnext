import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: 'https://cheapestgpu.com/sitemap.xml', // Assuming the domain, will use a placeholder or ask user if needed, but for now assuming cheapestgpu.com based on title
    }
}
