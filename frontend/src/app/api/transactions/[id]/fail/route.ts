import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// dynamic
export const dynamic = 'force-dynamic';

export async function PATCH(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const res = await fetch(
            `${config.backendUrl}/api/v1/transactions/${params.id}/fail`,
            { method: 'PATCH', cache: 'no-store' }
        );
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { error: 'Backend unavailable' },
            { status: 503 }
        );
    }
}
