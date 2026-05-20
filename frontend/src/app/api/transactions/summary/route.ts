import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8080';

export async function GET() {
    const res = await fetch(`${BACKEND}/api/v1/transactions/summary`,
        { next: { revalidate: 0 } });
    const data = await res.json();
    return NextResponse.json(data);
}