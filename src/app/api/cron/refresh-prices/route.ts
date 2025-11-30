import { NextResponse } from 'next/server';
import axios from 'axios';

// Define strict types for our normalized data
type ScrapedGPU = {
    model: string;
    price: number;
    provider: string;
};

export async function GET() {
    const results: ScrapedGPU[] = [];
    const PI_API_KEY = process.env.PRIME_INTELLECT_API_KEY;

    if (!PI_API_KEY) {
        return NextResponse.json({ status: 'error', message: 'Missing Prime Intellect API Key' }, { status: 500 });
    }

    try {
        // ---------------------------------------------------------
        // 1. PRIME INTELLECT (Official API Method)
        // ---------------------------------------------------------
        try {
            // Attempt to fetch ALL availability first
            const piResponse = await axios.get(`https://api.primeintellect.ai/api/v1/availability/`, {
                headers: { 'Authorization': `Bearer ${PI_API_KEY}` },
                timeout: 5000
            });

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
                                results.push({
                                    provider: 'Prime Intellect',
                                    model: friendlyName,
                                    price: pricePerHour
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error("Prime Intellect fetch all failed, falling back to specific types", e instanceof Error ? e.message : String(e));

            // Fallback to specific types if "fetch all" fails
            const gpuTypesToFetch = ['H100_80GB', 'A100_80GB', 'RTX4090_24GB'];
            const piRequests = gpuTypesToFetch.map(type =>
                axios.get(`https://api.primeintellect.ai/api/v1/availability/`, {
                    params: { gpu_type: type },
                    headers: { 'Authorization': `Bearer ${PI_API_KEY}` },
                    timeout: 5000
                }).catch(err => ({ error: true, type }))
            );

            const piResponses = await Promise.all(piRequests);
            piResponses.forEach((res: any) => {
                if (!res.error && res.data) {
                    const keys = Object.keys(res.data);
                    const offers = keys.length > 0 && Array.isArray(res.data[keys[0]]) ? res.data[keys[0]] : [];
                    offers.forEach((offer: any) => {
                        const pricePerHour = offer.prices?.onDemand || offer.prices?.communityPrice || offer.price || 0;
                        let friendlyName = offer.gpuType || 'Unknown GPU';
                        if (friendlyName.includes('H100')) friendlyName = 'Nvidia H100';
                        if (friendlyName.includes('A100')) friendlyName = 'Nvidia A100';
                        if (friendlyName.includes('4090')) friendlyName = 'Nvidia RTX 4090';

                        results.push({
                            provider: 'Prime Intellect',
                            model: friendlyName,
                            price: pricePerHour
                        });
                    });
                }
            });
        }

        // ---------------------------------------------------------
        // 2. LAMBDA LABS (Public API)
        // ---------------------------------------------------------
        try {
            const lambdaResponse = await axios.get('https://cloud.lambdalabs.com/api/v1/instance-types', { timeout: 3000 });
            Object.values(lambdaResponse.data.data).forEach((gpu: any) => {
                if (gpu.instance_type.name.includes('gpu')) {
                    results.push({
                        provider: 'Lambda',
                        model: gpu.instance_type.description,
                        price: gpu.price_cents_per_hour / 100
                    });
                }
            });
        } catch (e) { console.error("Lambda fetch failed"); }

        // ---------------------------------------------------------
        // 3. VULTR (Public API)
        // ---------------------------------------------------------
        try {
            const vultrResponse = await axios.get('https://api.vultr.com/v2/plans', { timeout: 3000 });
            vultrResponse.data.plans.forEach((plan: any) => {
                if (plan.type === 'vc2' || plan.type === 'vdc') {
                    results.push({
                        provider: 'Vultr',
                        model: plan.id.replace(/-/g, ' ').toUpperCase(),
                        price: parseFloat((plan.monthly_cost / 730).toFixed(2))
                    });
                }
            });
        } catch (e) { console.error("Vultr fetch failed"); }

        // ---------------------------------------------------------
        // 4. TENSORDOCK (Marketplace API)
        // ---------------------------------------------------------
        const TENSORDOCK_API_KEY = process.env.TENSORDOCK_API_KEY;
        if (TENSORDOCK_API_KEY) {
            try {
                // Try to fetch ALL host nodes without specifying gpu_model
                const tdResponse = await axios.post(
                    'https://marketplace.tensordock.com/api/v0/client/deploy/host_nodes',
                    new URLSearchParams({
                        api_key: TENSORDOCK_API_KEY
                    }),
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
                );

                const nodes = tdResponse.data;
                if (nodes && typeof nodes === 'object' && !nodes.error) {
                    Object.values(nodes).forEach((node: any) => {
                        if (node.specs && node.specs.gpu_model && node.price) {
                            results.push({
                                provider: 'TensorDock',
                                model: node.specs.gpu_model.replace('nvidia_', '').replace(/_/g, ' ').toUpperCase(),
                                price: node.price
                            });
                        }
                    });
                } else {
                    throw new Error("TensorDock fetch all returned error or invalid format");
                }
            } catch (e) {
                console.error("TensorDock fetch all failed, falling back to list", e instanceof Error ? e.message : String(e));

                // Fallback to iterating if "fetch all" fails
                const supportedGpus = [
                    "nvidia_rtx_4090", "nvidia_a100_sxm4", "nvidia_h100_sxm5",
                    "nvidia_a6000", "nvidia_rtx_3090", "nvidia_l40s", "nvidia_a40",
                    "nvidia_rtx_a5000", "nvidia_rtx_a4000"
                ];

                for (const gpu of supportedGpus) {
                    try {
                        const tdResponse = await axios.post(
                            'https://marketplace.tensordock.com/api/v0/client/deploy/host_nodes',
                            new URLSearchParams({
                                api_key: TENSORDOCK_API_KEY,
                                gpu_model: gpu
                            }),
                            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
                        );

                        const nodes = tdResponse.data;
                        if (nodes && typeof nodes === 'object') {
                            const prices = Object.values(nodes).map((n: any) => n.price).filter((p: any) => p > 0);
                            if (prices.length > 0) {
                                const minPrice = Math.min(...prices as number[]);
                                results.push({
                                    provider: 'TensorDock',
                                    model: gpu.replace('nvidia_', '').replace(/_/g, ' ').toUpperCase(),
                                    price: minPrice
                                });
                            }
                        }
                    } catch (err) { /* ignore */ }
                }
            }
        }

        // ---------------------------------------------------------
        // 5. SPHERON (Static Pricing - API requires org context)
        // ---------------------------------------------------------
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

        spheronPricing.forEach(gpu => {
            results.push({
                provider: 'Spheron',
                model: gpu.model,
                price: gpu.price
            });
        });

        // ---------------------------------------------------------
        // 6. RUNPOD (GraphQL API)
        // ---------------------------------------------------------
        const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
        if (RUNPOD_API_KEY) {
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

                const gpuTypes = runpodResponse.data.data.gpuTypes;
                gpuTypes.forEach((gpu: any) => {
                    const price = gpu.securePrice || gpu.communityPrice || 0;
                    if (price > 0) {
                        results.push({
                            provider: 'RunPod',
                            model: gpu.displayName,
                            price: price
                        });
                    }
                });
            } catch (e) {
                console.error("RunPod fetch failed", e);
            }
        }

        return NextResponse.json({
            status: 'success',
            count: results.length,
            data: results
        });

    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
