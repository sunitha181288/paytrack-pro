import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
    const res = await fetch(
        `${config.backendUrl}/api/v1/transactions/summary`,
        { next: { revalidate: 0 } }
    );
    const data = await res.json();
    return NextResponse.json(data);
}