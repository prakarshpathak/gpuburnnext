import { NextResponse } from 'next/server';
import { fetchAllPrices } from '@/lib/price-fetcher';

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic

export async function GET() {
    try {
        const results = await fetchAllPrices();

        return NextResponse.json({
            status: 'success',
            count: results.length,
            data: results
        });

    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
