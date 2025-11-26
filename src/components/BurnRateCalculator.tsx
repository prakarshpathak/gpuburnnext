"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { GPU } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sliders, Zap, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
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
  const { theme } = useTheme();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [hours, setHours] = useState<number>(8);

  // Get unique models and providers
  const models = useMemo(() => {
    return Array.from(new Set(gpuData.map(d => d.model))).sort();
  }, [gpuData]);

  const providers = useMemo(() => {
    if (!selectedModel) return [];
    return Array.from(new Set(
      gpuData.filter(d => d.model === selectedModel).map(d => d.provider)
    )).sort();
  }, [gpuData, selectedModel]);

  // Set initial values
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      setSelectedProvider(providers[0]);
    }
  }, [providers, selectedProvider]);

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

    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Cost',
          data: dataPoints,
          borderColor: '#00F0FF',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [dailyBurn]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: { color: theme === 'dark' ? '#1e293b' : '#e5e7eb' },
        ticks: {
          color: theme === 'dark' ? '#64748b' : '#6b7280',
          callback: (value: any) => `$${value}`,
        },
      },
      x: {
        display: false,
        grid: { color: theme === 'dark' ? '#1e293b' : '#e5e7eb' },
        ticks: { color: theme === 'dark' ? '#64748b' : '#6b7280' },
      },
    },
  }), [theme]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Popular GPUs for quick launch
  const popularGPUs = [
    { model: 'Nvidia H100', provider: 'Spheron AI', price: 1.99 },
    { model: 'Nvidia A100', provider: 'Spheron AI', price: 1.50 },
    { model: 'Nvidia RTX 4090', provider: 'RunPod', price: 0.34 },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Burn Rate Simulator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Model complex infrastructure scenarios. Adjust variables below to forecast your 30-day capital expenditure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] backdrop-blur">
            <div className="flex items-center gap-2 mb-6">
              <Sliders className="w-4 h-4 text-[#00F0FF]" />
              <h3 className="text-gray-900 dark:text-white font-bold">Configuration</h3>
            </div>

            <div className="space-y-5">
              {/* GPU Model */}
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-wider mb-1.5 block">
                  GPU Model
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full bg-white dark:bg-[#161828] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select GPU Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#161828] border-gray-300 dark:border-gray-700">
                    {models.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider */}
              <div>
                <Label className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Provider
                </Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider} disabled={!selectedModel}>
                  <SelectTrigger className="w-full bg-white dark:bg-[#161828] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#161828] border-gray-300 dark:border-gray-700">
                    {providers.map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/5">
                {/* Quantity Slider */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <Label className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-wider">Quantity</Label>
                    <span className="text-xs font-mono text-[#00F0FF]">{quantity} Node{quantity > 1 ? 's' : ''}</span>
                  </div>
                  <Slider
                    value={[quantity]}
                    onValueChange={(vals) => setQuantity(vals[0])}
                    min={1}
                    max={128}
                    step={1}
                    className="[&_[data-slot=slider-range]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:border-[#00F0FF] [&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(0,240,255,0.5)] [&_[data-slot=slider-track]]:bg-gray-200 dark:[&_[data-slot=slider-track]]:bg-[#1e293b]"
                  />
                </div>

                {/* Hours Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-wider">Usage / Day</Label>
                    <span className="text-xs font-mono text-[#00F0FF]">{hours} Hours</span>
                  </div>
                  <Slider
                    value={[hours]}
                    onValueChange={(vals) => setHours(vals[0])}
                    min={1}
                    max={24}
                    step={1}
                    className="[&_[data-slot=slider-range]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:bg-[#00F0FF] [&_[data-slot=slider-thumb]]:border-[#00F0FF] [&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(0,240,255,0.5)] [&_[data-slot=slider-track]]:bg-gray-200 dark:[&_[data-slot=slider-track]]:bg-[#1e293b]"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Visuals */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-2 border-l-[#00F0FF] border-y border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hourly Rate</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">{formatCurrency(hourlyRate)}</div>
            </Card>
            <Card className="p-4 border-l-2 border-l-[#7C3AED] border-y border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Daily Burn</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">{formatCurrency(dailyBurn)}</div>
            </Card>
            <Card className="p-4 border-l-2 border-l-[#EC4899] border-y border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Monthly Burn</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">{formatCurrency(monthlyBurn)}</div>
            </Card>
            <Card className="p-4 border-l-2 border-l-[#10B981] border-y border-r border-gray-200 dark:border-gray-800 bg-[#10B981]/10 dark:bg-[#10B981]/10">
              <div className="text-xs text-[#10B981] mb-1">VRAM Capacity</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">{totalVram} GB</div>
            </Card>
          </div>

          {/* Quick Launch Panel */}
          <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#00F0FF]" />
              <h3 className="text-gray-900 dark:text-white font-bold">Quick Launch</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Popular GPUs ready to deploy on Spheron</p>
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
                    onClick={() => window.open('https://spheron.ai', '_blank')}
                    className={`${color.bg} hover:${color.bg.replace('/10', '/20')} ${color.border} border rounded-lg p-4 text-left transition-all group`}
                  >
                    <div className={`text-xs ${color.text} font-medium mb-1`}>{gpu.model}</div>
                    <div className="text-lg font-bold text-white">${gpu.price.toFixed(2)}/hr</div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      Launch <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 30-Day Cost Projection Chart */}
          <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] h-[400px]">
            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">30-Day Cost Projection</h3>
            <div className="h-[calc(100%-3rem)]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
