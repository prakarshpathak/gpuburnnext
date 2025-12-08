export interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'providers';
}

export const faqs: FAQ[] = [
  {
    question: "What is cheapestGPU and how does it work?",
    answer: "cheapestGPU is a real-time GPU price comparison platform that aggregates pricing data from multiple cloud GPU providers including AWS, GCP, Azure, RunPod, Vast.ai, Lambda Labs, Spheron, and others. We continuously fetch and update pricing information so you can instantly compare costs and find the best GPU rental for your machine learning, AI training, or inference workloads.",
    category: 'general'
  },
  {
    question: "How often are GPU prices updated?",
    answer: "GPU prices are updated in real-time through our automated price fetching system. Prices from providers like Vast.ai, RunPod, and Spheron are refreshed every few minutes to ensure you always see the most current market rates. Cloud provider prices (AWS, GCP, Azure) are updated hourly as they change less frequently.",
    category: 'pricing'
  },
  {
    question: "Which GPU should I choose for LLM training?",
    answer: "For large language model (LLM) training, we recommend H100 or A100 GPUs with 80GB VRAM for optimal performance. The H100 offers 3x faster training than A100 for transformer models. For smaller models or fine-tuning, A6000 (48GB) or RTX 4090 (24GB) provide excellent value. Consider multi-GPU setups for models exceeding 70B parameters.",
    category: 'technical'
  },
  {
    question: "What's the difference between H100 and A100 GPUs?",
    answer: "The H100 is NVIDIA's latest data center GPU, offering significant improvements over the A100. Key differences: H100 provides 3x faster training for transformers, 6x faster inference, 80GB HBM3 memory (vs A100's HBM2e), and better FP8 support. However, A100s are typically 40-60% cheaper per hour, making them cost-effective for many workloads where raw performance isn't critical.",
    category: 'technical'
  },
  {
    question: "How can I reduce my GPU cloud costs?",
    answer: "To optimize GPU costs: (1) Use spot/preemptible instances when possible for 70-90% savings, (2) Right-size your GPU selection - don't overpay for capabilities you don't need, (3) Use cheaper providers like Spheron or Vast.ai instead of hyperscalers for non-production workloads, (4) Implement auto-shutdown for idle instances, (5) Consider multi-tenancy for development environments.",
    category: 'pricing'
  },
  {
    question: "Are decentralized GPU providers reliable for production workloads?",
    answer: "Decentralized providers like Spheron and Vast.ai can be reliable for certain production workloads, offering 50-80% cost savings compared to traditional cloud providers. They're excellent for batch inference, training jobs, and dev/test environments. For mission-critical, low-latency applications requiring SLAs, traditional cloud providers (AWS, GCP, Azure) or managed platforms (RunPod, Lambda Labs) may be more appropriate.",
    category: 'providers'
  },
  {
    question: "What's included in the hourly GPU rental price?",
    answer: "Hourly prices typically include: the GPU itself, associated system RAM and vCPUs, local NVMe storage, and network bandwidth (often with caps). Prices vary by provider - some include unlimited bandwidth, others charge extra. Most providers offer persistent storage volumes as additional charges. Always check the specific provider's pricing page for detailed breakdowns.",
    category: 'pricing'
  },
  {
    question: "Can I get discounts for long-term GPU rentals?",
    answer: "Yes, most providers offer significant discounts for committed usage. AWS, GCP, and Azure provide 1-year and 3-year reserved instances with 40-60% savings. Managed providers like RunPod and Lambda Labs offer volume discounts and enterprise agreements. For consistent workloads running 24/7, reserved capacity can reduce costs substantially compared to on-demand pricing.",
    category: 'pricing'
  },
  {
    question: "Which provider has the cheapest H100 GPUs?",
    answer: "H100 pricing varies significantly across providers and availability. Decentralized marketplaces like Spheron and Vast.ai often offer the lowest per-hour rates ($1.50-$2.50/hr) when capacity is available. Traditional cloud providers (AWS, GCP, Azure) typically charge $4-$6/hr but offer better SLAs and support. Use our real-time comparison table to find current best prices.",
    category: 'providers'
  },
  {
    question: "Do I need to sign a contract to rent GPUs?",
    answer: "Most GPU cloud providers offer pay-as-you-go rentals with no long-term contracts required. You can spin up and shut down instances on-demand, paying only for actual usage time. Some providers offer optional contracts for reserved capacity at discounted rates. Enterprise agreements with volume commitments may provide additional savings but aren't necessary for getting started.",
    category: 'general'
  },
  {
    question: "What's the best GPU for Stable Diffusion image generation?",
    answer: "For Stable Diffusion, RTX 4090 (24GB VRAM) offers the best performance-to-cost ratio for both training and inference. RTX 3090 (24GB) is a budget-friendly alternative. For production-scale inference serving hundreds of concurrent requests, consider A100 or L40S GPUs. Minimum 16GB VRAM is required for SDXL models.",
    category: 'technical'
  },
  {
    question: "How do I estimate my monthly GPU costs?",
    answer: "Use our Burn Rate Calculator to estimate monthly costs based on your expected usage. Simply select your desired GPU, enter the number of instances and hours per day of operation. For example, running 4x A100 GPUs 16 hours/day at $2/hr per GPU = $3,840/month. Remember to factor in storage, bandwidth, and any reserved capacity discounts you might qualify for.",
    category: 'pricing'
  },
  {
    question: "Can I use multiple GPUs from different providers simultaneously?",
    answer: "Yes, you can rent GPUs from multiple providers and use them for different parts of your workflow. This multi-cloud strategy can optimize costs - use cheaper providers for development and training, and reliable hyperscalers for production inference. However, be mindful of data transfer costs between providers and added complexity in orchestration.",
    category: 'technical'
  },
  {
    question: "What payment methods do GPU providers accept?",
    answer: "Most providers accept major credit cards (Visa, Mastercard, Amex). Enterprise providers like AWS, GCP, and Azure offer invoicing and purchase orders for business accounts. Some decentralized platforms like Spheron may accept cryptocurrency payments. Many providers require credit card verification and initial deposits to prevent fraud.",
    category: 'general'
  },
  {
    question: "Is there a free tier or trial for GPU rentals?",
    answer: "Several providers offer free credits for new users: RunPod provides up to $5, Lambda Labs occasionally offers trial credits, and major cloud providers (AWS, GCP, Azure) include GPU access in their free tier programs (though limited). Some providers offer signup bonuses through referral links. Check individual provider pages for current promotional offers.",
    category: 'general'
  }
];

export function getFAQsByCategory(category: FAQ['category']): FAQ[] {
  return faqs.filter(faq => faq.category === category);
}

export function getAllFAQs(): FAQ[] {
  return faqs;
}
