import { GPU } from '@/types';
import { ScrapedGPU } from './price-fetcher';

// Target GPU models we want to track and display
export const TARGET_GPU_MODELS = [
  'Nvidia H100 SXM5',
  'Nvidia B200 SXM6',
  'Nvidia H100 PCIE',
  'Nvidia H200 SXM5',
  'Nvidia B300 SXM6',
  'Nvidia A100 80GB SXM4',
  'Nvidia GH200 SXM5',
  'Nvidia A100 80GB PCIE',
  'Nvidia L40S',
  'Nvidia RTX PRO 6000',
  'Nvidia RTX 5090',
  'Nvidia RTX 4090',
  'Nvidia L40',
  'Nvidia RTX 6000 ADA',
  'Nvidia RTX 6000',
  'Nvidia A6000',
  'Nvidia A5000',
  'Nvidia RTX 3090',
  'Nvidia V100',
] as const;

// Hardcoded VRAM values for accurate display (in GB)
export const GPU_VRAM_MAP: Record<string, number> = {
  'Nvidia B300 SXM6': 192,
  'Nvidia B200 SXM6': 192,
  'Nvidia H200 SXM5': 141,
  'Nvidia GH200 SXM5': 96, // Grace Hopper Superchip with 96GB HBM3
  'Nvidia H100 SXM5': 80,
  'Nvidia H100 PCIE': 80,
  'Nvidia A100 80GB PCIE': 80,
  'Nvidia A100 80GB SXM4': 80,
  'Nvidia L40S': 48,
  'Nvidia L40': 48,
  'Nvidia RTX 6000 ADA': 48,
  'Nvidia RTX PRO 6000': 96, // Professional workstation GPU with 96GB
  'Nvidia RTX 6000': 24, // Quadro RTX 6000
  'Nvidia RTX 5090': 32,
  'Nvidia RTX 4090': 24,
  'Nvidia A6000': 48,
  'Nvidia A5000': 24,
  'Nvidia RTX 3090': 24,
  'Nvidia V100': 16, // V100 16GB (standard), V100 32GB variant exists
};

// Normalized GPU name matching patterns for flexible matching
const GPU_MATCH_PATTERNS: Record<string, RegExp[]> = {
  'Nvidia B300 SXM6': [/^nvidia\s+b300/i, /^b300/i],
  'Nvidia B200 SXM6': [/^nvidia\s+b200/i, /^b200/i],
  'Nvidia H200 SXM5': [
    /^nvidia\s+h200/i,
    /^h200/i,
    /^nvidia\s+h200\s+nvl/i, // H200 NVL variant
  ],
  'Nvidia GH200 SXM5': [
    /^nvidia\s+gh200/i,
    /^gh200/i,
  ],
  'Nvidia H100 SXM5': [
    /^nvidia\s+h100\s+sxm/i, // Matches H100 SXM, SXM4, SXM5, etc.
    /^h100\s+sxm/i,
    /^nvidia\s+h100\s+nvl/i, // H100 NVL (NVLink variant of SXM5)
    /^h100\s+nvl/i,
  ],
  'Nvidia H100 PCIE': [
    /^nvidia\s+h100\s+pcie/i,
    /^h100\s+pcie/i,
    /^nvidia\s+h100$/i, // Just H100 without variant
  ],
  'Nvidia A100 80GB SXM4': [
    /^nvidia\s+a100\s+80gb\s+sxm/i, // A100 80GB SXM (explicitly SXM) - Check SXM first!
    /^a100\s+80gb\s+sxm/i,
    /^nvidia\s+a100\s+sxm/i, // Just A100 SXM without GB spec
    /^nvidia\s+a100\s+80gb$/i, // A100 80GB without variant (default to SXM4)
  ],
  'Nvidia A100 80GB PCIE': [
    /^nvidia\s+a100\s+80gb\s+pcie/i, // A100 80GB PCIE (explicitly PCIE)
    /^a100\s+80gb\s+pcie/i,
    /^nvidia\s+a100\s+pcie/i, // Just A100 PCIE without GB spec
  ],
  'Nvidia L40S': [/^nvidia\s+l40s/i, /^l40s/i],
  'Nvidia L40': [
    /^nvidia\s+l40$/i,
    /^l40$/i,
    /^nvidia\s+l40\s+/i, // L40 with any suffix (PCIE, 48GB, etc.)
  ],
  'Nvidia RTX 6000 ADA': [
    /^nvidia\s+rtx\s+6000\s+ada/i,
    /^rtx\s+6000\s+ada/i,
    /^6000\s+ada/i,
    /^nvidia\s+ada\s+6000/i, // Alternative order
  ],
  'Nvidia RTX PRO 6000': [
    /^nvidia\s+rtx\s+pro\s+6000/i, // RTX PRO 6000 (professional workstation GPU)
  ],
  'Nvidia RTX 6000': [
    /^nvidia\s+quadro\s+rtx\s+6000/i,
    /^quadro\s+rtx\s+6000/i,
    /^nvidia\s+rtx\s+quadro\s+6000/i,
  ],
  'Nvidia RTX 5090': [/^nvidia\s+rtx\s+5090/i, /^rtx\s+5090/i],
  'Nvidia RTX 4090': [/^nvidia\s+rtx\s+4090/i, /^rtx\s+4090/i],
  'Nvidia A6000': [/^nvidia\s+a6000/i, /^a6000/i, /^nvidia\s+rtx\s+a6000/i],
  'Nvidia A5000': [/^nvidia\s+a5000/i, /^a5000/i, /^nvidia\s+rtx\s+a5000/i],
  'Nvidia RTX 3090': [/^nvidia\s+rtx\s+3090/i, /^rtx\s+3090/i],
  'Nvidia V100': [/^nvidia\s+v100/i, /^v100/i, /^nvidia\s+tesla\s+v100/i],
};

