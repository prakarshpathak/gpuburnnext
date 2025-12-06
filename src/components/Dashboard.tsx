"use client";

import { useGPUPrices } from "@/hooks/useGPUPrices";
import { MarketOverview } from "@/components/MarketOverview";
import { AssetPriceComparisonTable } from "@/components/AssetPriceComparisonTable";
import { BurnRateCalculator } from "@/components/BurnRateCalculator";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrapedGPU } from "@/lib/price-fetcher";
import Image from "next/image";

interface DashboardProps {
    initialData: ScrapedGPU[];
}

export function Dashboard({ initialData }: DashboardProps) {
    const { data, lastUpdated } = useGPUPrices(initialData);

    return (
        <div className="min-h-screen text-foreground p-4 md:p-6 lg:p-12 font-sans transition-colors">
            <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 border-b border-border pb-4 md:pb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* GPU Logo */}
                        <Image src="/gpu-logo-final.png" alt="cheapestGPU Logo" width={64} height={64} className="h-12 md:h-16 w-auto object-contain" priority />
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent font-pixelify">
                                cheapestGPU
                            </h1>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground mt-1 md:mt-2">
                                The Internet&apos;s Cheapest GPU Marketplace
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Last Updated
                            </div>
                            <div className="text-sm font-mono text-foreground">
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
                    <section className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
                        <SavingsCalculator gpuData={data} />
                    </section>

                    {/* Burn Rate Calculator */}
                    <section className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
                        <BurnRateCalculator gpuData={data} />
                    </section>

                    {/* Comparison Table */}
                    <section className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
                        <AssetPriceComparisonTable data={data} />
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} cheapestGPU. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
