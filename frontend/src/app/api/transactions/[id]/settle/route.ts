import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const res = await fetch(
        `${config.backendUrl}/api/v1/transactions/${params.id}/settle`,
        { method: 'PATCH' }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}