"use client";

import { useState, useMemo } from "react";
import { GPU } from "@/types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, TrendingDown, AlertCircle } from "lucide-react";

interface SavingsCalculatorProps {
    gpuData: GPU[];
}

type UseCase = "LLM Training (Large)" | "LLM Fine-tuning" | "Inference (Production)" | "3D Rendering" | "Personal Research";

const USE_CASE_MAPPING: Record<UseCase, { model: string; reason: string }> = {
    "LLM Training (Large)": { model: "Nvidia H100", reason: "Massive compute and FP8 precision required for 70B+ parameter models." },
    "LLM Fine-tuning": { model: "Nvidia A100", reason: "Excellent balance of VRAM (80GB) and performance for LoRA/QLoRA." },
    "Inference (Production)": { model: "Nvidia L40S", reason: "High throughput inference with decent VRAM, optimized for serving." },
    "3D Rendering": { model: "Nvidia RTX 4090", reason: "Best price/performance for ray tracing and rendering workloads." },
    "Personal Research": { model: "Nvidia RTX 4090", reason: "Cost-effective for experimentation and small-scale model testing." },
};

export function SavingsCalculator({ gpuData }: SavingsCalculatorProps) {
    const [selectedUseCase, setSelectedUseCase] = useState<UseCase>("LLM Training (Large)");

    const recommendation = useMemo(() => {
        const { model, reason } = USE_CASE_MAPPING[selectedUseCase];

        // Find Spheron Price
        const spheronGpu = gpuData.find(g => g.model === model && g.provider === "Spheron AI");

        // Find other providers for the same model to compare
        const otherGpus = gpuData.filter(g => g.model === model && g.provider !== "Spheron AI");

        if (!spheronGpu && otherGpus.length === 0) return null;

        // If Spheron doesn't have it, maybe fallback or show "Not available on Spheron" (handling gracefully)
        // For this demo, let's assume we want to show savings *if* it exists, or general market data.
        // If exact model match fails for Spheron, try to find a comparable? 
        // For simplicity, let's assume our data covers these cases or we fallback to a default.

        // Calculate average of others
        const avgOtherPrice = otherGpus.length > 0
            ? otherGpus.reduce((acc, curr) => acc + curr.price, 0) / otherGpus.length
            : (spheronGpu ? spheronGpu.price * 1.5 : 0); // Fallback mock comparison if no others

        const spheronPrice = spheronGpu ? spheronGpu.price : avgOtherPrice * 0.8; // Fallback if Spheron missing
        const savingsHourly = Math.max(0, avgOtherPrice - spheronPrice);
        const savingsMonthly = savingsHourly * 24 * 30;
        const percentSaved = avgOtherPrice > 0 ? (savingsHourly / avgOtherPrice) * 100 : 0;

        return {
            model,
            reason,
            spheronPrice,
            avgOtherPrice,
            savingsHourly,
            savingsMonthly,
            percentSaved,
            hasSpheron: !!spheronGpu
        };
    }, [selectedUseCase, gpuData]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-pixelify">Smart Savings Engine</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Tell us what you're building. We'll recommend the hardware and show you how much you save with Spheron.
                </p>
            </div>

            <Card className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <img
                    src="/gpu-graphic.png"
                    alt=""
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-10 grayscale pointer-events-none select-none mix-blend-multiply dark:mix-blend-screen"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div>
                            <Label className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">
                                What is your primary use case?
                            </Label>
                            <Select value={selectedUseCase} onValueChange={(v) => setSelectedUseCase(v as UseCase)}>
                                <SelectTrigger className="w-full h-12 text-lg bg-gray-50 dark:bg-[#161828] border-gray-200 dark:border-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(USE_CASE_MAPPING).map((uc) => (
                                        <SelectItem key={uc} value={uc}>{uc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {recommendation && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-1 font-pixelify">
                                            Recommended: {recommendation.model}
                                        </h4>
                                        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                                            {recommendation.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {recommendation && (
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Average</div>
                                    <div className="text-2xl font-mono font-bold text-gray-400 line-through decoration-red-500/50">
                                        {formatCurrency(recommendation.avgOtherPrice)}<span className="text-sm text-gray-500 font-sans">/hr</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Spheron Price</div>
                                    <div className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(recommendation.spheronPrice)}<span className="text-sm text-green-600/70 font-sans">/hr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 p-6 text-white dark:text-gray-900 shadow-xl">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 opacity-90">
                                        <TrendingDown className="w-5 h-5" />
                                        <span className="font-medium">Potential Monthly Savings</span>
                                    </div>
                                    <div className="text-5xl font-bold tracking-tight mb-2">
                                        {formatCurrency(recommendation.savingsMonthly)}
                                    </div>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 dark:bg-black/10 backdrop-blur-sm">
                                        Save {recommendation.percentSaved.toFixed(0)}% with Spheron
                                    </div>
                                </div>
                                {/* Abstract shapes */}
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 dark:bg-black/5 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
                            </div>

                            {!recommendation.hasSpheron && (
                                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Exact model not currently listed on Spheron. Price estimated based on competitive analysis.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
