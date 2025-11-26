import { Card } from "@/components/ui/card";

export function KPIGrid({ hourly, daily, monthly, vram }: { hourly: number, daily: number, monthly: number, vram: number }) {
  const format = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 border-l-2 border-l-cyan-400 border-y-zinc-800 border-r-zinc-800 bg-zinc-900/50">
        <div className="text-xs text-zinc-400 mb-1">Hourly Rate</div>
        <div className="text-xl font-bold text-white font-mono">{format(hourly)}</div>
      </Card>
      <Card className="p-4 border-l-2 border-l-violet-500 border-y-zinc-800 border-r-zinc-800 bg-zinc-900/50">
        <div className="text-xs text-zinc-400 mb-1">Daily Burn</div>
        <div className="text-xl font-bold text-white font-mono">{format(daily)}</div>
      </Card>
      <Card className="p-4 border-l-2 border-l-pink-500 border-y-zinc-800 border-r-zinc-800 bg-zinc-900/50">
        <div className="text-xs text-zinc-400 mb-1">Monthly Burn</div>
        <div className="text-xl font-bold text-white font-mono">{format(monthly)}</div>
      </Card>
      <Card className="p-4 border-l-2 border-l-emerald-500 border-y-zinc-800 border-r-zinc-800 bg-emerald-900/10">
        <div className="text-xs text-emerald-500 mb-1">VRAM Capacity</div>
        <div className="text-xl font-bold text-white font-mono">{vram} GB</div>
      </Card>
    </div>
  );
}

