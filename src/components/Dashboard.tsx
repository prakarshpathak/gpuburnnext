"use client";

import { useGPUPrices } from "@/hooks/useGPUPrices";
import { MarketOverview } from "@/components/MarketOverview";
import { AssetPriceComparisonTable } from "@/components/AssetPriceComparisonTable";
import { BurnRateCalculator } from "@/components/BurnRateCalculator";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEOContent } from "@/components/SEOContent";
import { FAQSection } from "@/components/FAQSection";
import { ScrapedGPU } from "@/lib/price-fetcher";
import Image from "next/image";

interface DashboardProps {
    initialData?: ScrapedGPU[];
}

// Skeleton box component - defined outside to prevent recreation on each render
function SkeletonBox({ className }: { className?: string }) {
    return (
        <div className={`bg-muted rounded relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
        </div>
    );
}

// Loading skeleton component - defined outside to prevent recreation on each render
function LoadingSkeleton() {

    return (
        <div className="space-y-8 md:space-y-12">
            {/* Market Overview Skeleton - 3 KPI Cards */}
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 md:p-6 rounded-xl bg-card border border-border">
                            <SkeletonBox className="h-4 w-24 mb-3" />
                            <SkeletonBox className="h-8 w-32 mb-2" />
                            <SkeletonBox className="h-3 w-20" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Savings Calculator Skeleton */}
            <section className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <SkeletonBox className="h-8 w-64 mx-auto mb-3" />
                        <SkeletonBox className="h-4 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-6">
                            <SkeletonBox className="h-12 w-full" />
                            <div className="p-4 md:p-6 rounded-xl border border-border">
                                <SkeletonBox className="h-6 w-48 mb-2" />
                                <SkeletonBox className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <SkeletonBox className="h-24 w-full" />
                                <SkeletonBox className="h-24 w-full" />
                            </div>
                            <SkeletonBox className="h-40 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Burn Rate Calculator Skeleton */}
            <section className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
                <div className="space-y-6 md:space-y-8">
                    <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
                        <SkeletonBox className="h-10 w-72 mx-auto mb-3" />
                        <SkeletonBox className="h-4 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                        {/* Left Column - Config */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="p-4 md:p-6 rounded-xl border border-border">
                                <SkeletonBox className="h-6 w-32 mb-6" />
                                <div className="space-y-5">
                                    <div>
                                        <SkeletonBox className="h-3 w-20 mb-2" />
                                        <SkeletonBox className="h-10 w-full" />
                                    </div>
                                    <div>
                                        <SkeletonBox className="h-3 w-20 mb-2" />
                                        <SkeletonBox className="h-10 w-full" />
                                    </div>
                                    <div className="pt-4 border-t border-border space-y-4">
                                        <div>
                                            <SkeletonBox className="h-3 w-16 mb-2" />
                                            <SkeletonBox className="h-2 w-full" />
                                        </div>
                                        <div>
                                            <SkeletonBox className="h-3 w-20 mb-2" />
                                            <SkeletonBox className="h-2 w-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Price Comparison Chart */}
                            <div className="p-6 border border-border rounded-xl">
                                <SkeletonBox className="h-5 w-32 mb-2" />
                                <SkeletonBox className="h-3 w-48 mb-4" />
                                <SkeletonBox className="h-80 w-full" />
                            </div>
                        </div>

                        {/* Right Column - Visuals */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="p-3 md:p-4 rounded-xl border border-border">
                                        <SkeletonBox className="h-3 w-16 mb-2" />
                                        <SkeletonBox className="h-6 w-20" />
                                    </div>
                                ))}
                            </div>
                            {/* Quick Launch */}
                            <div className="p-4 md:p-6 rounded-xl border border-border">
                                <SkeletonBox className="h-6 w-32 mb-4" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <SkeletonBox key={i} className="h-24 w-full rounded-lg" />
                                    ))}
                                </div>
                            </div>
                            {/* Chart */}
                            <div className="p-4 md:p-6 rounded-xl border border-border">
                                <SkeletonBox className="h-5 w-48 mb-4" />
                                <SkeletonBox className="h-80 md:h-96 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table Skeleton */}
            <section className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
                <div className="space-y-4 md:space-y-6">
                    <div>
                        <SkeletonBox className="h-7 w-64 mb-2" />
                        <SkeletonBox className="h-4 w-96" />
                    </div>

                    {/* Filters */}
                    <div className="space-y-4">
                        <SkeletonBox className="h-10 w-full" />
                        <div className="flex flex-wrap gap-2">
                            <SkeletonBox className="h-3 w-12" />
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <SkeletonBox key={i} className="h-8 w-24" />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <SkeletonBox className="h-10 w-44" />
                            <SkeletonBox className="h-10 w-44" />
                        </div>
                    </div>

                    {/* Results info and toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <SkeletonBox className="h-4 w-48" />
                        <SkeletonBox className="h-8 w-48" />
                    </div>

                    {/* Table */}
                    <div className="rounded-md border border-border overflow-hidden">
                        {/* Table Header */}
                        <div className="flex items-center gap-4 p-4 border-b border-border">
                            <SkeletonBox className="h-4 w-24" />
                            <SkeletonBox className="h-4 w-24" />
                            <SkeletonBox className="h-4 w-16" />
                            <SkeletonBox className="h-4 w-20" />
                            <SkeletonBox className="h-4 w-20" />
                        </div>
                        {/* Table Rows */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
                                <SkeletonBox className="h-5 w-32" />
                                <SkeletonBox className="h-5 w-24" />
                                <SkeletonBox className="h-5 w-16" />
                                <SkeletonBox className="h-5 w-20" />
                                <SkeletonBox className="h-5 w-20" />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <SkeletonBox className="h-10 w-32" />
                        <div className="flex items-center gap-2">
                            <SkeletonBox className="h-10 w-10" />
                            <SkeletonBox className="h-10 w-10" />
                            <SkeletonBox className="h-10 w-10" />
                            <SkeletonBox className="h-10 w-10" />
                        </div>
                        <SkeletonBox className="h-10 w-32" />
                    </div>
                </div>
            </section>
        </div>
    );
}

export function Dashboard({ initialData }: DashboardProps) {
    const { data, loading, lastUpdated } = useGPUPrices(initialData);

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

                {/* Show loading skeleton or actual content */}
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <>
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
                    </>
                )}

                {/* SEO Content Sections - Hidden from users, visible to crawlers */}
                <div className="sr-only" aria-hidden="true">
                    <SEOContent />
                </div>

                {/* FAQ Section */}
                <section className="">
                    <FAQSection />
                </section>

                {/* Footer */}
                <footer className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} cheapestGPU. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
