import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(req: NextRequest) {
    const status = req.nextUrl.searchParams.get('status');
    const url = status
        ? `${config.backendUrl}/api/v1/transactions?status=${status}`
        : `${config.backendUrl}/api/v1/transactions`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await fetch(`${config.backendUrl}/api/v1/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}