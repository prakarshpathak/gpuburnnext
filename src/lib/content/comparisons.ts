export interface GPUComparison {
  slug: string;
  title: string;
  gpu1: {
    name: string;
    vram: string;
    performance: string;
    bestFor: string[];
    priceRange: string;
  };
  gpu2: {
    name: string;
    vram: string;
    performance: string;
    bestFor: string[];
    priceRange: string;
  };
  verdict: string;
  detailedComparison: {
    category: string;
    gpu1Score: string;
    gpu2Score: string;
    description: string;
  }[];
}

export interface ProviderComparison {
  slug: string;
  title: string;
  provider1: {
    name: string;
    strengths: string[];
    weaknesses: string[];
    bestFor: string;
    priceLevel: string;
  };
  provider2: {
    name: string;
    strengths: string[];
    weaknesses: string[];
    bestFor: string;
    priceLevel: string;
  };
  verdict: string;
}

export const gpuComparisons: GPUComparison[] = [
  {
    slug: 'h100-vs-a100',
    title: 'H100 vs A100: Performance and Cost Analysis for LLM Training',
    gpu1: {
      name: 'NVIDIA H100',
      vram: '80GB HBM3',
      performance: '3x faster transformer training vs A100',
      bestFor: ['Large-scale LLM training (70B+ parameters)', 'GPT-4 scale models', 'Production inference at scale', 'FP8 precision workloads'],
      priceRange: '$1.50 - $6.00/hr'
    },
    gpu2: {
      name: 'NVIDIA A100',
      vram: '40GB / 80GB HBM2e',
      performance: 'Industry standard performance',
      bestFor: ['Mid-scale LLM training', 'Production inference', 'Multi-GPU setups', 'Cost-sensitive workloads'],
      priceRange: '$1.00 - $3.50/hr'
    },
    verdict: 'Choose H100 for cutting-edge performance and largest models where training time is critical. Choose A100 for 40-60% cost savings when budget matters more than raw speed. For most production inference and training up to 30B parameters, A100 provides excellent value.',
    detailedComparison: [
      {
        category: 'Training Speed',
        gpu1Score: '3x faster',
        gpu2Score: 'Baseline',
        description: 'H100 offers 3x faster training for transformer models thanks to improved Tensor Cores and HBM3 memory bandwidth.'
      },
      {
        category: 'Inference Throughput',
        gpu1Score: '6x faster',
        gpu2Score: 'Baseline',
        description: 'With FP8 support, H100 delivers up to 6x better inference performance, crucial for high-traffic production deployments.'
      },
      {
        category: 'Cost Efficiency',
        gpu1Score: 'Premium',
        gpu2Score: '40-60% cheaper',
        description: 'A100 is significantly more affordable per hour, making it ideal for cost-conscious teams and longer training runs.'
      },
      {
        category: 'Availability',
        gpu1Score: 'Limited',
        gpu2Score: 'Widely available',
        description: 'A100 is available across most cloud providers. H100 has limited availability, particularly at competitive prices.'
      },
      {
        category: 'Memory Bandwidth',
        gpu1Score: '3TB/s HBM3',
        gpu2Score: '2TB/s HBM2e',
        description: 'H100\'s HBM3 provides 50% more bandwidth, reducing bottlenecks for memory-intensive operations.'
      }
    ]
  },
  {
    slug: 'h100-vs-h200',
    title: 'H100 vs H200: Is the H200 Worth the Premium?',
    gpu1: {
      name: 'NVIDIA H200',
      vram: '141GB HBM3e',
      performance: '1.4x memory vs H100, 1.2x bandwidth',
      bestFor: ['Massive LLMs (200B+ parameters)', 'Multi-modal models', 'Large context windows', 'Memory-bound workloads'],
      priceRange: '$2.00 - $8.00/hr'
    },
    gpu2: {
      name: 'NVIDIA H100',
      vram: '80GB HBM3',
      performance: 'Flagship performance',
      bestFor: ['70B parameter models', 'Most production workloads', 'Cost-performance balance'],
      priceRange: '$1.50 - $6.00/hr'
    },
    verdict: 'H200 is purpose-built for the largest models where 80GB isn\'t enough. For most enterprise workloads under 100B parameters, H100 offers better cost-performance. Consider H200 only if you need massive context windows or are training 200B+ parameter models.',
    detailedComparison: [
      {
        category: 'Memory Capacity',
        gpu1Score: '141GB HBM3e',
        gpu2Score: '80GB HBM3',
        description: 'H200\'s 76% more VRAM enables training larger models or using bigger batch sizes for better efficiency.'
      },
      {
        category: 'Memory Bandwidth',
        gpu1Score: '4.8TB/s',
        gpu2Score: '3.0TB/s',
        description: '60% higher bandwidth reduces training time for memory-intensive operations like attention mechanisms.'
      },
      {
        category: 'Compute Performance',
        gpu1Score: 'Similar to H100',
        gpu2Score: 'Similar to H200',
        description: 'Core compute capabilities are nearly identical. The main difference is memory subsystem improvements.'
      },
      {
        category: 'Availability',
        gpu1Score: 'Very Limited',
        gpu2Score: 'Limited',
        description: 'Both are hard to find. H100 has slightly better availability across cloud providers.'
      },
      {
        category: 'Cost',
        gpu1Score: '$2-8/hr',
        gpu2Score: '$1.50-6/hr',
        description: 'H200 commands a 30-50% premium. Only justified for workloads that truly need the extra memory.'
      }
    ]
  },
  {
    slug: 'rtx-4090-vs-rtx-3090',
    title: 'RTX 4090 vs RTX 3090: Best Consumer GPU for AI Development',
    gpu1: {
      name: 'NVIDIA RTX 4090',
      vram: '24GB GDDR6X',
      performance: '2x faster than RTX 3090',
      bestFor: ['Fine-tuning 7-13B models', 'Stable Diffusion', 'Development environments', 'Inference serving'],
      priceRange: '$0.25 - $0.80/hr'
    },
    gpu2: {
      name: 'NVIDIA RTX 3090',
      vram: '24GB GDDR6X',
      performance: 'Solid performance',
      bestFor: ['Budget development', 'Small model training', 'Image generation', 'Inference'],
      priceRange: '$0.15 - $0.50/hr'
    },
    verdict: 'RTX 4090 is the clear winner for new projects, offering double the performance for 50-60% higher cost. RTX 3090 remains viable for budget-conscious teams doing development work or smaller models. Both provide excellent value compared to data center GPUs.',
    detailedComparison: [
      {
        category: 'Training Performance',
        gpu1Score: '2x faster',
        gpu2Score: 'Baseline',
        description: 'Ada Lovelace architecture provides significantly better performance per watt and overall throughput.'
      },
      {
        category: 'Price',
        gpu1Score: '$0.25-0.80/hr',
        gpu2Score: '$0.15-0.50/hr',
        description: 'RTX 3090 is 30-40% cheaper, making it attractive for longer development sessions and experimentation.'
      },
      {
        category: 'Power Efficiency',
        gpu1Score: 'Excellent',
        gpu2Score: 'Moderate',
        description: 'RTX 4090 delivers much better performance per watt, reducing operational costs in high-utilization scenarios.'
      },
      {
        category: 'VRAM',
        gpu1Score: '24GB',
        gpu2Score: '24GB',
        description: 'Identical memory capacity. Both can handle 13B parameter models with standard precision training.'
      },
      {
        category: 'Availability',
        gpu1Score: 'Good',
        gpu2Score: 'Excellent',
        description: 'RTX 3090 is more widely available across providers, with more consistent pricing and inventory.'
      }
    ]
  },
  {
    slug: 'a100-vs-a6000',
    title: 'A100 vs A6000: Data Center vs Workstation GPU Comparison',
    gpu1: {
      name: 'NVIDIA A100',
      vram: '40GB / 80GB',
      performance: 'Optimized for AI workloads',
      bestFor: ['LLM training', 'Large batch inference', 'Distributed training', 'Multi-GPU setups'],
      priceRange: '$1.00 - $3.50/hr'
    },
    gpu2: {
      name: 'NVIDIA RTX A6000',
      vram: '48GB',
      performance: 'Strong workstation performance',
      bestFor: ['Mixed AI/graphics workloads', 'Inference', 'Development', 'Smaller models'],
      priceRange: '$0.50 - $1.50/hr'
    },
    verdict: 'A100 is purpose-built for AI training with superior tensor core performance and NVLink support for multi-GPU scaling. A6000 offers 50-60% cost savings and is excellent for inference, development, or mixed workloads combining AI and visualization.',
    detailedComparison: [
      {
        category: 'AI Training Speed',
        gpu1Score: '2-3x faster',
        gpu2Score: 'Baseline',
        description: 'A100\'s specialized tensor cores and HBM2e memory provide substantially better training performance.'
      },
      {
        category: 'Multi-GPU Scaling',
        gpu1Score: 'NVLink support',
        gpu2Score: 'PCIe only',
        description: 'A100\'s NVLink enables efficient multi-GPU training. A6000 is limited to slower PCIe communication.'
      },
      {
        category: 'Cost',
        gpu1Score: '$1-3.50/hr',
        gpu2Score: '$0.50-1.50/hr',
        description: 'A6000 is significantly cheaper, offering good value for workloads that don\'t need peak AI performance.'
      },
      {
        category: 'Versatility',
        gpu1Score: 'AI-focused',
        gpu2Score: 'AI + Graphics',
        description: 'A6000 excels at mixed workloads combining ML with visualization, rendering, or CAD applications.'
      },
      {
        category: 'Memory',
        gpu1Score: '40/80GB',
        gpu2Score: '48GB',
        description: 'A100 80GB offers most capacity. For 40-48GB range, A6000 provides good memory at lower cost.'
      }
    ]
  },
  {
    slug: 'l40s-vs-a100',
    title: 'L40S vs A100: Inference-Optimized vs Training Powerhouse',
    gpu1: {
      name: 'NVIDIA L40S',
      vram: '48GB GDDR6',
      performance: 'Optimized for inference',
      bestFor: ['Production inference', 'Video processing', 'Multi-modal AI', 'Cost-effective serving'],
      priceRange: '$0.80 - $2.00/hr'
    },
    gpu2: {
      name: 'NVIDIA A100',
      vram: '40GB / 80GB',
      performance: 'Training + inference',
      bestFor: ['LLM training', 'Large-scale inference', 'Distributed training', 'Research'],
      priceRange: '$1.00 - $3.50/hr'
    },
    verdict: 'L40S is the smarter choice for inference-heavy workloads, offering 40-50% cost savings with excellent throughput. A100 remains superior for training and situations requiring maximum memory bandwidth or multi-GPU coordination via NVLink.',
    detailedComparison: [
      {
        category: 'Inference Performance',
        gpu1Score: 'Excellent',
        gpu2Score: 'Very Good',
        description: 'L40S delivers competitive inference throughput at lower cost. A100 has slight edge in raw performance.'
      },
      {
        category: 'Training Performance',
        gpu1Score: 'Moderate',
        gpu2Score: 'Excellent',
        description: 'A100 is substantially faster for training workloads with better tensor core utilization.'
      },
      {
        category: 'Cost Efficiency',
        gpu1Score: '40-50% cheaper',
        gpu2Score: 'Premium pricing',
        description: 'L40S offers outstanding value for inference workloads where training performance isn\'t needed.'
      },
      {
        category: 'Video/Media',
        gpu1Score: 'Excellent',
        gpu2Score: 'Limited',
        description: 'L40S includes video encoding/decoding engines, making it ideal for video AI applications.'
      },
      {
        category: 'Memory Bandwidth',
        gpu1Score: '864 GB/s',
        gpu2Score: '2TB/s',
        description: 'A100\'s HBM2e provides 2.3x more bandwidth, crucial for memory-intensive training workloads.'
      }
    ]
  }
];

