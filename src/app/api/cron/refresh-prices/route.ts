import { NextResponse } from 'next/server';
import { fetchTargetGPUPrices } from '@/lib/price-fetcher';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET() {
    try {
        // Fetch only target GPUs that we want to display
        const results = await fetchTargetGPUPrices();

        return NextResponse.json({
            status: 'success',
            count: results.length,
            data: results
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ status: 'error', message }, { status: 500 });
    }
}
