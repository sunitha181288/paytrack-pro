import { SummaryData } from '@/types/transaction';
import SummaryCards from '@/components/SummaryCards';
import TransactionTableClient from '@/components/TransactionTableClient';
import { Suspense } from 'react';

async function getSummary(): Promise<SummaryData> {
  const res = await fetch('http://localhost:8080/api/v1/transactions/summary',
      { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export default async function DashboardPage() {
  let summary: SummaryData | null = null;
  try { summary = await getSummary(); } catch {}

  return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Transaction Dashboard</h2>
          <p className="text-gray-500">Real-time payments monitoring — PayTrack Pro</p>
        </div>

       {summary && <SummaryCards data={summary} />}
        <Suspense fallback={<div className="text-gray-400 py-8">Loading transactions...</div>}>
          <TransactionTableClient />
        </Suspense>
      </div>
  );
}