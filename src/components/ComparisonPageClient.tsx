"use client";

import { useRouter } from "next/navigation";
import { GPUComparison, ProviderComparison } from "@/lib/content/comparisons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ComparisonPageClientProps {
  gpuComparison?: GPUComparison;
  providerComparison?: ProviderComparison;
}

export default function ComparisonPageClient({ gpuComparison, providerComparison }: ComparisonPageClientProps) {
  const router = useRouter();

  if (gpuComparison) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] p-6 md:p-12 transition-colors">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <ThemeToggle />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{gpuComparison.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive performance and cost analysis for enterprise AI workloads
            </p>
          </div>

          {/* Quick Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-border">
              <h2 className="text-2xl font-bold mb-4">{gpuComparison.gpu1.name}</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">VRAM:</span>
                  <span className="ml-2 font-semibold">{gpuComparison.gpu1.vram}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Performance:</span>
                  <span className="ml-2 font-semibold">{gpuComparison.gpu1.performance}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Price Range:</span>
                  <span className="ml-2 font-mono font-semibold text-primary">
                    {gpuComparison.gpu1.priceRange}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-muted-foreground block mb-2">Best For:</span>
                  <ul className="space-y-1">
                    {gpuComparison.gpu1.bestFor.map((use, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <h2 className="text-2xl font-bold mb-4">{gpuComparison.gpu2.name}</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">VRAM:</span>
                  <span className="ml-2 font-semibold">{gpuComparison.gpu2.vram}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Performance:</span>
                  <span className="ml-2 font-semibold">{gpuComparison.gpu2.performance}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Price Range:</span>
                  <span className="ml-2 font-mono font-semibold text-primary">
                    {gpuComparison.gpu2.priceRange}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-muted-foreground block mb-2">Best For:</span>
                  <ul className="space-y-1">
                    {gpuComparison.gpu2.bestFor.map((use, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Detailed Performance Comparison</h2>
            <div className="space-y-4">
              {gpuComparison.detailedComparison.map((item, idx) => (
                <div key={idx} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div className="font-semibold">{item.category}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {gpuComparison.gpu1.name}
                      </Badge>
                      <span className="font-mono text-sm">{item.gpu1Score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {gpuComparison.gpu2.name}
                      </Badge>
                      <span className="font-mono text-sm">{item.gpu2Score}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Verdict */}
          <Card className="p-6 md:p-8 bg-muted/30">
            <h2 className="text-2xl font-bold mb-4">Our Recommendation</h2>
            <p className="text-lg leading-relaxed">{gpuComparison.verdict}</p>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button onClick={() => router.push('/')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Compare Real-Time Pricing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (providerComparison) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] p-6 md:p-12 transition-colors">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <ThemeToggle />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{providerComparison.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Compare features, pricing, and reliability for your AI infrastructure needs
            </p>
          </div>

          {/* Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-border">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold">{providerComparison.provider1.name}</h2>
                <Badge variant="secondary">{providerComparison.provider1.priceLevel}</Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Strengths</h3>
                  <ul className="space-y-1 text-sm">
                    {providerComparison.provider1.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-2">Weaknesses</h3>
                  <ul className="space-y-1 text-sm">
                    {providerComparison.provider1.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Best For</h3>
                  <p className="text-sm">{providerComparison.provider1.bestFor}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold">{providerComparison.provider2.name}</h2>
                <Badge variant="secondary">{providerComparison.provider2.priceLevel}</Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Strengths</h3>
                  <ul className="space-y-1 text-sm">
                    {providerComparison.provider2.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-2">Weaknesses</h3>
                  <ul className="space-y-1 text-sm">
                    {providerComparison.provider2.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Best For</h3>
                  <p className="text-sm">{providerComparison.provider2.bestFor}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Verdict */}
          <Card className="p-6 md:p-8 bg-muted/30">
            <h2 className="text-2xl font-bold mb-4">Our Recommendation</h2>
            <p className="text-lg leading-relaxed">{providerComparison.verdict}</p>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button onClick={() => router.push('/')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Compare All Providers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