export const providerComparisons: ProviderComparison[] = [
  {
    slug: 'aws-vs-gcp',
    title: 'AWS vs GCP: GPU Cloud Pricing for Enterprise AI',
    provider1: {
      name: 'Amazon Web Services (AWS)',
      strengths: [
        'Largest cloud provider with global infrastructure',
        'Extensive service ecosystem and integrations',
        'Mature enterprise support and compliance',
        'Wide GPU selection including P5 instances (H100)'
      ],
      weaknesses: [
        'Premium pricing (2-3x more expensive than alternatives)',
        'Complex pricing structure with many hidden costs',
        'GPU capacity often limited in popular regions',
        'Egress fees can be significant for data-intensive workloads'
      ],
      bestFor: 'Large enterprises requiring SLAs, compliance certifications, and tight integration with existing AWS infrastructure',
      priceLevel: '$$$$'
    },
    provider2: {
      name: 'Google Cloud Platform (GCP)',
      strengths: [
        'Strong AI/ML tooling (Vertex AI, TPUs)',
        'Competitive sustained use discounts',
        'Excellent network performance and global backbone',
        'Good A100 availability'
      ],
      weaknesses: [
        'Premium pricing similar to AWS',
        'Smaller ecosystem than AWS',
        'Limited H100 availability',
        'Fewer regions than AWS'
      ],
      bestFor: 'Teams heavily invested in Google ecosystem or requiring TPUs alongside GPUs for specialized workloads',
      priceLevel: '$$$$'
    },
    verdict: 'Both are premium hyperscalers with similar pricing and capabilities. Choose AWS for broader service ecosystem and enterprise features. Choose GCP for better AI/ML tooling and TPU access. For cost-sensitive workloads, consider alternatives like Spheron, RunPod, or Vast.ai which offer 50-80% savings.'
  },
  {
    slug: 'runpod-vs-vast',
    title: 'RunPod vs Vast.ai: Managed Platform vs Decentralized Marketplace',
    provider1: {
      name: 'RunPod',
      strengths: [
        'Managed platform with good UX',
        'Serverless GPU options',
        'Template marketplace for quick deployment',
        'Decent availability and reliability'
      ],
      weaknesses: [
        'More expensive than pure marketplaces',
        'Limited customization compared to raw instances',
        'Fewer GPU options than Vast.ai',
        'Occasional capacity issues during peak demand'
      ],
      bestFor: 'Teams wanting managed infrastructure without hyperscaler pricing. Good balance of cost, ease-of-use, and reliability',
      priceLevel: '$$'
    },
    provider2: {
      name: 'Vast.ai',
      strengths: [
        'Lowest prices (50-80% cheaper than AWS)',
        'Huge selection of GPUs',
        'Peer-to-peer marketplace model',
        'Flexible spot pricing'
      ],
      weaknesses: [
        'Variable reliability (host-dependent)',
        'No SLAs or guaranteed uptime',
        'Requires more technical knowledge',
        'Network speeds can vary significantly'
      ],
      bestFor: 'Cost-conscious teams comfortable with variable reliability. Excellent for development, training, and non-critical workloads',
      priceLevel: '$'
    },
    verdict: 'Vast.ai offers maximum cost savings for teams comfortable with marketplace dynamics and occasional host issues. RunPod provides better managed experience with moderate pricing. For production workloads requiring reliability, consider Lambda Labs or Spheron as middle-ground options.'
  },
  {
    slug: 'lambda-vs-runpod',
    title: 'Lambda Labs vs RunPod: Specialized ML Platforms Compared',
    provider1: {
      name: 'Lambda Labs',
      strengths: [
        'ML-first design and tooling',
        'Simple, transparent pricing',
        'High-quality hardware',
        'Excellent for deep learning workloads'
      ],
      weaknesses: [
        'Limited GPU availability (sells out quickly)',
        'Higher prices than marketplaces',
        'Fewer GPU types than competitors',
        'No spot/preemptible options'
      ],
      bestFor: 'ML teams wanting premium hardware and simple UX without hyperscaler complexity. Strong reputation in AI research community',
      priceLevel: '$$$'
    },
    provider2: {
      name: 'RunPod',
      strengths: [
        'Better GPU availability',
        'Serverless and spot options',
        'More GPU variety',
        'Flexible deployment options'
      ],
      weaknesses: [
        'Slightly more complex pricing',
        'Less ML-focused than Lambda',
        'Variable hardware quality',
        'Occasional performance inconsistencies'
      ],
      bestFor: 'Teams needing consistent GPU access with flexible deployment models. Better for mixed workloads beyond pure ML training',
      priceLevel: '$$'
    },
    verdict: 'Lambda Labs excels for teams prioritizing hardware quality and ML-optimized stack. RunPod offers better availability and flexibility. Both are solid mid-tier options between hyperscalers and pure marketplaces. RunPod typically offers better value for most workloads.'
  }
];

export function getGPUComparison(slug: string): GPUComparison | undefined {
  return gpuComparisons.find(c => c.slug === slug);
}

export function getProviderComparison(slug: string): ProviderComparison | undefined {
  return providerComparisons.find(c => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return [
    ...gpuComparisons.map(c => c.slug),
    ...providerComparisons.map(c => c.slug)
  ];
}
