"use client";

import { useState, useEffect } from "react";
import { gpuData as staticData } from "@/lib/data";
import { GPU } from "@/lib/types";
import { MarketOverview } from "@/components/MarketOverview";
import { AssetPriceComparisonTable } from "@/components/AssetPriceComparisonTable";

export default function Home() {
  const [data, setData] = useState<GPU[]>(staticData);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

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
        }
      } catch (error) {
        console.error("Failed to fetch live prices", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLivePrices();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white">GPUprice The Internet's Cheapest GPU Marketplace</h1>
          <p className="text-xl text-gray-300 font-medium">Compute shouldn't cost a kidney.</p>
          <p className="text-gray-400 text-lg">GPUprice shows you the real prices — not the marked-up, middleman-inflated nonsense the industry pushes.</p>
          <div className="pt-4 space-y-2">
            <p className="text-2xl font-bold text-white">Track. Compare. Deploy.</p>
            <p className="text-gray-400">One dashboard. Pure transparency.</p>
          </div>
        </div>

        {/* Market Overview */}
        <MarketOverview data={data} />

        {/* Asset Price Comparison Table */}
        <AssetPriceComparisonTable data={data} />

        {/* Why GPUprice Exists */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">Why GPUprice Exists</h2>
          <div className="space-y-4 text-gray-300">
            <p className="text-xl font-semibold text-white">The GPU market is broken.</p>
            <p>Centralized clouds charge outrageous premiums. Middlemen take cuts. Brokers hide behind NDAs.</p>
            <p className="pt-4">GPUprice fixes that by bringing radical transparency.</p>
            <p>We list real-time hourly GPU prices across decentralized networks, bare-metal providers, cloud platforms, and community suppliers so you never overpay again.</p>
          </div>
        </section>

        {/* How GPUprice Works */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">How GPUprice Works</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Price Feeds</h3>
              <p className="text-gray-300 mb-3">Aggregated and normalized pricing from:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Decentralized GPU networks</li>
                <li>Bare-metal datacenters</li>
                <li>Cloud providers</li>
                <li>Community GPU suppliers</li>
                <li>Spheron AI Marketplace (native integration)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Accurate Cost Benchmarking</h3>
              <p className="text-gray-300 mb-3">Compare prices for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>H100 / H200</li>
                <li>A100 / A100 80GB</li>
                <li>B200</li>
                <li>RTX-series GPUs</li>
                <li>Multi-node clusters</li>
                <li>Region-specific supply</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Recommendations</h3>
              <p className="text-gray-300 mb-3">GPUprice identifies:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Cheapest machine available</li>
                <li>Best performance-per-dollar</li>
                <li>Lowest-latency region</li>
                <li>Demand spikes and dips</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Deploy Directly (Optional)</h3>
              <p className="text-gray-300">Deploy through Spheron instantly with the same transparent pricing.</p>
            </div>
          </div>
        </section>

        {/* What Makes GPUprice Different */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">What Makes GPUprice Different</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300 ml-4">
            <li>Transparent by default</li>
            <li>No middleman markups</li>
            <li>Cheapest GPUs available anywhere online</li>
            <li>Real supply, no ghost inventory</li>
            <li>Unified view of global GPU markets</li>
          </ul>
        </section>

        {/* Use Cases */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-800 bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">For AI Teams</h3>
              <p className="text-gray-300">Save budget, deploy faster.</p>
            </div>
            <div className="p-6 border border-gray-800 bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">For Researchers</h3>
              <p className="text-gray-300">Run experiments without massive bills.</p>
            </div>
            <div className="p-6 border border-gray-800 bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">For Startups</h3>
              <p className="text-gray-300">Extend runway and scale cheaply.</p>
            </div>
            <div className="p-6 border border-gray-800 bg-[#111111] rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">For Enterprises</h3>
              <p className="text-gray-300">Use real data to negotiate real contracts.</p>
            </div>
          </div>
        </section>

        {/* Live GPU Price Index */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">Live GPU Price Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.filter(gpu => ['Nvidia H100', 'Nvidia H200', 'Nvidia A100', 'Nvidia B200'].includes(gpu.model))
              .slice(0, 4)
              .map(gpu => (
                <div key={gpu.id} className="p-6 border border-gray-800 bg-[#111111] rounded-lg text-center">
                  <div className="text-sm text-gray-400 mb-2">{gpu.model}</div>
                  <div className="text-2xl font-bold text-green-400 font-mono">${gpu.price.toFixed(2)}/hr</div>
                </div>
              ))}
          </div>
        </section>

        {/* GPUprice Alerts */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">GPUprice Alerts</h2>
          <p className="text-gray-300 mb-4">Get notified when:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Prices drop below your threshold</li>
            <li>New cheap regions appear</li>
            <li>High-demand models restock</li>
            <li>A listing beats your current provider</li>
          </ul>
        </section>

        {/* Built for the Future of Compute */}
        <section className="space-y-6 max-w-4xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-white">Built for the Future of Compute</h2>
          <p className="text-gray-300 mb-4">Upcoming features:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Predictive price modeling</li>
            <li>GPU arbitrage engine</li>
            <li>Automated workload routing</li>
            <li>Intelligent spend analyzer</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-16 pb-8 border-t border-gray-800 mt-16">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-xl font-bold text-white">GPUprice compute without the cloud tax.</p>
            <p className="text-gray-400">Built with transparency, speed, and zero bullshit.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
