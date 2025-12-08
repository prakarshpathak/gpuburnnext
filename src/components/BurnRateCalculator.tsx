"use client";

import { useState, useMemo, useEffect } from "react";
import { GPU } from "@/types";
import { TARGET_GPU_MODELS } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sliders, Zap, ArrowRight } from "lucide-react";
import { PricingHistoryChart } from "@/components/PricingHistoryChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BurnRateCalculatorProps {
  gpuData: GPU[];
}

export function BurnRateCalculator({ gpuData }: BurnRateCalculatorProps) {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [hours, setHours] = useState<number>(8);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after component mounts
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Get unique models - sorted by TARGET_GPU_MODELS order
  const models = useMemo(() => {
    const availableModels = new Set(
      gpuData.map(d => d.model)
    );
    // Sort by TARGET_GPU_MODELS order instead of alphabetically
    return TARGET_GPU_MODELS.filter(model => availableModels.has(model));
  }, [gpuData]);

  // Get providers for selected model, sorted by price (cheapest first)
  const providers = useMemo(() => {
    if (!selectedModel) return [];
    const modelGpus = gpuData.filter(d => d.model === selectedModel);
    // Sort by price and return unique providers
    return Array.from(new Set(
      modelGpus.sort((a, b) => a.price - b.price).map(d => d.provider)
    ));
  }, [gpuData, selectedModel]);

  // Set initial model and auto-select cheapest provider
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      const timer = setTimeout(() => {
        setSelectedModel(models[0]);
        // Find cheapest provider for the first model
        const modelGpus = gpuData.filter(d => d.model === models[0]);
        if (modelGpus.length > 0) {
          const cheapest = modelGpus.sort((a, b) => a.price - b.price)[0];
          setSelectedProvider(cheapest.provider);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [models, selectedModel, gpuData]);

  // Update provider when model changes to cheapest option
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // Auto-select cheapest provider for new model
    const modelGpus = gpuData.filter(d => d.model === model);
    if (modelGpus.length > 0) {
      const cheapest = modelGpus.sort((a, b) => a.price - b.price)[0];
      setSelectedProvider(cheapest.provider);
    }
  };

  // Calculate metrics
  const activeGpu = useMemo(() => {
    return gpuData.find(g => g.model === selectedModel && g.provider === selectedProvider);
  }, [gpuData, selectedModel, selectedProvider]);

  const hourlyRate = (activeGpu?.price || 0) * quantity;
  const dailyBurn = hourlyRate * hours;
  const monthlyBurn = dailyBurn * 30;
  const totalVram = (activeGpu?.vram || 0) * quantity;

  // Chart data for 30-day projection
  const chartData = useMemo(() => {
    const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    const dataPoints = labels.map((_, i) => dailyBurn * (i + 1));

    // Get all providers for the selected model with their actual prices
    const modelGpus = gpuData.filter(gpu => gpu.model === selectedModel);

    // Get unique providers with their cheapest prices
    const providerPrices = modelGpus.reduce((acc, gpu) => {
      if (!acc[gpu.provider] || gpu.price < acc[gpu.provider]) {
        acc[gpu.provider] = gpu.price;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate daily burns for each provider
    const providerDailyBurns = Object.entries(providerPrices).map(([providerName, price]) => {
      const hourlyRate = price * quantity;
      const dailyBurnValue = hourlyRate * hours;
      return {
        provider: providerName,
        dailyBurn: dailyBurnValue,
        data: labels.map((_, i) => dailyBurnValue * (i + 1))
      };
    });

    // Sort by daily burn (most expensive first) and take top 4 for visibility
    const topProviders = providerDailyBurns
      .sort((a, b) => b.dailyBurn - a.dailyBurn)
      .slice(0, 4);

    // Define provider colors
    const providerColors: Record<string, string> = {
      'AWS': '#FF9900',
      'GCP': '#4285F4',
      'Azure': '#0078D4',
      'Vultr': '#34D399',
      'RunPod': '#A855F7',
      'Spheron': '#F59E0B',
      'Lambda': '#FBBF24',
      'Lambda Labs': '#FBBF24',
      'TensorDock': '#F87171',
      'Vast.ai': '#C084FC',
      'Prime Intellect': '#FACC15',
    };

    // Create datasets for other providers (dashed lines)
    const otherProviderDatasets = topProviders
      .filter(p => p.provider !== selectedProvider)
      .map(p => ({
        label: p.provider,
        data: p.data,
        borderColor: providerColors[p.provider] || '#94A3B8',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      }));

    return {
      labels,
      datasets: [
        ...otherProviderDatasets,
        {
          label: `${selectedProvider || 'Selected'} (Current)`,
          data: dataPoints,
          borderColor: '#00F0FF',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          borderWidth: 3,
        },
      ],
    };
  }, [dailyBurn, selectedProvider, selectedModel, gpuData, quantity, hours]);

  const chartOptions = useMemo(() => {
    const currentTheme = mounted && typeof window !== 'undefined'
      ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
      : 'light';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top" as const, // Align position if needed or keep default
          labels: {
            color: currentTheme === 'dark' ? '#94a3b8' : '#64748b',
            usePointStyle: true,
            boxWidth: 8,
            font: { size: 10 }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: { parsed: { y: number | null } }) => {
              const value = context.parsed.y ?? 0;
              return `$${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        y: {
          grid: { color: currentTheme === 'dark' ? '#1e293b' : '#e5e7eb' },
          ticks: {
            color: currentTheme === 'dark' ? '#64748b' : '#6b7280',
            callback: (value: string | number) => `$${value}`,
            font: { size: 10 }
          },
        },
        x: {
          display: false,
          grid: { color: currentTheme === 'dark' ? '#1e293b' : '#e5e7eb' },
          ticks: {
            color: currentTheme === 'dark' ? '#64748b' : '#6b7280',
            font: { size: 10 }
          },
        },
      },
    };
  }, [mounted]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Popular GPUs for quick launch - dynamically computed from real-time data
  const popularGPUs = useMemo(() => {
    const targetModels = [
      'Nvidia H100 SXM5',
      'Nvidia A100 80GB SXM4',
      'Nvidia RTX 4090'
    ];

    return targetModels
      .map(model => {
        // Find all GPUs matching this model
        const matchingGpus = gpuData.filter(g => g.model === model);
        if (matchingGpus.length === 0) return null;

        // Get the cheapest price for this model
        const sortedByPrice = [...matchingGpus].sort((a, b) => a.price - b.price);
        const cheapest = sortedByPrice[0];

        return {
          model: cheapest.model,
          provider: cheapest.provider,
          price: cheapest.price,
          launchUrl: cheapest.launchUrl || 'https://spheron.network/'
        };
      })
      .filter((gpu): gpu is NonNullable<typeof gpu> => gpu !== null);
  }, [gpuData]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 font-pixelify">Burn Rate Simulator</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Model complex infrastructure scenarios. Adjust variables below to forecast your 30-day capital expenditure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-4 md:p-6 border border-border bg-card backdrop-blur">
            <div className="flex items-center gap-2 mb-6">
              <Sliders className="w-4 h-4 text-[#00F0FF]" />
              <h3 className="text-foreground font-bold font-pixelify">Configuration</h3>
            </div>

            <div className="space-y-5">
              {/* GPU Model */}
              <div>
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  GPU Model
                </Label>
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="w-full bg-background border-input text-foreground">
                    <SelectValue placeholder="Select GPU Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {models.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider */}
              <div>
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Provider
                </Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider} disabled={!selectedModel}>
                  <SelectTrigger className="w-full bg-background border-input text-foreground">
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {providers.map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-border">
                {/* Quantity Slider */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quantity</Label>
                    <span className="text-xs font-mono text-[#00F0FF]">{quantity} GPU{quantity > 1 ? 's' : ''}</span>
                  </div>
                  <Slider
                    value={[quantity]}
                    onValueChange={(vals) => setQuantity(vals[0])}
                    min={1}
                    max={128}
                    step={1}
                    className="[&_[data-slot=slider-range]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:border-[#00F0FF] [&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(0,240,255,0.5)] [&_[data-slot=slider-track]]:bg-muted"
                  />
                </div>

                {/* Hours Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Usage / Day</Label>
                    <span className="text-xs font-mono text-[#00F0FF]">{hours} Hours</span>
                  </div>
                  <Slider
                    value={[hours]}
                    onValueChange={(vals) => setHours(vals[0])}
                    min={1}
                    max={24}
                    step={1}
                    className="[&_[data-slot=slider-range]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:border-[#00F0FF] [&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(0,240,255,0.5)] [&_[data-slot=slider-track]]:bg-muted"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing History Chart */}
          {activeGpu && (
            <PricingHistoryChart
              model={selectedModel}
              provider={selectedProvider}
              gpuData={gpuData}
            />
          )}
        </div>

        {/* Right Column: Visuals - with background */}
        <div
          className="lg:col-span-8 p-6 rounded-xl relative"
          style={{
            backgroundImage: 'url(/cityscape-graphic.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Grayscale overlay */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply rounded-xl pointer-events-none" style={{
            backdropFilter: 'grayscale(100%)',
            WebkitBackdropFilter: 'grayscale(100%)'
          }} />

          <div className="space-y-6 relative" style={{ zIndex: 1 }}>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="p-3 md:p-4 border-l-2 border-l-[#00F0FF] border-y border-r border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Hourly Rate</div>
                <div className="text-lg md:text-xl font-bold text-foreground font-mono">{formatCurrency(hourlyRate)}</div>
              </Card>
              <Card className="p-3 md:p-4 border-l-2 border-l-[#7C3AED] border-y border-r border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Daily Burn</div>
                <div className="text-lg md:text-xl font-bold text-foreground font-mono">{formatCurrency(dailyBurn)}</div>
              </Card>
              <Card className="p-3 md:p-4 border-l-2 border-l-[#EC4899] border-y border-r border-border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Monthly Burn</div>
                <div className="text-lg md:text-xl font-bold text-foreground font-mono">{formatCurrency(monthlyBurn)}</div>
              </Card>
              <Card className="p-3 md:p-4 border-l-2 border-l-[#10B981] border-y border-r border-border bg-card">
                <div className="text-xs text-[#10B981] mb-1">VRAM Capacity</div>
                <div className="text-lg md:text-xl font-bold text-foreground font-mono">{totalVram} GB</div>
              </Card>
            </div>

            {/* Quick Launch Panel */}
            <Card className="p-4 md:p-6 border border-border bg-card gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-foreground font-bold font-pixelify">Quick Launch</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Popular GPUs at best available prices</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {popularGPUs.map((gpu, idx) => {
                  const colors = [
                    { bg: 'bg-[#00F0FF]/10', border: 'border-[#00F0FF]/30', text: 'text-[#00F0FF]' },
                    { bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/30', text: 'text-[#7C3AED]' },
                    { bg: 'bg-[#EC4899]/10', border: 'border-[#EC4899]/30', text: 'text-[#EC4899]' },
                  ];
                  const color = colors[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => window.open(gpu.launchUrl, '_blank')}
                      className={`${color.bg} hover:${color.bg.replace('/10', '/20')} ${color.border} border rounded-lg p-4 text-left transition-all group`}
                    >
                      <div className={`text-xs ${color.text} font-medium mb-1`}>{gpu.model}</div>
                      <div className="text-lg font-bold text-foreground">${gpu.price.toFixed(2)}/hr</div>
                      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        Launch on {gpu.provider} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* 30-Day Cost Projection Chart */}
            <Card className="p-4 md:p-6 border border-border bg-card h-[300px] md:h-[400px]">
              <h3 className="text-sm font-bold text-muted-foreground mb-4 font-pixelify">30-Day Cost Projection</h3>
              <div className="h-[calc(100%-3rem)]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
