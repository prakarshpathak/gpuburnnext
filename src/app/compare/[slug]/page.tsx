import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGPUComparison, getProviderComparison, getAllComparisonSlugs, ProviderComparison } from "@/lib/content/comparisons";
import { generateArticleSchema, serializeSchema } from "@/lib/seo/structured-data";
import ComparisonPageClient from "@/components/ComparisonPageClient";

export async function generateStaticParams() {
  const slugs = getAllComparisonSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const gpuComp = getGPUComparison(slug);
  const providerComp = getProviderComparison(slug);

  const comparison = gpuComp || providerComp;

  if (!comparison) {
    return {
      title: 'Comparison Not Found',
    };
  }

  const title = comparison.title;
  const description = gpuComp
    ? `Compare ${gpuComp.gpu1.name} vs ${gpuComp.gpu2.name} for AI workloads. Detailed performance benchmarks, pricing analysis, and recommendations for machine learning teams.`
    : `Compare ${(providerComp as ProviderComparison).provider1.name} vs ${(providerComp as ProviderComparison).provider2.name}. Pricing, features, and reliability comparison for GPU cloud providers.`;

  return {
    title: `${title} | cheapestGPU`,
    description,
    keywords: gpuComp
      ? [
        `${gpuComp.gpu1.name} vs ${gpuComp.gpu2.name}`,
        `${gpuComp.gpu1.name} comparison`,
        `${gpuComp.gpu2.name} comparison`,
        'gpu comparison',
        'ml gpu benchmark',
        'llm training gpu',
        'ai gpu comparison',
      ]
      : [
        `${(providerComp as ProviderComparison).provider1.name} vs ${(providerComp as ProviderComparison).provider2.name}`,
        'gpu provider comparison',
        'cloud gpu pricing',
        'gpu rental comparison',
      ],
    openGraph: {
      title,
      description,
      url: `https://cheapestgpu.com/compare/${slug}`,
      type: 'article',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gpuComp = getGPUComparison(slug);
  const providerComp = getProviderComparison(slug);

  const comparison = gpuComp || providerComp;

  if (!comparison) {
    notFound();
  }

  // Generate structured data
  const structuredData = generateArticleSchema({
    title: comparison.title,
    description: gpuComp
      ? `Comprehensive comparison of ${gpuComp.gpu1.name} vs ${gpuComp.gpu2.name} for enterprise AI workloads`
      : `Provider comparison: ${(providerComp as ProviderComparison).provider1.name} vs ${(providerComp as ProviderComparison).provider2.name}`,
    author: 'cheapestGPU Team',
    datePublished: new Date().toISOString(),
    url: `https://cheapestgpu.com/compare/${slug}`,
    imageUrl: '/og-image.png',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(structuredData) }}
      />
      <ComparisonPageClient
        gpuComparison={gpuComp}
        providerComparison={providerComp}
      />
    </>
  );
}
