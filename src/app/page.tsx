import { BurnRateCalculator } from "@/components/BurnRateCalculator";
import { MarketTable } from "@/components/MarketTable";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          GPU Intelligence
        </h1>
      </header>

      {/* Burn Rate Calculator */}
      <div className="mb-12">
        <BurnRateCalculator />
      </div>

      {/* Market Table */}
      <div className="mt-12">
        <MarketTable />
      </div>
    </main>
  );
}
