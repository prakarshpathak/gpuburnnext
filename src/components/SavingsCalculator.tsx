"use client";

import { useState, useMemo } from "react";
import { GPU } from "@/types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
    "Massive Scale Training (Foundational)": { model: "Nvidia H100 SXM5", reason: "H100 SXM5 delivers maximized memory bandwidth (3TB/s HBM3) and NVLink interconnects essential for distributed training of foundational models exceeding 100B parameters. The FP8 tensor cores provide 3x faster training compared to A100, significantly reducing time-to-model for large-scale pre-training workloads." },
    "LLM Training (Large)": { model: "Nvidia H100 SXM5", reason: "For training 70B+ parameter LLMs, H100's 80GB HBM3 memory and 1,979 TFLOPS FP8 performance are critical. The advanced tensor cores accelerate transformer attention mechanisms by 3x versus A100, while NVLink enables efficient multi-GPU scaling for models that exceed single-GPU capacity." },
    "LLM Fine-tuning": { model: "Nvidia A100 80GB SXM4", reason: "A100 80GB provides the optimal balance of 80GB VRAM capacity and cost efficiency for fine-tuning workflows using LoRA or QLoRA techniques. It handles 30-70B parameter models comfortably while costing 40-60% less per hour than H100, making it ideal for iterative fine-tuning experiments where raw speed is less critical than cost." },
    "Inference (Production)": { model: "Nvidia L40", reason: "L40 is purpose-built for production inference serving, offering excellent throughput-per-dollar with 48GB VRAM. Its inference-optimized architecture handles batch processing efficiently while providing enough memory for large context windows. Lower power consumption also reduces operational costs in high-utilization production environments." },
    "GenAI Image Generation (SDXL)": { model: "Nvidia RTX 4090", reason: "RTX 4090 delivers unmatched price/performance for Stable Diffusion XL and similar image generation models. With 24GB VRAM, it handles SDXL at high resolutions while costing 70-80% less than data center GPUs. The Ada Lovelace architecture provides excellent FP16 performance for diffusion model inference and fine-tuning." },
    "Video Transcoding & Streaming": { model: "Nvidia L40", reason: "L40 features dedicated 8th-gen NVENC/NVDEC hardware engines that deliver superior video transcoding density and quality. It can handle 4K video encoding at 240 FPS while simultaneously running AI workloads. The 48GB VRAM enables processing multiple high-resolution video streams concurrently, ideal for live streaming." },
    "3D Rendering": { model: "Nvidia RTX 4090", reason: "For GPU rendering with Blender, Octane, or V-Ray, RTX 4090 provides the best balance of ray tracing performance and VRAM capacity at consumer pricing. Its 24GB memory handles complex scenes while the RT cores deliver 2-3x faster rendering than previous generation. At $0.30-0.80/hr, it's far more economical than professional GPUs for rendering workloads." },
    "Scientific Simulations (FP64)": { model: "Nvidia A100 80GB SXM4", reason: "A100 delivers essential double-precision (FP64) compute performance that's critical for high-accuracy scientific simulations in physics, chemistry, and computational fluid dynamics. With 9.7 TFLOPS FP64 and 80GB HBM2e memory, it handles large-scale molecular dynamics and climate modeling." },
    "Personal Research": { model: "Nvidia RTX 4090", reason: "RTX 4090 offers the most cost-effective entry point for AI research and experimentation. At $0.30-0.80/hr, it's 75% cheaper than data center GPUs while providing 24GB VRAM—sufficient for fine-tuning 13B models, or prototyping new architectures. Perfect for graduate students, independent researchers, and early-stage startups." },
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
            launchUrl: cheapestGpu.launchUrl,
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
                            <>
                                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 md:p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-foreground text-base md:text-lg mb-1 font-pixelify">
                                                Recommended: {recommendation.model}
                                            </h4>
                                            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                                {recommendation.reason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => window.open(recommendation.launchUrl, '_blank')}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                >
                                    Rent now on {recommendation.cheapestProvider}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Results Section */}
                    {recommendation && (
                        <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="p-3 md:p-4 rounded-xl bg-muted/50 border border-border">
                                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Market Average</div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-muted-foreground">
                                        <span className="line-through decoration-red-500/50">{formatCurrency(recommendation.avgPrice)}</span>
                                        <span className="text-xs md:text-sm font-sans">/hr</span>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                                    <div className="text-xs md:text-sm text-primary mb-1">Best Price ({recommendation.cheapestProvider})</div>
                                    <div className="text-xl md:text-2xl font-mono font-bold text-primary">
                                        {formatCurrency(recommendation.cheapestPrice)}<span className="text-xs md:text-sm text-primary/70 font-sans">/hr</span>
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
                                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                            </div>

                            {recommendation.providerCount > 1 && (
                                <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 p-3 rounded-lg border border-primary/30">
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
