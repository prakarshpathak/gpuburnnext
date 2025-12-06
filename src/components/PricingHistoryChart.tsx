"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
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
} from "chart.js";

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

interface PricingHistoryChartProps {
    model: string;
    currentPrice: number;
}

export function PricingHistoryChart({ currentPrice }: PricingHistoryChartProps) {

    const chartData = useMemo(() => {
        // Generate last 7 days labels
        const labels = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString("en-US", { weekday: "short" });
        });

        // Generate stable random values based on currentPrice
        const generateStableData = (multiplier: number, variance: number, count: number) => {
            return Array.from({ length: count }, (_, i) => {
                // Use index as seed for more stable values
                const seed = (currentPrice * multiplier * 1000 + i) % 1;
                return currentPrice * multiplier * (1 + (seed * variance - variance / 2));
            });
        };

        // Mock historical data generation
        // Spheron: relatively stable, low price
        const spheronData = generateStableData(1, 0.05, labels.length);

        // Competitors: significantly higher prices
        const awsData = generateStableData(1.8, 0.1, labels.length);
        const gcpData = generateStableData(1.6, 0.1, labels.length);
        const azureData = generateStableData(1.9, 0.1, labels.length);

        return {
            labels,
            datasets: [
                {
                    label: "Spheron",
                    data: spheronData,
                    borderColor: "#00F0FF", // Cyan
                    backgroundColor: "rgba(0, 240, 255, 0.1)",
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                },
                {
                    label: "AWS",
                    data: awsData,
                    borderColor: "#FF9900", // Orange
                    backgroundColor: "transparent",
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderWidth: 2,
                    borderDash: [5, 5],
                },
                {
                    label: "GCP",
                    data: gcpData,
                    borderColor: "#4285F4", // Blue
                    backgroundColor: "transparent",
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderWidth: 2,
                    borderDash: [5, 5],
                },
                {
                    label: "Azure",
                    data: azureData,
                    borderColor: "#0078D4", // Azure Blue
                    backgroundColor: "transparent",
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderWidth: 2,
                    borderDash: [5, 5],
                },
            ],
        };
    }, [currentPrice]);

    const chartOptions = useMemo(() => {
        const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
        const gridColor = isDark ? "#1e293b" : "#e5e7eb";
        const textColor = isDark ? "#94a3b8" : "#64748b";

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "top" as const,
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { size: 10 },
                    },
                },
                tooltip: {
                    mode: "index" as const,
                    intersect: false,
                    callbacks: {
                        label: (context: { dataset: { label?: string }, parsed: { y: number | null } }) => {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y ?? 0;
                            return `${label}: $${value.toFixed(2)}`;
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
                        font: { size: 10 },
                    },
                },
            },
            interaction: {
                mode: "nearest" as const,
                axis: "x" as const,
                intersect: false,
            },
        };
    }, []);

    return (
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] backdrop-blur">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white font-pixelify">Pricing History (7 Days)</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Spheron vs Major Cloud Providers</p>
            </div>
            <div className="h-[320px] w-full">
                <Line data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
}
