import axios from 'axios';

// Define strict types for our normalized data
export type ScrapedGPU = {
    model: string;
    price: number;
    provider: string;
    vram?: number;
};

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
                        offers.forEach((offer: any) => {
                            const pricePerHour = offer.prices?.onDemand || offer.prices?.communityPrice || offer.price || 0;
                            let friendlyName = offer.gpuType || offer.gpu_type || offer.model || key;

                            // Normalize names
                            if (friendlyName.includes('H100')) friendlyName = 'Nvidia H100';
                            else if (friendlyName.includes('A100')) friendlyName = 'Nvidia A100';
                            else if (friendlyName.includes('4090')) friendlyName = 'Nvidia RTX 4090';
                            else if (friendlyName.includes('A6000')) friendlyName = 'Nvidia RTX A6000';
                            else if (friendlyName.includes('3090')) friendlyName = 'Nvidia RTX 3090';

                            if (pricePerHour > 0) {
                                piResults.push({
                                    provider: 'Prime Intellect',
                                    model: friendlyName,
                                    price: pricePerHour
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
            Object.values(lambdaResponse.data.data).forEach((gpu: any) => {
                if (gpu.instance_type.name.includes('gpu')) {
                    lambdaResults.push({
                        provider: 'Lambda',
                        model: gpu.instance_type.description,
                        price: gpu.price_cents_per_hour / 100
                    });
                }
            });
            return lambdaResults;
        } catch (e) {
            console.error("Lambda fetch failed", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    const fetchVultr = async () => {
        try {
            const vultrResponse = await axios.get('https://api.vultr.com/v2/plans', { timeout: 3000 });
            const vultrResults: ScrapedGPU[] = [];
            vultrResponse.data.plans.forEach((plan: any) => {
                if (plan.type === 'vc2' || plan.type === 'vdc') {
                    vultrResults.push({
                        provider: 'Vultr',
                        model: plan.id.replace(/-/g, ' ').toUpperCase(),
                        price: parseFloat((plan.monthly_cost / 730).toFixed(2))
                    });
                }
            });
            return vultrResults;
        } catch (e) {
            console.error("Vultr fetch failed");
            return [];
        }
    };

    const fetchTensorDock = async () => {
        if (!TENSORDOCK_API_KEY) return [];
        try {
            const tdResponse = await axios.post(
                'https://dashboard.tensordock.com/api/v0/client/deploy/hostnodes',
                new URLSearchParams({
                    api_key: TENSORDOCK_API_KEY
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
            );

            const tdResults: ScrapedGPU[] = [];
            const nodes = tdResponse.data;
            if (nodes && typeof nodes === 'object' && !nodes.error) {
                Object.values(nodes).forEach((node: any) => {
                    if (node.specs && node.specs.gpu_model && node.price) {
                        tdResults.push({
                            provider: 'TensorDock',
                            model: node.specs.gpu_model.replace('nvidia_', '').replace(/_/g, ' ').toUpperCase(),
                            price: node.price
                        });
                    }
                });
            }
            return tdResults;
        } catch (e) {
            console.error("TensorDock fetch failed", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    const fetchSpheron = async () => {
        const spheronPricing = [
            { model: 'Nvidia H100', price: 1.33, vram: 80 },
            { model: 'Nvidia H200', price: 1.56, vram: 141 },
            { model: 'Nvidia A100', price: 0.72, vram: 80 },
            { model: 'Nvidia RTX 4090', price: 0.58, vram: 24 },
            { model: 'Nvidia RTX 5090', price: 0.68, vram: 32 },
            { model: 'Nvidia L40S', price: 0.69, vram: 48 },
            { model: 'Nvidia B200', price: 2.25, vram: 192 },
            { model: 'Nvidia GH200', price: 1.88, vram: 96 }
        ];
        return spheronPricing.map(gpu => ({
            provider: 'Spheron',
            model: gpu.model,
            price: gpu.price
        }));
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
            gpuTypes.forEach((gpu: any) => {
                const price = gpu.securePrice || gpu.communityPrice || 0;
                if (price > 0) {
                    runpodResults.push({
                        provider: 'RunPod',
                        model: gpu.displayName,
                        price: price
                    });
                }
            });
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

            const vastResults: ScrapedGPU[] = [];
            if (vastResponse.data && vastResponse.data.offers) {
                vastResponse.data.offers.forEach((offer: any) => {
                    const price = offer.dph_total || 0;
                    if (price > 0) {
                        vastResults.push({
                            provider: 'Vast.ai',
                            model: offer.gpu_name,
                            price: price,
                            vram: offer.gpu_ram ? Math.round(offer.gpu_ram / 1024) : undefined
                        });
                    }
                });
            }
            return vastResults;
        } catch (e) {
            console.error("Vast.ai fetch failed", e instanceof Error ? e.message : String(e));
            return [];
        }
    };

    // Execute all fetches in parallel
    const resultsSettled = await Promise.allSettled([
        fetchPrimeIntellect(),
        fetchLambda(),
        fetchVultr(),
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