/**
 * Match a GPU name from API to our target GPU list
 */
export function matchTargetGPU(gpuName: string): string | null {
  const normalizedName = gpuName.trim().toLowerCase();

  for (const [targetModel, patterns] of Object.entries(GPU_MATCH_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedName)) {
        return targetModel;
      }
    }
  }

  return null;
}

/**
 * Check if a GPU model is in our target list
 */
export function isTargetGPU(gpuName: string): boolean {
  return matchTargetGPU(gpuName) !== null;
}

// Minimal fallback data for graceful degradation when APIs fail
// Shows approximate market prices - will be replaced by live data when APIs work
export const baseGPUData: GPU[] = [
  { id: 'fallback-h100-sxm5', model: 'Nvidia H100 SXM5', provider: 'Spheron', price: 1.21, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 185 }, availability: 'Available', launchUrl: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals', slug: 'h100-sxm5', lastUpdated: new Date() },
  { id: 'fallback-h100-pcie', model: 'Nvidia H100 PCIE', provider: 'Spheron', price: 2.40, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 28, ram: 180 }, availability: 'Available', launchUrl: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals', slug: 'h100-pcie', lastUpdated: new Date() },
  { id: 'fallback-a100-pcie', model: 'Nvidia A100 80GB PCIE', provider: 'Spheron', price: 0.73, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 22, ram: 120 }, availability: 'Available', launchUrl: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals', slug: 'a100-80gb-pcie', lastUpdated: new Date() },
  { id: 'fallback-rtx4090', model: 'Nvidia RTX 4090', provider: 'RunPod', price: 0.59, vram: 24, type: 'Budget', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 6, ram: 30 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtx4090', lastUpdated: new Date() },
  { id: 'fallback-rtx3090', model: 'Nvidia RTX 3090', provider: 'Spheron', price: 0.35, vram: 24, type: 'Budget', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 8, ram: 24 }, availability: 'Available', launchUrl: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals', slug: 'rtx3090', lastUpdated: new Date() },
];

/**
 * Convert fetched API prices to GPU format
 * Only shows fallback data if NO live data is available
 */
export function mergeWithFetchedPrices(fetchedGPUs: ScrapedGPU[]): GPU[] {
  // Filter to only target GPUs from fetched data
  const targetFetchedGPUs = fetchedGPUs.filter(gpu => isTargetGPU(gpu.model));

  // If we have live data, use it exclusively (no fallback)
  if (targetFetchedGPUs.length > 0) {
    console.log(`[MERGE] Using live data: ${targetFetchedGPUs.length} GPUs found`);
    const mergedMap = new Map<string, GPU>();

    // Convert fetched GPUs to our GPU format
    targetFetchedGPUs.forEach((fetchedGpu) => {
      const matchedModel = matchTargetGPU(fetchedGpu.model);
      if (!matchedModel) return;

      // Determine GPU type based on model
      let gpuType: 'High-End' | 'Mid-Range' | 'Budget' = 'Mid-Range';
      const modelLower = matchedModel.toLowerCase();

      if (modelLower.includes('b300') || modelLower.includes('b200') ||
        modelLower.includes('h200') || modelLower.includes('h100') ||
        modelLower.includes('a100')) {
        gpuType = 'High-End';
      } else if (modelLower.includes('3090') || modelLower.includes('4090')) {
        gpuType = 'Budget';
      }

      // Get provider type and details
      const providerLower = fetchedGpu.provider.toLowerCase();
      const providerType = providerLower.includes('vast') || providerLower.includes('tensordock')
        ? 'Marketplace'
        : 'Cloud';

      // Generate slug from model name
      const slug = matchedModel.toLowerCase()
        .replace(/nvidia\s+/gi, '')
        .replace(/\s+/g, '-')
        .replace(/rtx\s+/gi, 'rtx')
        .replace(/quadro\s+/gi, 'quadro-');

      // Get provider-specific details (signup credits, launch URLs)
      const getProviderDetails = (provider: string) => {
        const p = provider.toLowerCase();
        if (p === 'runpod') {
          return { launchUrl: 'https://runpod.io/' };
        } else if (p === 'vast.ai') {
          return { launchUrl: 'https://cloud.vast.ai/' };
        } else if (p === 'lambda' || p === 'lambda labs') {
          return { launchUrl: 'https://cloud.lambdalabs.com/' };
        } else if (p === 'tensordock') {
          return { launchUrl: 'https://dashboard.tensordock.com/deploy' };
        } else if (p === 'spheron') {
          return { launchUrl: 'https://spheron.network/?utm_source=cheapestgpu&utm_medium=referral&utm_campaign=cheapestgpu-referrals' };
        } else if (p === 'prime intellect') {
          return { launchUrl: 'https://primeintellect.ai/' };
        }
        return {};
      };

      const providerDetails = getProviderDetails(fetchedGpu.provider);

      // Get correct VRAM from hardcoded map (more accurate than API data)
      const correctVram = GPU_VRAM_MAP[matchedModel] || fetchedGpu.vram || 0;

      const newGpu: GPU = {
        id: `${fetchedGpu.provider.toLowerCase().replace(/\s+/g, '-')}-${slug}-${Date.now()}-${Math.random()}`,
        model: matchedModel,
        provider: fetchedGpu.provider,
        price: fetchedGpu.price,
        vram: correctVram, // Use hardcoded VRAM value
        type: gpuType,
        providerType: providerType,
        gpuCount: 1,
        lastUpdated: new Date(),
        availability: 'Available',
        slug: slug,
        ...providerDetails,
      };

      // Add systemSpecs if available (use explicit null/undefined checks to handle 0 values)
      if (fetchedGpu.vcpus != null && fetchedGpu.memory != null) {
        newGpu.systemSpecs = {
          vCPU: fetchedGpu.vcpus,
          ram: fetchedGpu.memory,
          storage: fetchedGpu.storage
        };
      }

      // Add/update in map
      const key = `${matchedModel.toLowerCase()}-${fetchedGpu.provider.toLowerCase()}`;
      mergedMap.set(key, newGpu);
    });

    // Convert map back to array
    const gpuList = Array.from(mergedMap.values());

    // Sort and return live data
    const modelOrder = Object.keys(GPU_VRAM_MAP);
    gpuList.sort((a, b) => {
      const indexA = modelOrder.indexOf(a.model);
      const indexB = modelOrder.indexOf(b.model);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });

    return gpuList;
  }

  // No live data available - use fallback
  console.log(`[MERGE] No live data available, using ${baseGPUData.length} fallback GPUs`);
  const gpuList = [...baseGPUData];

  // Sort GPUs based on the order defined in GPU_VRAM_MAP (high-end to budget)
  const modelOrder = Object.keys(GPU_VRAM_MAP);
  gpuList.sort((a, b) => {
    const indexA = modelOrder.indexOf(a.model);
    const indexB = modelOrder.indexOf(b.model);

    // If both models are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one is in the list, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // If neither is in the list, maintain current order
    return 0;
  });

  return gpuList;
}

// Export the base data as gpuData for backwards compatibility
export let gpuData: GPU[] = baseGPUData;

/**
 * Update the GPU data with fetched prices
 */
export function updateGPUData(fetchedGPUs: ScrapedGPU[]): void {
  gpuData = mergeWithFetchedPrices(fetchedGPUs);
  updateDataTimestamp();
}

// Data freshness tracking
let dataLastUpdatedTime = new Date();

export function getDataLastUpdated(): Date {
  return dataLastUpdatedTime;
}

export function updateDataTimestamp(): void {
  dataLastUpdatedTime = new Date();
}

export function getTimeSinceUpdate(): string {
  const now = new Date();
  const diff = now.getTime() - dataLastUpdatedTime.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
