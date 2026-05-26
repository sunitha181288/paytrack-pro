import SummaryCards from '@/components/SummaryCards';
import TransactionTableClient from '@/components/TransactionTableClient';
import { Suspense } from 'react';

export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Transaction Dashboard
                </h2>
                <p className="text-gray-500 text-sm">
                    Real-time payments monitoring — PayTrack Pro
                </p>
            </div>

            {/* Summary cards — reads from Redux, auto-updates every 10s */}
            <SummaryCards />

            {/* Transaction table — search, sort, filter, paginate */}
            <Suspense fallback={
                <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                    Loading transactions...
                </div>
            }>
                <TransactionTableClient />
            </Suspense>
        </div>
    );
}
