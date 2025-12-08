import { GPU, Provider } from '@/types';

// Generate Product schema for GPU models
export function generateGPUProductSchema(gpu: GPU) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${gpu.model} GPU Rental`,
    "description": `Rent ${gpu.model} GPU with ${gpu.vram}GB VRAM from ${gpu.provider}. ${gpu.type} performance for machine learning, AI training, and inference workloads.`,
    "brand": {
      "@type": "Brand",
      "name": gpu.provider
    },
    "offers": {
      "@type": "Offer",
      "price": gpu.price.toFixed(2),
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": gpu.price.toFixed(2),
        "priceCurrency": "USD",
        "unitText": "HOUR"
      },
      "availability": gpu.availability === 'Available'
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "url": gpu.launchUrl,
      "seller": {
        "@type": "Organization",
        "name": gpu.provider
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "VRAM",
        "value": `${gpu.vram}GB`
      },
      {
        "@type": "PropertyValue",
        "name": "GPU Count",
        "value": gpu.gpuCount || 1
      },
      {
        "@type": "PropertyValue",
        "name": "Performance Tier",
        "value": gpu.type
      }
    ]
  };
}

// Generate AggregateOffer schema for GPU model price ranges
export function generateAggregateOfferSchema(model: string, gpus: GPU[]) {
  const prices = gpus.map(g => g.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "name": `${model} GPU Rental`,
    "lowPrice": minPrice.toFixed(2),
    "highPrice": maxPrice.toFixed(2),
    "priceCurrency": "USD",
    "offerCount": gpus.length,
    "offers": gpus.map(gpu => ({
      "@type": "Offer",
      "price": gpu.price.toFixed(2),
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": gpu.provider
      }
    }))
  };
}

// Generate Organization schema for providers
export function generateProviderOrganizationSchema(provider: Provider, gpuCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": provider.name,
    "url": provider.website,
    "description": provider.description,
    "sameAs": [provider.website],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${provider.name} GPU Rental Catalog`,
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Cloud GPU Rentals",
          "numberOfItems": gpuCount
        }
      ]
    }
  };
}

// Generate ItemList schema for top GPUs
export function generateTopGPUsItemList(gpus: GPU[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cheapest GPU Rentals",
    "description": "Top 10 most affordable GPU rental options for machine learning and AI workloads",
    "itemListElement": gpus.slice(0, 10).map((gpu, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${gpu.model} - ${gpu.provider}`,
        "description": `${gpu.model} GPU rental from ${gpu.provider} at $${gpu.price.toFixed(2)}/hour`,
        "offers": {
          "@type": "Offer",
          "price": gpu.price.toFixed(2),
          "priceCurrency": "USD",
          "availability": gpu.availability === 'Available'
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock"
        }
      }
    }))
  };
}

// Generate FAQPage schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Generate WebSite schema with SearchAction
export function generateWebSiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "cheapestGPU",
    "url": siteUrl,
    "description": "Compare and find the cheapest GPU rental prices across all cloud providers. Real-time pricing for H100, A100, and other GPUs for machine learning and AI workloads.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// Generate Article schema for blog posts
export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "image": article.imageUrl,
    "url": article.url,
    "publisher": {
      "@type": "Organization",
      "name": "cheapestGPU",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cheapestgpu.com/gpu-logo-final.png"
      }
    }
  };
}

// Helper to serialize schema to JSON-LD script tag
export function serializeSchema(schema: object) {
  return JSON.stringify(schema);
}
