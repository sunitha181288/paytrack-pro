import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const res = await fetch(
            `${config.backendUrl}/api/v1/auth/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                cache: 'no-store',
            }
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