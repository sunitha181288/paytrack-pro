import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';
  try {
    const status = req.nextUrl.searchParams.get('status');
    const url = status
      ? `${backendUrl}/api/v1/transactions?status=${status}`
      : `${backendUrl}/api/v1/transactions`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';
  try {
    const body = await req.json();
    const res = await fetch(`${backendUrl}/api/v1/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 200 });
  }
}
