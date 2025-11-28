import { Card } from "@/components/ui/card";
import { GPU } from "@/lib/types";
import { TrendingUp, FileText, Circle, Clock } from "lucide-react";

interface MarketOverviewProps {
  data: GPU[];
  lastUpdated?: string;
}

export function MarketOverview({ data, lastUpdated }: MarketOverviewProps) {
  const prices = data.map(gpu => gpu.price).filter(p => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const totalProviders = new Set(data.map(gpu => gpu.provider)).size;
  const assetOptions = data.length;

  const format = (n: number) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Market Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current pricing insights across all providers and asset types</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Data last updated {lastUpdated}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lowest Price */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Lowest Price</div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-1">{format(lowestPrice)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">per share starting price</div>
        </Card>

        {/* Average Price */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Average Price</div>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-1">{format(averagePrice)}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">per share across all assets</div>
        </Card>

        {/* Total Providers */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Providers</div>
            <FileText className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-1">{totalProviders}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">trading platforms</div>
        </Card>

        {/* Asset Options */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Asset Options</div>
            <Circle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono mb-1">{assetOptions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">configurations</div>
        </Card>
      </div>
    </div>
  );
}

