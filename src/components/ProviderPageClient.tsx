"use client";

import { useMemo } from "react";
import { Provider } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Cpu, DollarSign, BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navbar } from "@/components/Navbar";
import { useGPUPrices } from "@/hooks/useGPUPrices";

interface ProviderPageClientProps {
  provider: Provider;
}

export default function ProviderPageClient({ provider }: ProviderPageClientProps) {
  const { data: allGPUs } = useGPUPrices();

  // Filter and sort GPUs for this provider from live data
  const providerGPUs = useMemo(() =>
    allGPUs.filter(gpu => gpu.provider === provider.name).sort((a, b) => a.price - b.price),
    [allGPUs, provider.name]
  );

  const stats = {
    totalGPUs: providerGPUs.length,
    cheapestPrice: providerGPUs.length > 0 ? Math.min(...providerGPUs.map(g => g.price)) : 0,
    averagePrice: providerGPUs.length > 0
      ? providerGPUs.reduce((sum, g) => sum + g.price, 0) / providerGPUs.length
      : 0,
    gpuTypes: new Set(providerGPUs.map(g => g.model)).size,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <Navbar />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2 font-pixelify">{provider.name}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">{provider.description}</p>
            </div>
            {provider.referralUrl && (
              <Button onClick={() => window.open(provider.referralUrl, '_blank')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Visit Website <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          {provider.signupCredit && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Signup Credit: {provider.signupCredit}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border border-border gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">Total GPUs</div>
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">{stats.totalGPUs}</div>
            <div className="text-xs text-muted-foreground">configurations</div>
          </Card>
          <Card className="p-6 border border-border gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">Cheapest Price</div>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">{formatCurrency(stats.cheapestPrice)}</div>
            <div className="text-xs text-muted-foreground">per hour</div>
          </Card>
          <Card className="p-6 border border-border gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">Average Price</div>
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">{formatCurrency(stats.averagePrice)}</div>
            <div className="text-xs text-muted-foreground">per hour</div>
          </Card>
          <Card className="p-6 border border-border gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">GPU Types</div>
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">{stats.gpuTypes}</div>
            <div className="text-xs text-muted-foreground">unique models</div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available GPUs</h2>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-accent/50">
                  <TableHead>GPU Model</TableHead>
                  <TableHead>VRAM</TableHead>
                  <TableHead>System Specs</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price / Hour</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerGPUs.map((gpu) => {
                  const gpuCount = gpu.gpuCount || 1;
                  const totalVram = gpu.vram * gpuCount;
                  const totalPrice = gpu.price * gpuCount;

                  return (
                    <TableRow key={gpu.id}>
                      <TableCell className="font-medium">{gpu.model}</TableCell>
                      <TableCell>{totalVram} GB</TableCell>
                      <TableCell>
                        {gpu.systemSpecs ? (
                          <div className="text-xs">
                            <div>{gpu.systemSpecs.vCPU}vCPU</div>
                            <div>{gpu.systemSpecs.ram}GB RAM</div>
                          </div>
                        ) : <span>-</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {gpu.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-primary">
                        {formatCurrency(totalPrice)} /hr
                      </TableCell>
                      <TableCell className="text-center">
                        {gpu.availability === 'Unavailable' ? (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">Unavailable</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {gpu.launchUrl && gpu.availability !== 'Unavailable' && (
                          <Button variant="outline" size="sm" onClick={() => window.open(gpu.launchUrl, '_blank')}
                            className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground border-primary">
                            Launch <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
