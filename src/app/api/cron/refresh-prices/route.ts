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
        // We fetch the most popular GPUs in parallel to keep the dashboard fast.
        const gpuTypesToFetch = ['H100_80GB', 'A100_80GB', 'RTX_4090'];

        // Create an array of promises (requests)
        const piRequests = gpuTypesToFetch.map(type =>
            axios.get(`https://api.primeintellect.ai/api/v1/availability/`, {
                params: { gpu_type: type, regions: 'united_states' }, // Filter to US or remove for global
                headers: { 'Authorization': `Bearer ${PI_API_KEY}` }
            }).catch(err => ({ error: true, type, message: err.message })) // Catch individual errors so one failure doesn't stop all
        );

        const piResponses = await Promise.all(piRequests);

        piResponses.forEach((res: any) => {
            if (res.error || !res.data) {
                console.log('Prime Intellect error or no data:', res.message || 'No data');
                return;
            }

            // The API returns a list of available clusters. We extract the lowest price.
            // Check if data is an array or if it's wrapped in another structure
            const offers = Array.isArray(res.data) ? res.data : (res.data.clusters || res.data.availability || []);

            if (!Array.isArray(offers)) {
                console.log('Prime Intellect response structure:', JSON.stringify(res.data).substring(0, 200));
                return;
            }

            offers.forEach((offer: any) => {
                // "onDemand" price is usually nested in the 'prices' object
                const pricePerHour = offer.prices?.onDemand || offer.prices?.communityPrice || offer.price || 0;

                // Clean up the model name (e.g., "H100_80GB" -> "Nvidia H100")
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
            const lambdaResponse = await axios.get('https://cloud.lambdalabs.com/api/v1/instance-types');
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
            const vultrResponse = await axios.get('https://api.vultr.com/v2/plans');
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

        // Return the combined list
        return NextResponse.json({
            status: 'success',
            count: results.length,
            data: results
        });

    } catch (error: any) {
        console.error("Fetcher Error:", error.message);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
