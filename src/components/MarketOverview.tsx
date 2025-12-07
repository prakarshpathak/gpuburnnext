import { Card } from "@/components/ui/card";
import { GPU } from "@/types";
import { TrendingUp, FileText, Circle, Clock } from "lucide-react";

interface MarketOverviewProps {
  data: GPU[];
  lastUpdated?: string;
}

export function MarketOverview({ data, lastUpdated }: MarketOverviewProps) {
  const prices = data.map(gpu => gpu.price).filter(p => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

  // Calculate H100 Price
  const h100Prices = data
    .filter(gpu => gpu.model.toLowerCase().includes('h100') && gpu.price > 0)
    .map(gpu => gpu.price);
  const h100Price = h100Prices.length > 0 ? Math.min(...h100Prices) : 0;

  const totalProviders = new Set(data.map(gpu => gpu.provider)).size;

  // Calculate Total GPUs
  const totalGPUs = data.reduce((acc, gpu) => acc + (gpu.gpuCount || 1), 0);

  const format = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 font-pixelify">Market Overview</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Current pricing insights across all providers and asset types</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Data last updated {lastUpdated}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lowest Price */}
        <Card className="p-4 md:p-6 border border-border bg-card gap-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lowest Price</div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-xl md:text-3xl font-bold text-foreground font-mono mb-1">{format(lowestPrice)}</div>
          <div className="text-xs text-muted-foreground">per share starting price</div>
        </Card>

        {/* H100 Price */}
        <Card className="p-4 md:p-6 border border-border bg-card gap-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">H100 Price</div>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl md:text-3xl font-bold text-foreground font-mono mb-1">{format(h100Price)}</div>
          <div className="text-xs text-muted-foreground">lowest price per share</div>
        </Card>

        {/* Total Providers */}
        <Card className="p-4 md:p-6 border border-border bg-card gap-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Providers</div>
            <FileText className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl md:text-3xl font-bold text-foreground font-mono mb-1">{totalProviders}</div>
          <div className="text-xs text-muted-foreground">trading platforms</div>
        </Card>

        {/* Total GPUs */}
        <Card className="p-4 md:p-6 border border-border bg-card gap-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total GPUs</div>
            <Circle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl md:text-3xl font-bold text-foreground font-mono mb-1">{totalGPUs}</div>
          <div className="text-xs text-muted-foreground">available on platform</div>
        </Card>
      </div>
    </div>
  );
}

