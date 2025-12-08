"use client";

import { Card } from "@/components/ui/card";
import { Cpu, TrendingDown, Zap, Shield, Code, BarChart3 } from "lucide-react";

export function SEOContent() {
  return (
    <div className="space-y-16 md:space-y-20">
      {/* What is cheapestGPU */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Real-Time GPU Price Intelligence for Enterprises
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          cheapestGPU is the industry&apos;s most comprehensive GPU cloud pricing aggregator, designed for CTOs, ML engineers, and startup founders who need to optimize their AI infrastructure costs. We track real-time pricing across 15+ providers including AWS, GCP, Azure, RunPod, Vast.ai, Spheron, Lambda Labs, and more—helping you reduce compute expenses by up to 80% without compromising on performance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 border border-border">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Real-Time Data</h3>
            <p className="text-sm text-muted-foreground">
              Live pricing updates from 15+ cloud GPU providers, refreshed every few minutes for accurate cost comparisons.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Cost Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Find the most cost-effective GPU options for your specific workload, from LLM training to inference.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Comparison</h3>
            <p className="text-sm text-muted-foreground">
              Compare H100, A100, RTX 4090, and 70+ GPU configurations side-by-side in a single dashboard.
            </p>
          </Card>
        </div>
      </section>

      {/* Why Rent Cloud GPUs */}
      <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Why Cloud GPUs for Enterprise AI Infrastructure?
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              Building AI infrastructure on cloud GPUs offers unparalleled flexibility and cost efficiency for modern machine learning teams. Rather than investing $200,000+ in on-premise GPU servers with 3-5 year depreciation cycles, enterprises can access the latest H100, H200, and A100 GPUs on-demand, paying only for actual usage time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">LLM Training & Fine-Tuning</h3>
                  <p className="text-sm">
                    Train large language models efficiently with multi-GPU setups (8x H100, 8x A100). Scale from prototype to production without capital expenditure.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">High-Performance Inference</h3>
                  <p className="text-sm">
                    Deploy low-latency inference endpoints for production AI applications. Auto-scale based on traffic without over-provisioning hardware.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Research & Development</h3>
                  <p className="text-sm">
                    Experiment with different architectures and hyperparameters. Spin up dev environments in minutes, shut down when not in use.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Cost Predictability</h3>
                  <p className="text-sm">
                    Pay per hour with no long-term contracts. Use our calculators to forecast monthly burn rates and optimize spending across providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Choose a GPU Provider */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Choosing the Right GPU Cloud Provider
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-10">
          Not all GPU providers are created equal. Consider these factors when selecting infrastructure for your AI workloads:
        </p>
        <div className="space-y-6">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</span>
              Performance Requirements
            </h3>
            <p className="text-muted-foreground ml-10">
              Match GPU specs to your workload. H100 for cutting-edge LLM training (3x faster than A100), A100 for production inference and mid-scale training, RTX 4090 for development and smaller models. Consider VRAM requirements—70B parameter models need 80GB+ configurations.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</span>
              Cost vs. Reliability Trade-offs
            </h3>
            <p className="text-muted-foreground ml-10">
              Hyperscalers (AWS, GCP, Azure) offer 99.9% SLAs and enterprise support but cost 2-3x more. Decentralized providers (Spheron, Vast.ai) provide 50-80% savings for non-critical workloads. Managed platforms (RunPod, Lambda Labs) balance cost and reliability.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</span>
              Network & Data Transfer
            </h3>
            <p className="text-muted-foreground ml-10">
              Evaluate bandwidth caps and egress fees. Training jobs with large datasets benefit from unlimited bandwidth providers. Check latency requirements for real-time inference—co-location with your application infrastructure matters.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">4</span>
              Scaling & Orchestration
            </h3>
            <p className="text-muted-foreground ml-10">
              Consider multi-GPU and multi-node requirements. Does the provider support distributed training frameworks (DeepSpeed, FSDP)? Can you programmatically provision via API? Integration with Kubernetes and MLOps tools varies significantly across providers.
            </p>
          </Card>
        </div>
      </section>

      {/* Popular GPU Models */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Popular GPU Models for AI Workloads
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-10">
          Understanding the capabilities and cost-performance characteristics of leading GPUs:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-xl">NVIDIA H100</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">High-End</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex justify-between">
                <span>VRAM:</span>
                <span className="font-mono font-semibold text-foreground">80GB HBM3</span>
              </div>
              <div className="flex justify-between">
                <span>Typical Price Range:</span>
                <span className="font-mono font-semibold text-foreground">$1.50 - $6.00/hr</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              NVIDIA&apos;s flagship data center GPU. Best for: Training 70B+ parameter LLMs, GPT-4 scale models, cutting-edge research. Offers 3x training speed vs A100 with FP8 precision support.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-xl">NVIDIA A100</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">High-End</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex justify-between">
                <span>VRAM:</span>
                <span className="font-mono font-semibold text-foreground">40GB / 80GB</span>
              </div>
              <div className="flex justify-between">
                <span>Typical Price Range:</span>
                <span className="font-mono font-semibold text-foreground">$1.00 - $3.50/hr</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Industry standard for ML workloads. Best for: Production inference, mid-scale LLM training, multi-GPU setups. Excellent balance of performance and availability across providers.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-xl">NVIDIA RTX 4090</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Consumer</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex justify-between">
                <span>VRAM:</span>
                <span className="font-mono font-semibold text-foreground">24GB GDDR6X</span>
              </div>
              <div className="flex justify-between">
                <span>Typical Price Range:</span>
                <span className="font-mono font-semibold text-foreground">$0.25 - $0.80/hr</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Best price-performance for smaller models. Best for: Fine-tuning 7B-13B models, Stable Diffusion, development environments, inference serving. 70% cheaper than data center GPUs.
            </p>
          </Card>
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-xl">NVIDIA L40S</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Mid-Range</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex justify-between">
                <span>VRAM:</span>
                <span className="font-mono font-semibold text-foreground">48GB GDDR6</span>
              </div>
              <div className="flex justify-between">
                <span>Typical Price Range:</span>
                <span className="font-mono font-semibold text-foreground">$0.80 - $2.00/hr</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Versatile workhorse GPU. Best for: Inference optimization, medium-sized model training, multi-modal AI, computer vision. Strong inference performance with 48GB capacity.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
