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
            <Image
              src="/logo-full.png"
              alt="Find Me GPU"
              width={240}
              height={64}
              className="h-16 w-auto dark:invert"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Price Comparison
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
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
        <AssetPriceComparisonTable data={data} />

        {/* Why GPUprice Exists */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why GPUprice Exists</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">The GPU market is broken.</p>
            <p>Centralized clouds charge outrageous premiums. Middlemen take cuts. Brokers hide behind NDAs.</p>
            <p className="pt-4">GPUprice fixes that by bringing radical transparency.</p>
            <p>We list real-time hourly GPU prices across decentralized networks, bare-metal providers, cloud platforms, and community suppliers so you never overpay again.</p>
          </div>
        </section>

        {/* How GPUprice Works */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How GPUprice Works</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Live Price Feeds</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">Aggregated and normalized pricing from:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Decentralized GPU networks</li>
                <li>Bare-metal datacenters</li>
                <li>Cloud providers</li>
                <li>Community GPU suppliers</li>
                <li>Spheron AI Marketplace (native integration)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accurate Cost Benchmarking</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">Compare prices for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>H100 / H200</li>
                <li>A100 / A100 80GB</li>
                <li>B200</li>
                <li>RTX-series GPUs</li>
                <li>Multi-node clusters</li>
                <li>Region-specific supply</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Recommendations</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">GPUprice identifies:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Cheapest machine available</li>
                <li>Best performance-per-dollar</li>
                <li>Lowest-latency region</li>
                <li>Demand spikes and dips</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Deploy Directly (Optional)</h3>
              <p className="text-gray-700 dark:text-gray-300">Deploy through Spheron instantly with the same transparent pricing.</p>
            </div>
          </div>
        </section>

        {/* What Makes GPUprice Different */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Makes GPUprice Different</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 ml-4">
            <li>Transparent by default</li>
            <li>No middleman markups</li>
            <li>Cheapest GPUs available anywhere online</li>
            <li>Real supply, no ghost inventory</li>
            <li>Unified view of global GPU markets</li>
          </ul>
        </section>

        {/* Use Cases */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">For AI Teams</h3>
              <p className="text-gray-700 dark:text-gray-300">Save budget, deploy faster.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">For Researchers</h3>
              <p className="text-gray-700 dark:text-gray-300">Run experiments without massive bills.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">For Startups</h3>
              <p className="text-gray-700 dark:text-gray-300">Extend runway and scale cheaply.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">For Enterprises</h3>
              <p className="text-gray-700 dark:text-gray-300">Use real data to negotiate real contracts.</p>
            </div>
          </div>
        </section>

        {/* Live GPU Price Index */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live GPU Price Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.filter(gpu => ['NVIDIA H100', 'NVIDIA H200', 'NVIDIA A100', 'NVIDIA B200'].some(model => gpu.model.includes(model.split(' ')[1])))
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
            <p className="text-xl font-bold text-gray-900 dark:text-white">GPUprice compute without the cloud tax.</p>
            <p className="text-gray-600 dark:text-gray-400">Built with transparency, speed, and zero bullshit.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
