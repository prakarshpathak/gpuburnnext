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
        // Corrected GPU types based on API error message
        const gpuTypesToFetch = ['H100_80GB', 'A100_80GB', 'RTX4090_24GB'];

        const piRequests = gpuTypesToFetch.map(type =>
            axios.get(`https://api.primeintellect.ai/api/v1/availability/`, {
                params: { gpu_type: type },
                headers: { 'Authorization': `Bearer ${PI_API_KEY}` },
                timeout: 5000
            }).catch(err => ({
                error: true,
                type,
                message: err instanceof Error ? err.message : String(err)
            }))
        );

        const piResponses = await Promise.all(piRequests);

        piResponses.forEach((res: any) => {
            if (res.error || !res.data) {
                console.log('Prime Intellect error or no data:', res.message || 'No data');
                return;
            }

            // The API returns { "GPU_TYPE": [ ...offers ] }
            // We need to extract the array from the first key
            const keys = Object.keys(res.data);
            const offers = keys.length > 0 && Array.isArray(res.data[keys[0]]) ? res.data[keys[0]] : [];

            if (!Array.isArray(offers)) {
                return;
            }

            offers.forEach((offer: any) => {
                // "onDemand" price is usually nested in the 'prices' object
                const pricePerHour = offer.prices?.onDemand || offer.prices?.communityPrice || offer.price || 0;

                // Clean up the model name
                let friendlyName = offer.gpuType || offer.gpu_type || offer.model || 'Unknown GPU';
                if (friendlyName.includes('H100')) friendlyName = 'Nvidia H100';
                if (friendlyName.includes('A100')) friendlyName = 'Nvidia A100';
                if (friendlyName.includes('4090')) friendlyName = 'Nvidia RTX 4090';

                results.push({
                    provider: 'Prime Intellect',
                    model: friendlyName,
                    price: pricePerHour
                });
            });
        });

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
        // 4. TENSORDOCK (Public Marketplace API)
        // ---------------------------------------------------------
        try {
            const tdResponse = await axios.get('https://dashboard.tensordock.com/api/v0/client/deploy/hostnodes', { timeout: 3000 });
            const hosts = tdResponse.data.hostnodes;
            Object.values(hosts).forEach((host: any) => {
                const gpuModel = host.gpu_model || "Unknown";
                const price = host.price || 0;
                if (gpuModel.includes('RTX 4090') || gpuModel.includes('A100') || gpuModel.includes('H100')) {
                    results.push({
                        provider: 'TensorDock',
                        model: `Nvidia ${gpuModel}`,
                        price: price
                    });
                }
            });
        } catch (e) {
            console.error("TensorDock fetch failed");
        }

        // ---------------------------------------------------------
        // 5. SPHERON (Static Pricing - API requires org context)
        // ---------------------------------------------------------
        // Spheron's API requires organization context and doesn't have a public pricing endpoint
        // Using known pricing from their website: https://spheron.network
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

        return NextResponse.json({
            status: 'success',
            count: results.length,
            data: results
        });

    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
