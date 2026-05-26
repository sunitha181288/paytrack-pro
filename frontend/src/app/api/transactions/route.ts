export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

// dynamic — never pre-rendered at build time
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch(
            `${config.backendUrl}/api/v1/transactions/summary`,
            { cache: 'no-store' }
        );
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        // Return empty summary when backend is down — build succeeds
        return NextResponse.json({
            total: 0,
            pending: 0,
            processing: 0,
            settled: 0,
            failed: 0,
            totalSettledAmount: 0,
        });
    }
}
