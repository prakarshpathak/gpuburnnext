"use client";

import { useGPUPrices } from "@/hooks/useGPUPrices";
import { MarketOverview } from "@/components/MarketOverview";
import { AssetPriceComparisonTable } from "@/components/AssetPriceComparisonTable";
import { BurnRateCalculator } from "@/components/BurnRateCalculator";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrapedGPU } from "@/lib/price-fetcher";

interface DashboardProps {
    initialData: ScrapedGPU[];
}

export function Dashboard({ initialData }: DashboardProps) {
    const { data, loading, isLive, lastUpdated } = useGPUPrices(initialData);

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 p-6 md:p-12 font-sans transition-colors">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="flex items-center gap-4">
                        {/* GPU Logo */}
                        <img src="/gpu-logo-final.png" alt="cheapestGPU Logo" className="h-16 w-auto object-contain" />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent font-pixelify">
                                cheapestGPU
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                                The Internet's Cheapest GPU Marketplace
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                                Last Updated
                            </div>
                            <div className="text-sm font-mono text-gray-900 dark:text-gray-300">
                                {lastUpdated}
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </header>

                {/* Market Overview */}
                <section>
                    <MarketOverview data={data} />
                </section>

                {/* Main Content */}
                <div className="space-y-12">

                    {/* Savings Calculator */}
                    <section className="bg-gray-50 dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <SavingsCalculator gpuData={data} />
                    </section>

                    {/* Burn Rate Calculator */}
                    <section className="bg-gray-50 dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <BurnRateCalculator gpuData={data} />
                    </section>

                    {/* Comparison Table */}
                    <section className="bg-gray-50 dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <AssetPriceComparisonTable data={data} />
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} cheapestGPU. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
