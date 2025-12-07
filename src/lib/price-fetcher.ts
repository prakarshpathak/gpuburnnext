import axios from 'axios';

// Define strict types for our normalized data
export type ScrapedGPU = {
    model: string;
    price: number;
    provider: string;
    vram?: number;
    vcpus?: number;
    memory?: number;
    storage?: number;
};

// GPU+Provider exclusion list - filters out specific combinations
// This allows certain providers (e.g., Spheron) to rank higher by excluding competitors
const GPU_PROVIDER_EXCLUSIONS: Array<{ gpu: string; provider: string }> = [
    { gpu: 'Nvidia A100 80GB SXM4', provider: 'Vast.ai' },
    { gpu: 'Nvidia RTX 4090', provider: 'Vast.ai' },
    { gpu: 'Nvidia RTX 4090', provider: 'TensorDock' },
];

// Simplified GPU name normalization - preserves important variant info (SXM/PCIE)
const normalizeGpuName = (name: string): string => {
    // Clean up underscores, hyphens, and extra spaces
    name = name
        .replace(/nvidia_/gi, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ') // Convert hyphens to spaces
        .replace(/\s+/g, ' ')
        .trim();

    // Remove performance/configuration suffixes (but keep SXM/PCIE!)
    name = name
        .replace(/\s+HIGH\s+PERF(ORMANCE)?/gi, '')
        .replace(/\s+LOW\s+RAM/gi, '')
        .replace(/\s+HIGH\s+RAM/gi, '')
        .replace(/\s+STANDARD/gi, '')
        .replace(/\s+PERFORMANCE/gi, '')
        .replace(/\s+COMPUTE/gi, '')
        .replace(/\s+MEMORY/gi, '')
        .replace(/\s+OPTIMIZED/gi, '')
        .replace(/\s+BAREMETAL/gi, '') // Remove baremetal suffix
        .replace(/\s+DGX/gi, '') // Remove DGX suffix (A100_DGX -> A100)
        .replace(/\s+/g, ' ')
        .trim();

    // Normalize SXM variants to consistent format
    name = name.replace(/\bSXM\d?\b/gi, (match) => match.toUpperCase()); // SXM5, SXM4 → SXM5, SXM4
    name = name.replace(/\bPCIE\b/gi, 'PCIE'); // pcie → PCIE
    name = name.replace(/\bPCIe\b/gi, 'PCIE'); // PCIe → PCIE

    // Convert to title case for model names (h100 -> H100, a100 -> A100)
    name = name.replace(/\b(h\d+|a\d+|l\d+|v\d+|b\d+)\b/gi, (match) => match.toUpperCase());

    // Add "Nvidia" prefix if not present
    if (!name.toLowerCase().includes('nvidia')) {
        name = `Nvidia ${name}`;
    }

    // Add space after RTX if followed by letter or number without space
    name = name.replace(/RTX([A-Z0-9])/gi, 'RTX $1');

    // Add space before numbers for specific multi-letter prefixes
    name = name.replace(/(PRO|QUADRO|TITAN|TESLA)(\d)/gi, '$1 $2');

    // Add space between numbers and uppercase letter suffixes (6000ADA -> 6000 ADA, 6000Ada -> 6000 Ada)
    name = name.replace(/(\d)([A-Z][a-z]+)/g, '$1 $2'); // 6000Ada -> 6000 Ada
    name = name.replace(/(\d)([A-Z]{2,})/g, '$1 $2'); // 6000ADA -> 6000 ADA

    // Handle VRAM variants (like A100 80G, A100 40G)
    name = name.replace(/(\d+)\s*GB?\b/gi, '$1GB'); // Normalize "80 GB", "80G", "80gb" -> "80GB"

    // Clean up extra spaces again
    name = name.replace(/\s+/g, ' ').trim();

    // Debug log
    // if (originalName !== name) {
    //     console.log(`[NORMALIZE] '${originalName}' → '${name}'`);
    // }

    return name;
};

/**
 * Filter and return only target GPUs that we want to display
 * Filters out multi-GPU configurations and non-target models
 * Aggregates duplicates to show only the cheapest price per model+provider
 */
export async function fetchTargetGPUPrices(): Promise<ScrapedGPU[]> {
    const allPrices = await fetchAllPrices();
    console.log(`[FETCH] Total GPUs from all providers: ${allPrices.length}`);

    // Import the matching function dynamically to avoid circular dependency
    const { isTargetGPU, matchTargetGPU } = await import('./data');

    // Filter for target GPUs and map to matched target names, then aggregate
    const aggregated = new Map<string, ScrapedGPU>();

    allPrices.forEach(gpu => {
        if (!isTargetGPU(gpu.model)) return;

        // Get the matched target GPU name (this normalizes variants to the same name)
        const matchedModel = matchTargetGPU(gpu.model);
        if (!matchedModel) return;

        // Create key using the MATCHED target name (not the original API name)
        const key = `${matchedModel.toLowerCase()}-${gpu.provider.toLowerCase()}`;
        const existing = aggregated.get(key);

        // Keep the GPU with the lower price (or better specs if same price)
        if (!existing || gpu.price < existing.price) {
            // Store with the matched target name so downstream knows the correct model
            aggregated.set(key, { ...gpu, model: matchedModel });
        } else if (gpu.price === existing.price) {
            // If same price, prefer the one with better system specs
            if ((gpu.vram || 0) > (existing.vram || 0) ||
                (gpu.vcpus || 0) > (existing.vcpus || 0) ||
                (gpu.memory || 0) > (existing.memory || 0)) {
                aggregated.set(key, { ...gpu, model: matchedModel });
            }
        }
    });

    const finalResults = Array.from(aggregated.values());

    // Filter out excluded GPU+provider combinations
    const filtered = finalResults.filter(gpu => {
        const isExcluded = GPU_PROVIDER_EXCLUSIONS.some(
            exclusion => exclusion.gpu === gpu.model && exclusion.provider === gpu.provider
        );
        return !isExcluded;
    });

    console.log(`[FILTER] Filtered ${finalResults.length - filtered.length} excluded GPU+provider combinations`);
    console.log(`[AGGREGATE] Processed ${allPrices.length} GPUs → ${filtered.length} unique GPU+provider combinations`);
    return filtered;
}

export async function fetchAllPrices(): Promise<ScrapedGPU[]> {
    const results: ScrapedGPU[] = [];
    const PI_API_KEY = process.env.PRIME_INTELLECT_API_KEY;
    const TENSORDOCK_API_KEY = process.env.TENSORDOCK_API_KEY;
    const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
    const LAMBDA_API_KEY = process.env.LAMBDA_API_KEY;
    const VAST_API_KEY = process.env.VAST_API_KEY;

    const fetchPrimeIntellect = async () => {
        if (!PI_API_KEY) return [];
        try {
            const piResponse = await axios.get(`https://api.primeintellect.ai/api/v1/availability/`, {
                headers: { 'Authorization': `Bearer ${PI_API_KEY}` },
                timeout: 5000
            });

            const piResults: ScrapedGPU[] = [];
            if (piResponse.data && typeof piResponse.data === 'object') {
                Object.keys(piResponse.data).forEach(key => {
                    const offers = piResponse.data[key];
                    if (Array.isArray(offers)) {
                        offers.forEach((offer: Record<string, unknown>) => {
                            const prices = offer.prices as Record<string, number> | undefined;
                            const pricePerHour = prices?.onDemand || prices?.communityPrice || (offer.price as number) || 0;
                            const rawName = (offer.gpuType || offer.gpu_type || offer.model || key) as string;

                            if (pricePerHour > 0) {
                                // Extract system specs from Prime Intellect structure
                                const vcpu = offer.vcpu as Record<string, number> | undefined;
                                const memory = offer.memory as Record<string, number> | undefined;
                                const disk = offer.disk as Record<string, number> | undefined;
                                const gpuMemory = offer.gpuMemory as number | undefined;

                                piResults.push({
                                    provider: 'Prime Intellect',
                                    model: normalizeGpuName(rawName),
                                    price: pricePerHour,
                                    vram: gpuMemory,
                                    vcpus: vcpu?.defaultCount,
                                    memory: memory?.defaultCount,
                                    storage: disk?.defaultCount
                                });
                            }
                        });
                    }
                });
            }
            return piResults;
        } catch (e) {
            console.error("Prime Intellect fetch failed", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    const fetchLambda = async () => {
        if (!LAMBDA_API_KEY) return [];
        try {
            const lambdaResponse = await axios.get('https://cloud.lambdalabs.com/api/v1/instance-types', {
                timeout: 5000,
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(LAMBDA_API_KEY + ':').toString('base64')
                }
            });
            const lambdaResults: ScrapedGPU[] = [];
            (Object.values(lambdaResponse.data.data) as Record<string, unknown>[]).forEach((gpu) => {
                const instanceType = gpu.instance_type as { name: string; description: string };
                if (instanceType.name.includes('gpu')) {
                    const priceCents = gpu.price_cents_per_hour as number;
                    lambdaResults.push({
                        provider: 'Lambda',
                        model: normalizeGpuName(instanceType.description),
                        price: priceCents / 100
                    });
                }
            });
            return lambdaResults;
        } catch (e) {
            console.error("Lambda fetch failed", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    // Temporarily disabled Vultr fetching
    // const fetchVultr = async () => {
    //     try {
    //         const vultrResponse = await axios.get('https://api.vultr.com/v2/plans', { timeout: 3000 });
    //         const vultrResults: ScrapedGPU[] = [];
    //         vultrResponse.data.plans.forEach((plan: Record<string, unknown>) => {
    //             const planType = plan.type as string;
    //             const planId = plan.id as string;
    //             const monthlyCost = plan.monthly_cost as number;
    //             if (planType === 'vc2' || planType === 'vdc') {
    //                 vultrResults.push({
    //                     provider: 'Vultr',
    //                     model: planId.replace(/-/g, ' ').toUpperCase(),
    //                     price: parseFloat((monthlyCost / 730).toFixed(2))
    //                 });
    //             }
    //         });
    //         return vultrResults;
    //     } catch (error) {
    //         console.error("Vultr fetch failed", error);
    //         return [];
    //     }
    // };

    const fetchTensorDock = async () => {
        if (!TENSORDOCK_API_KEY) return [];
        try {
            const tdResponse = await axios.get(
                'https://dashboard.tensordock.com/api/v0/client/deploy/hostnodes',
                {
                    params: { api_key: TENSORDOCK_API_KEY },
                    timeout: 10000
                }
            );

            const tdResults: ScrapedGPU[] = [];

            // Verify response structure
            if (!tdResponse.data.hostnodes) {
                console.error('[TENSORDOCK] ERROR: Response missing "hostnodes" property');
                console.error('[TENSORDOCK] Response structure:', Object.keys(tdResponse.data));
                return [];
            }

            const hostnodes = tdResponse.data.hostnodes;

            if (hostnodes && typeof hostnodes === 'object') {
                console.log(`[TENSORDOCK] Fetched ${Object.keys(hostnodes).length} hostnodes`);

                (Object.values(hostnodes) as Record<string, unknown>[]).forEach((node) => {
                    const specs = node.specs as Record<string, unknown> | undefined;
                    if (!specs || !specs.gpu) return;

                    const gpuSpecs = specs.gpu as Record<string, Record<string, unknown>>;
                    const cpuSpecs = specs.cpu as Record<string, unknown> | undefined;
                    const ramSpecs = specs.ram as Record<string, unknown> | undefined;
                    const storageSpecs = specs.storage as Record<string, unknown> | undefined;

                    // Extract system specs
                    const cpuAmount = cpuSpecs?.amount as number | undefined;
                    const ramAmount = ramSpecs?.amount as number | undefined;
                    const storageAmount = storageSpecs?.amount as number | undefined;

                    // Iterate through available GPUs
                    Object.entries(gpuSpecs).forEach(([gpuKey, gpuInfo]) => {
                        const amount = gpuInfo.amount as number;
                        const price = gpuInfo.price as number;
                        const vram = gpuInfo.vram as number | undefined;

                        if (amount > 0 && price > 0) {
                            // Parse GPU name from key (e.g., "geforcertx4090-pcie-24gb")
                            const gpuModel = gpuKey.replace(/geforce/gi, '').replace(/-/g, ' ');

                            tdResults.push({
                                provider: 'TensorDock',
                                model: normalizeGpuName(gpuModel),
                                price: price,
                                vram: vram,
                                vcpus: cpuAmount,
                                memory: ramAmount,
                                storage: storageAmount
                            });
                        }
                    });
                });
            } else {
                console.error('[TENSORDOCK] ERROR: hostnodes is not an object or is null');
            }

            console.log(`[TENSORDOCK] Returning ${tdResults.length} GPU offers`);
            return tdResults;
        } catch (e) {
            console.error("TensorDock fetch failed", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    const fetchSpheron = async () => {
        const SPHERON_API_BASE_URL = "https://app.spheron.ai/api/gpu-offers";

        interface SpheronGpuOffer {
            provider: string;
            offerId: string;
            name: string;
            description: string;
            vcpus: number;
            memory: number;
            storage: number;
            gpuCount: number;
            price: number;
            spot_price?: number;
            available: boolean;
            clusters: string[];
            region: string;
            gpu_memory: number;
            os_options: string[];
            maintenance: boolean;
            interconnectType: string;
            interconnectDescription: string;
            instanceType: string;
            supportsCloudInit: boolean;
        }

        interface SpheronGpuData {
            gpuType: string;
            gpuModel: string;
            baseGpuType: string;
            interconnectVariants: string[];
            hasMultipleVariants: boolean;
            displayName: string;
            popularity: number;
            totalAvailable: number;
            lowestPrice: number;
            highestPrice: number;
            averagePrice: number;
            providers: string[];
            offers: SpheronGpuOffer[];
        }

        interface SpheronApiResponse {
            data: SpheronGpuData[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        }

        try {
            // Fetch all GPUs without search filter - get comprehensive list (increased limit)
            const url = `${SPHERON_API_BASE_URL}?page=1&limit=200&sortBy=popularity&sortOrder=asc`;
            const response = await axios.get(url, { timeout: 15000 });
            const apiData = response.data as SpheronApiResponse;

            console.log(`[SPHERON] Fetched ${apiData.data?.length || 0} GPU types from API`);

            if (!apiData || !apiData.data || apiData.data.length === 0) {
                console.error("Spheron: No GPU data received");
                return [];
            }

            const results: ScrapedGPU[] = [];

            // Process each GPU type and its offers
            for (const gpuData of apiData.data) {
                // Skip if no available offers
                if (gpuData.totalAvailable === 0 || !gpuData.offers || gpuData.offers.length === 0) {
                    continue;
                }

                // Get the normalized GPU name (preserves SXM/PCIE)
                const rawModel = gpuData.gpuType || gpuData.gpuModel || gpuData.baseGpuType;
                // console.log(`[SPHERON] Processing: ${rawModel} (${gpuData.totalAvailable} available)`);
                const gpuName = normalizeGpuName(rawModel);

                // Filter for single GPU offers only
                const singleGpuOffers = gpuData.offers.filter(offer =>
                    offer.available &&
                    offer.price > 0 &&
                    offer.gpuCount === 1 &&
                    !offer.maintenance
                );

                if (singleGpuOffers.length === 0) {
                    continue;
                }

                // Add each offer (aggregation will happen at the top level)
                for (const offer of singleGpuOffers) {
                    results.push({
                        provider: 'Spheron',
                        model: gpuName,
                        price: offer.price,
                        vram: offer.gpu_memory || undefined,
                        vcpus: offer.vcpus || undefined,
                        memory: offer.memory || undefined,
                        storage: offer.storage || undefined
                    });
                }
            }

            console.log(`[SPHERON] Returning ${results.length} GPU offers`);
            return results;
        } catch (error) {
            console.error("Spheron fetch failed", error instanceof Error ? error.message : String(error));
            return [];
        }
    };

    const fetchRunPod = async () => {
        if (!RUNPOD_API_KEY) return [];
        try {
            const query = `
                query GpuTypes {
                    gpuTypes {
                        id
                        displayName
                        memoryInGb
                        communityPrice
                        securePrice
                        lowestPrice(input: {gpuCount: 1}) {
                            minVcpu
                            minMemory
                        }
                    }
                }
            `;

            const runpodResponse = await axios.post(
                `https://api.runpod.io/graphql?api_key=${RUNPOD_API_KEY}`,
                { query },
                { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
            );

            const runpodResults: ScrapedGPU[] = [];
            const gpuTypes = runpodResponse.data.data.gpuTypes;
            // console.log(JSON.stringify(runpodResponse.data, null, 2));
            console.log(`[RUNPOD] Fetched ${gpuTypes.length} GPU types`);
            (gpuTypes as Record<string, unknown>[]).forEach((gpu) => {
                const displayName = gpu.displayName as string;
                const securePrice = gpu.securePrice as number | undefined;
                const communityPrice = gpu.communityPrice as number | undefined;
                const memoryInGb = gpu.memoryInGb as number | undefined;
                const lowestPrice = gpu.lowestPrice as Record<string, number> | undefined;
                const price = securePrice || communityPrice || 0;

                if ((price as number) > 0) {
                    runpodResults.push({
                        provider: 'RunPod',
                        model: normalizeGpuName(displayName),
                        price: price as number,
                        vram: memoryInGb,
                        vcpus: lowestPrice?.minVcpu,
                        memory: lowestPrice?.minMemory
                    });
                }
            });
            console.log(`[RUNPOD] Returning ${runpodResults.length} GPU offers`);
            return runpodResults;
        } catch (e) {
            console.error("RunPod fetch failed", e);
            return [];
        }
    };

    const fetchVast = async () => {
        try {
            const vastResponse = await axios.get(`https://console.vast.ai/api/v0/bundles/`, {
                params: {
                    q: JSON.stringify({
                        verified: { eq: true },
                        external: { eq: false },
                        rentable: { eq: true },
                        type: "on-demand"
                    })
                },
                headers: {
                    'Authorization': `Bearer ${VAST_API_KEY}`
                },
                timeout: 5000
            });

            console.log(`[VAST] Fetched ${vastResponse.data?.offers?.length || 0} offers`);

            const vastResults: ScrapedGPU[] = [];
            if (vastResponse.data && vastResponse.data.offers) {
                (vastResponse.data.offers as Record<string, unknown>[]).forEach((offer) => {
                    const dphTotal = offer.dph_total as number | undefined;
                    const gpuName = offer.gpu_name as string;
                    const numGpus = offer.num_gpus as number | undefined;
                    const price = dphTotal || 0;
                    // Only single GPU configs (treat missing num_gpus as 1, but exclude 0)
                    if (price > 0 && (numGpus == null || numGpus === 1)) {
                        const gpuRam = offer.gpu_ram as number | undefined;
                        const cpuCores = offer.cpu_cores_effective as number | undefined;
                        const cpuRamMB = offer.cpu_ram as number | undefined;
                        const diskSpaceGB = offer.disk_space as number | undefined;

                        console.log(`[VAST] Processing: ${gpuName} @ $${price}/hr`);
                        vastResults.push({
                            provider: 'Vast.ai',
                            model: normalizeGpuName(gpuName),
                            price: price as number,
                            vram: gpuRam ? Math.round(gpuRam / 1024) : undefined,
                            vcpus: cpuCores ? Math.round(cpuCores) : undefined,
                            memory: cpuRamMB ? Math.round(cpuRamMB / 1024) : undefined,
                            storage: diskSpaceGB ? Math.round(diskSpaceGB) : undefined
                        });
                    }
                });
            }
            console.log(`[VAST] Returning ${vastResults.length} GPU offers`);
            return vastResults;
        } catch (e) {
            console.error("[VAST] Fetch failed:", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    // Execute all fetches in parallel
    const resultsSettled = await Promise.allSettled([
        fetchPrimeIntellect(),
        fetchLambda(),
        // fetchVultr(), // Temporarily disabled
        fetchTensorDock(),
        fetchSpheron(),
        fetchRunPod(),
        fetchVast()
    ]);

    resultsSettled.forEach(result => {
        if (result.status === 'fulfilled') {
            results.push(...result.value);
        }
    });

    return results;
}
