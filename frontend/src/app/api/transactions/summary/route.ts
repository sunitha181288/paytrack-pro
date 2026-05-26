import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';
  try {
    const res = await fetch(
      `${backendUrl}/api/v1/transactions/summary`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { total: 0, pending: 0, processing: 0, settled: 0, failed: 0, totalSettledAmount: 0 },
      { status: 200 }
    );
  }
}
