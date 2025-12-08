import { Dashboard } from "@/components/Dashboard";
import { generateTopGPUsItemList, generateFAQSchema, serializeSchema } from "@/lib/seo/structured-data";
import { gpuData } from "@/lib/data";
import { faqs } from "@/lib/content/faqs";

// Client-side data fetching for faster initial page load
export default function Home() {
  // Generate structured data for homepage
  const sortedGPUs = [...gpuData].sort((a, b) => a.price - b.price);
  const topGPUsSchema = generateTopGPUsItemList(sortedGPUs);
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(topGPUsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }}
      />
      <Dashboard />
    </>
  );
}
