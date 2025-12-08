"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { GPU } from "@/types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface PricingHistoryChartProps {
    model: string;
    provider?: string;
    gpuData: GPU[];
}

export function PricingHistoryChart({ model, provider, gpuData }: PricingHistoryChartProps) {

    const chartData = useMemo(() => {
        // Get all providers for this GPU model with their actual prices
        const modelGpus = gpuData.filter(gpu => gpu.model === model);

        // Sort by price (cheapest first) and get unique providers
        const providerPrices = modelGpus
            .reduce((acc, gpu) => {
                // Keep only the cheapest price for each provider
                if (!acc[gpu.provider] || gpu.price < acc[gpu.provider]) {
                    acc[gpu.provider] = gpu.price;
                }
                return acc;
            }, {} as Record<string, number>);

        // Convert to array and sort by price
        const sortedProviders = Object.entries(providerPrices)
            .sort((a, b) => a[1] - b[1]);

        const labels = sortedProviders.map(([providerName]) => providerName);
        const prices = sortedProviders.map((entry) => entry[1]);

        // Define colors for different providers
        const providerColors: Record<string, { bg: string, border: string }> = {
            'AWS': { bg: 'rgba(255, 153, 0, 0.8)', border: '#FF9900' },
            'GCP': { bg: 'rgba(66, 133, 244, 0.8)', border: '#4285F4' },
            'Azure': { bg: 'rgba(0, 120, 212, 0.8)', border: '#0078D4' },
            'Vultr': { bg: 'rgba(52, 211, 153, 0.8)', border: '#34D399' },
            'RunPod': { bg: 'rgba(168, 85, 247, 0.8)', border: '#A855F7' },
            'Spheron': { bg: 'rgba(0, 240, 255, 0.8)', border: '#00F0FF' },
            'Lambda Labs': { bg: 'rgba(251, 191, 36, 0.8)', border: '#FBBF24' },
            'TensorDock': { bg: 'rgba(248, 113, 113, 0.8)', border: '#F87171' },
            'Vast.ai': { bg: 'rgba(192, 132, 252, 0.8)', border: '#C084FC' },
            'Prime Intellect': { bg: 'rgba(250, 204, 21, 0.8)', border: '#FACC15' },
        };

        // Highlight the currently selected provider
        const backgroundColor = labels.map(label => {
            if (label === provider) {
                return 'rgba(0, 240, 255, 0.9)'; // Bright cyan for selected
            }
            return providerColors[label]?.bg || 'rgba(148, 163, 184, 0.8)';
        });

        const borderColor = labels.map(label => {
            if (label === provider) {
                return '#00F0FF';
            }
            return providerColors[label]?.border || '#94A3B8';
        });

        return {
            labels,
            datasets: [
                {
                    label: "Price per Hour",
                    data: prices,
                    backgroundColor,
                    borderColor,
                    borderWidth: 2,
                },
            ],
        };
    }, [model, gpuData, provider]);

    const chartOptions = useMemo(() => {
        const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
        const gridColor = isDark ? "#1e293b" : "#e5e7eb";
        const textColor = isDark ? "#94a3b8" : "#64748b";

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false, // Hide legend for bar chart since x-axis labels show providers
                },
                tooltip: {
                    callbacks: {
                        label: (context: { parsed: { y: number | null } }) => {
                            const value = context.parsed.y ?? 0;
                            return `$${value.toFixed(2)}/hour`;
                        },
                    },
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    titleColor: isDark ? "#f8fafc" : "#0f172a",
                    bodyColor: isDark ? "#cbd5e1" : "#334155",
                    borderColor: gridColor,
                    borderWidth: 1,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        callback: (value: string | number) => `$${Number(value).toFixed(2)}`,
                        font: { size: 10 },
                    },
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: textColor,
                        font: { size: 11, weight: "bold" as const },
                    },
                },
            },
        };
    }, []);

    return (
        <Card className="p-6 border border-border bg-card backdrop-blur">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-foreground font-pixelify">Price Comparison</h3>
                <p className="text-xs text-muted-foreground">All Available Providers for {model}</p>
            </div>
            <div className="h-[296px] w-full bg-card price-comparison-chart">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
}
