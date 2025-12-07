"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
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
    currentPrice: number;
    provider?: string;
}

export function PricingHistoryChart({ currentPrice, provider }: PricingHistoryChartProps) {

    const chartData = useMemo(() => {
        // Provider names for x-axis - use selected provider instead of hardcoded Spheron
        const selectedProvider = provider || "Selected";
        const labels = [selectedProvider, "AWS", "GCP", "Azure"];

        // Calculate approximate prices based on market multipliers
        // Selected provider: actual current price (competitive pricing)
        // AWS: ~4.2x higher, Azure: ~3.9x higher, GCP: ~3.6x higher
        const selectedPrice = currentPrice;
        const awsPrice = currentPrice * 4.2;
        const gcpPrice = currentPrice * 3.6;
        const azurePrice = currentPrice * 3.9;

        return {
            labels,
            datasets: [
                {
                    label: "Price per Hour",
                    data: [selectedPrice, awsPrice, gcpPrice, azurePrice],
                    backgroundColor: [
                        "rgba(0, 240, 255, 0.8)", // Selected provider - Cyan
                        "rgba(255, 153, 0, 0.8)", // AWS - Orange
                        "rgba(66, 133, 244, 0.8)", // GCP - Blue
                        "rgba(0, 120, 212, 0.8)", // Azure - Azure Blue
                    ],
                    borderColor: [
                        "#00F0FF", // Selected provider
                        "#FF9900", // AWS
                        "#4285F4", // GCP
                        "#0078D4", // Azure
                    ],
                    borderWidth: 2,
                },
            ],
        };
    }, [currentPrice, provider]);

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
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] backdrop-blur">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-pixelify">Price Comparison</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{provider || 'Selected'} vs Major Cloud Providers</p>
            </div>
            <div className="h-[320px] w-full">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
}
