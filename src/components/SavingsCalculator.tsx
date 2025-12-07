"use client";

import { useState, useMemo } from "react";
import { GPU } from "@/types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, TrendingDown } from "lucide-react";
import Image from "next/image";

interface SavingsCalculatorProps {
    gpuData: GPU[];
}

type UseCase =
    | "Massive Scale Training (Foundational)"
    | "LLM Training (Large)"
    | "LLM Fine-tuning"
    | "Inference (Production)"
    | "GenAI Image Generation (SDXL)"
    | "Video Transcoding & Streaming"
    | "3D Rendering"
    | "Scientific Simulations (FP64)"
    | "Personal Research";

const USE_CASE_MAPPING: Record<UseCase, { model: string; reason: string }> = {
    "Massive Scale Training (Foundational)": { model: "Nvidia H100 SXM5", reason: "Maximized memory bandwidth and interconnects for foundational model training." },
    "LLM Training (Large)": { model: "Nvidia H100 SXM5", reason: "Massive compute and FP8 precision required for 70B+ parameter models." },
    "LLM Fine-tuning": { model: "Nvidia A100 80GB SXM4", reason: "Excellent balance of VRAM (80GB) and performance for LoRA/QLoRA." },
    "Inference (Production)": { model: "Nvidia L40", reason: "High throughput inference with decent VRAM, optimized for serving." },
    "GenAI Image Generation (SDXL)": { model: "Nvidia RTX 4090", reason: "Unbeatable price/performance for image generation and diffusion models." },
    "Video Transcoding & Streaming": { model: "Nvidia L40", reason: "Dedicated NVENC/NVDEC engines for superior media processing density." },
    "3D Rendering": { model: "Nvidia RTX 4090", reason: "Best price/performance for ray tracing and rendering workloads." },
    "Scientific Simulations (FP64)": { model: "Nvidia A100 80GB SXM4", reason: "Essential double-precision (FP64) performance for physics and simulations." },
    "Personal Research": { model: "Nvidia RTX 4090", reason: "Cost-effective for experimentation and small-scale model testing." },
};

export function SavingsCalculator({ gpuData }: SavingsCalculatorProps) {
    const [selectedUseCase, setSelectedUseCase] = useState<UseCase>("LLM Training (Large)");

    const recommendation = useMemo(() => {
        const { model, reason } = USE_CASE_MAPPING[selectedUseCase];

        // Find all GPUs matching this model - EXACT match only to avoid grouping variants
        const matchingGpus = gpuData.filter(g => g.model === model);

        // No fallback matching - variants (SXM4, PCIE, SXM5) should not be grouped together
        // as they have different performance/cost characteristics
        if (matchingGpus.length === 0) return null;

        // Sort by price to find cheapest and calculate average
        const sortedByPrice = [...matchingGpus].sort((a, b) => a.price - b.price);
        const cheapestGpu = sortedByPrice[0];
        const avgPrice = matchingGpus.reduce((acc, curr) => acc + curr.price, 0) / matchingGpus.length;

        // Calculate savings (cheapest vs average)
        const savingsHourly = Math.max(0, avgPrice - cheapestGpu.price);
        const savingsMonthly = savingsHourly * 24 * 30;
        const percentSaved = avgPrice > 0 ? (savingsHourly / avgPrice) * 100 : 0;

        return {
            model: cheapestGpu.model, // Use actual model name from data
            reason,
            cheapestPrice: cheapestGpu.price,
            cheapestProvider: cheapestGpu.provider,
            avgPrice,
            savingsHourly,
            savingsMonthly,
            percentSaved,
            providerCount: matchingGpus.length
        };
    }, [selectedUseCase, gpuData]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 font-pixelify">Smart Savings Engine</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                    Tell us what you&apos;re building. We&apos;ll recommend the hardware and show you the best deals across all providers.
                </p>
            </div>

            <Card className="p-6 md:p-8 border border-border bg-card overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <Image
                    src="/gpu-graphic.png"
                    alt=""
                    width={500}
                    height={500}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-10 grayscale pointer-events-none select-none mix-blend-multiply dark:mix-blend-screen"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div>
                            <Label className="text-sm font-bold text-foreground mb-2 block">
                                What is your primary use case?
                            </Label>
                            <Select value={selectedUseCase} onValueChange={(v) => setSelectedUseCase(v as UseCase)}>
                                <SelectTrigger className="w-full h-12 text-base md:text-lg bg-background border-input">
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
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 md:p-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-100 text-base md:text-lg mb-1 font-pixelify">
                                            Recommended: {recommendation.model}
                                        </h4>
                                        <p className="text-blue-700 dark:text-blue-300 text-xs md:text-sm leading-relaxed">
                                            {recommendation.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {recommendation && (
                        <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="p-3 md:p-4 rounded-xl bg-muted/50 border border-border">
                                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Market Average</div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-muted-foreground line-through decoration-red-500/50">
                                        {formatCurrency(recommendation.avgPrice)}<span className="text-xs md:text-sm font-sans">/hr</span>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                                    <div className="text-xs md:text-sm text-green-600 dark:text-green-400 mb-1">Best Price ({recommendation.cheapestProvider})</div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(recommendation.cheapestPrice)}<span className="text-xs md:text-sm text-green-600/70 font-sans">/hr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-xl">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 opacity-90">
                                        <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="text-sm md:text-base font-medium">Potential Monthly Savings</span>
                                    </div>
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                                        {formatCurrency(recommendation.savingsMonthly)}
                                    </div>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background/20 backdrop-blur-sm">
                                        Save {recommendation.percentSaved.toFixed(0)}% vs market average
                                    </div>
                                </div>
                                {/* Abstract shapes */}
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-background/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                            </div>

                            {recommendation.providerCount > 1 && (
                                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-900/30">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>Compared across {recommendation.providerCount} providers to find you the best deal</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
