"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { gpuData as staticData, getTimeSinceUpdate, updateDataTimestamp } from "@/lib/data";
import { GPU } from "@/lib/types";
import { MarketOverview } from "@/components/MarketOverview";
import { AssetPriceComparisonTable } from "@/components/AssetPriceComparisonTable";
import { BurnRateCalculator } from "@/components/BurnRateCalculator";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [data, setData] = useState<GPU[]>(staticData);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('2 hours ago');

  // Fetch live prices on mount
  useEffect(() => {
    async function fetchLivePrices() {
      try {
        const response = await fetch("/api/cron/refresh-prices");
        const result = await response.json();

        if (result.status === "success" && Array.isArray(result.data)) {
          const livePrices = result.data;

          // Smart Merge Strategy
          setData((prevData) =>
            prevData.map((staticGpu) => {
              // Find a match in the live data (by Model + Provider)
              const match = livePrices.find(
                (liveGpu: any) =>
                  liveGpu.model.toLowerCase() === staticGpu.model.toLowerCase() &&
                  liveGpu.provider.toLowerCase() === staticGpu.provider.toLowerCase()
              );

              // If match found, update price & timestamp. Else keep static.
              if (match) {
                return {
                  ...staticGpu,
                  price: match.price,
                  lastUpdated: new Date(), // Mark as fresh
                };
              }
              return staticGpu;
            })
          );
          setIsLive(true);
          updateDataTimestamp();
          setLastUpdated(getTimeSinceUpdate());
        }
      } catch (error) {
        console.error("Failed to fetch live prices", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLivePrices();
    
    // Update timestamp display every minute
    const interval = setInterval(() => {
      setLastUpdated(getTimeSinceUpdate());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 p-6 md:p-12 font-sans transition-colors">
      <div className="max-w-[1600px] mx-auto space-y-12">

        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="GPUprice"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const priceSection = document.getElementById('price-comparison-section');
                priceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Price Comparison
            </button>
            <button 
              onClick={() => window.open('https://spheron.network/', '_blank')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">GPUprice The Internet's Cheapest GPU Marketplace</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">Compute shouldn't cost a kidney.</p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">GPUprice shows you the real prices — not the marked-up, middleman-inflated nonsense the industry pushes.</p>
          <div className="pt-4 space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Track. Compare. Deploy.</p>
            <p className="text-gray-600 dark:text-gray-400">One dashboard. Pure transparency.</p>
          </div>
        </div>

        {/* Burn Rate Calculator */}
        <BurnRateCalculator gpuData={data} />

        {/* Savings Calculator */}
        <SavingsCalculator gpuData={data} />

        {/* Market Overview */}
        <MarketOverview data={data} lastUpdated={lastUpdated} />

        {/* Asset Price Comparison Table */}
        <div id="price-comparison-section">
          <AssetPriceComparisonTable data={data} />
        </div>

        {/* Live GPU Price Index */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live GPU Price Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.filter(gpu => ['Nvidia H100', 'Nvidia H200', 'Nvidia A100', 'Nvidia B200'].includes(gpu.model))
              .slice(0, 4)
              .map(gpu => (
                <a 
                  key={gpu.id} 
                  href={gpu.slug ? `/gpus/${gpu.slug}` : '#'}
                  className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg text-center hover:border-green-500 dark:hover:border-green-600 transition-colors cursor-pointer"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{gpu.model}</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-mono">${gpu.price.toFixed(2)}/hr</div>
                </a>
              ))}
          </div>
        </section>

        {/* Why GPUprice - 2x2 Grid Section */}
        <section className="max-w-6xl mx-auto pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why GPU Exists */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why GPU Pricing Matters</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                GPU compute costs can make or break your AI project. With prices ranging from $0.03/hr to $6.00/hr, choosing the right provider saves thousands monthly.
              </p>
              <div className="flex items-center gap-2 mt-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Save up to 95%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">on compute costs</div>
                </div>
              </div>
            </div>

            {/* How GPU Pricing Works */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Price Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We aggregate real-time pricing from 11+ providers, tracking marketplace dynamics, availability, and system specs to surface the best deals instantly.
              </p>
              <div className="flex items-center gap-2 mt-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Live data updates</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">refreshed every 2 hours</div>
                </div>
              </div>
            </div>

            {/* What Makes GPUprice Special */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Makes Us Different</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                No cloud markup. No vendor lock-in. Just transparent pricing across cloud providers and peer-to-peer marketplaces—all in one place.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full">Multi-GPU configs</span>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">System specs</span>
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">Direct links</span>
              </div>
            </div>

            {/* Use Cases */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Built For</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">🤖</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">AI/ML Engineers</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Training models without breaking the bank</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">🚀</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Startups</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Optimize burn rate with smart GPU choices</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">🎮</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Researchers</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Access enterprise GPUs at marketplace prices</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GPUprice Alerts */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">GPUprice Alerts</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Get notified when:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Prices drop below your threshold</li>
            <li>New cheap regions appear</li>
            <li>High-demand models restock</li>
            <li>A listing beats your current provider</li>
          </ul>
        </section>

        {/* Built for the Future of Compute */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Built for the Future of Compute</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Upcoming features:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Predictive price modeling</li>
            <li>GPU arbitrage engine</li>
            <li>Automated workload routing</li>
            <li>Intelligent spend analyzer</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 mt-16">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-xl font-bold text-gray-900 dark:text-white">GPUprice — compute without the cloud tax.</p>
            <p className="text-gray-600 dark:text-gray-400">Built with transparency, speed, and zero bullshit.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Data last updated {lastUpdated} • {new Set(data.map(gpu => gpu.provider)).size} providers • {data.length} GPU configurations
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
