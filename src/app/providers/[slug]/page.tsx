import { Metadata } from "next";
import { notFound } from "next/navigation";
import { gpuData } from "@/lib/data";
import { getProviderBySlug, providers } from "@/lib/providers";
import { generateProviderOrganizationSchema, serializeSchema } from "@/lib/seo/structured-data";
import ProviderPageClient from "@/components/ProviderPageClient";

// Generate static params for all providers
export async function generateStaticParams() {
  return providers.map((provider) => ({
    slug: provider.slug,
  }));
}

// Generate dynamic metadata for each provider
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    return {
      title: 'Provider Not Found',
    };
  }

  const providerGPUs = gpuData.filter(gpu => gpu.provider === provider.name);
  const cheapestPrice = providerGPUs.length > 0
    ? Math.min(...providerGPUs.map(g => g.price)).toFixed(2)
    : 'N/A';

  return {
    title: `${provider.name} GPU Pricing - Compare ${providerGPUs.length} GPU Options | cheapestGPU`,
    description: `${provider.description} Compare ${providerGPUs.length} GPU rental options from ${provider.name}. Starting at $${cheapestPrice}/hour. Find the best GPU for machine learning, AI training, and inference workloads.`,
    keywords: [
      `${provider.name} gpu pricing`,
      `${provider.name} gpu rental`,
      `${provider.name} cloud gpu`,
      `${provider.name} h100 price`,
      `${provider.name} a100 price`,
      'gpu rental comparison',
      'cloud gpu pricing',
      'ml compute infrastructure',
    ],
    openGraph: {
      title: `${provider.name} GPU Pricing - ${providerGPUs.length} Options Available`,
      description: `${provider.description} Starting at $${cheapestPrice}/hour.`,
      url: `https://cheapestgpu.com/providers/${provider.slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${provider.name} GPU Pricing`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${provider.name} GPU Pricing`,
      description: `Compare ${providerGPUs.length} GPU options from ${provider.name}. Starting at $${cheapestPrice}/hour.`,
    },
    alternates: {
      canonical: `/providers/${provider.slug}`,
    },
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const provider = getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  // Generate structured data (using fallback count for SSR)
  const providerGPUs = gpuData.filter(gpu => gpu.provider === provider.name);
  const structuredData = generateProviderOrganizationSchema(provider, providerGPUs.length || 5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(structuredData) }}
      />
      <ProviderPageClient provider={provider} />
    </>
  );
}
