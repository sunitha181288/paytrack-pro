'use client';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';

export default function SummaryCards() {
    // Read directly from Redux — updates every 10s with new data
    const transactions = useAppSelector(s => s.transactions.transactions);

    const summary = useMemo(() => {
        const pending    = transactions.filter(t => t.status === 'PENDING').length;
        const settled    = transactions.filter(t => t.status === 'SETTLED').length;
        const processing = transactions.filter(t => t.status === 'PROCESSING').length;
        const failed     = transactions.filter(t => t.status === 'FAILED').length;
        const total      = transactions.length;

        // Calculate total settled amount from live data
        const settledAmount = transactions
            .filter(t => t.status === 'SETTLED')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return { total, pending, settled, processing, failed, settledAmount };
    }, [transactions]);

    const cards = [
        {
            label: 'Total',
            value: summary.total,
            color: 'border-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            icon: '📊',
        },
        {
            label: 'Pending',
            value: summary.pending,
            color: 'border-yellow-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            icon: '⏳',
        },
        {
            label: 'Processing',
            value: summary.processing,
            color: 'border-blue-400',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: '🔄',
        },
        {
            label: 'Settled',
            value: summary.settled,
            color: 'border-green-500',
            bg: 'bg-green-50',
            text: 'text-green-700',
            icon: '✅',
        },
        {
            label: 'Failed',
            value: summary.failed,
            color: 'border-red-500',
            bg: 'bg-red-50',
            text: 'text-red-700',
            icon: '❌',
        },
        {
            label: 'Settled Amount',
            value: summary.settledAmount.toLocaleString('en-SG', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            color: 'border-purple-500',
            bg: 'bg-purple-50',
            text: 'text-purple-700',
            icon: '💰',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {cards.map(card => (
                <div key={card.label}
                     className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${card.color} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{card.label}</p>
                        <span className="text-lg">{card.icon}</span>
                    </div>
                    <p className={`text-2xl font-bold ${card.text}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}