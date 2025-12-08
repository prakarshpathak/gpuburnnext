import { MetadataRoute } from 'next'
import { providers } from '@/lib/providers'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cheapestgpu.com'

    // Homepage
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
    ]

    // Provider pages
    providers.forEach(provider => {
        routes.push({
            url: `${baseUrl}/providers/${provider.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        })
    })

    // GPU comparison pages
    const comparisons = [
        'h100-vs-a100',
        'h100-vs-h200',
        'a100-vs-a6000',
        'rtx-4090-vs-rtx-3090',
        'l40s-vs-a100',
    ]

    comparisons.forEach(comparison => {
        routes.push({
            url: `${baseUrl}/compare/${comparison}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        })
    })

    // Provider comparisons
    const providerComparisons = [
        'aws-vs-gcp',
        'runpod-vs-vast',
        'lambda-vs-runpod',
    ]

    providerComparisons.forEach(comparison => {
        routes.push({
            url: `${baseUrl}/compare/${comparison}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        })
    })

    // Blog posts
    const blogPosts = [
        'gpu-rental-guide-2025',
        'h100-vs-h200-comparison',
        'reduce-ai-compute-costs',
        'best-gpu-for-llm-training',
        'cloud-gpu-pricing-explained',
    ]

    blogPosts.forEach(slug => {
        routes.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        })
    })

    return routes
}
