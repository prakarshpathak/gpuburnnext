"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { gpuData } from "@/lib/data";
import { getProviderBySlug } from "@/lib/providers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, TrendingUp, Cpu, DollarSign, BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProviderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const provider = useMemo(() => getProviderBySlug(slug), [slug]);
  const providerGPUs = useMemo(() =>
    gpuData.filter(gpu => gpu.provider === provider?.name).sort((a, b) => a.price - b.price),
    [provider]
  );

  if (!provider) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] p-6 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Provider Not Found</h1>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] p-6 md:p-12 transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <ThemeToggle />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{provider.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{provider.description}</p>
            </div>
            {provider.referralUrl && (
              <Button onClick={() => window.open(provider.referralUrl, '_blank')} className="bg-green-600 hover:bg-green-700 text-white">
                Visit Website <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          {provider.signupCredit && (
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              Signup Credit: {provider.signupCredit}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total GPUs</div>
              <Cpu className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono">{stats.totalGPUs}</div>
            <div className="text-xs text-gray-500">configurations</div>
          </Card>
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Cheapest Price</div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold font-mono">{formatCurrency(stats.cheapestPrice)}</div>
            <div className="text-xs text-gray-500">per hour</div>
          </Card>
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Average Price</div>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono">{formatCurrency(stats.averagePrice)}</div>
            <div className="text-xs text-gray-500">per hour</div>
          </Card>
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">GPU Types</div>
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold font-mono">{stats.gpuTypes}</div>
            <div className="text-xs text-gray-500">unique models</div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available GPUs</h2>
          <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                  <TableHead>GPU Model</TableHead>
                  <TableHead>GPU Count</TableHead>
                  <TableHead>VRAM</TableHead>
                  <TableHead>System Specs</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price / Hour</TableHead>
                  <TableHead className="text-right">Status</TableHead>
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
                      <TableCell>{gpuCount}</TableCell>
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
                        <Badge variant="secondary" className={
                          gpu.type === 'High-End'
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                            : gpu.type === 'Mid-Range'
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        }>
                          {gpu.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                        {formatCurrency(totalPrice)} /hr
                      </TableCell>
                      <TableCell className="text-right">
                        {gpu.availability === 'Unavailable' ? (
                          <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-700">Unavailable</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {gpu.launchUrl && gpu.availability !== 'Unavailable' && (
                          <Button variant="outline" size="sm" onClick={() => window.open(gpu.launchUrl, '_blank')}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white border-green-600">
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
