import { fetchAllPrices } from "@/lib/price-fetcher";
import { Dashboard } from "@/components/Dashboard";

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const initialData = await fetchAllPrices();

  return <Dashboard initialData={initialData} />;
}
