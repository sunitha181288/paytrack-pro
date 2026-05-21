'use client';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';

export default function SummaryCards() {
    const transactions = useAppSelector(s => s.transactions.transactions);

    const summary = useMemo(() => {
        const pending    = transactions.filter(t => t.status === 'PENDING').length;
        const settled    = transactions.filter(t => t.status === 'SETTLED').length;
        const processing = transactions.filter(t => t.status === 'PROCESSING').length;
        const failed     = transactions.filter(t => t.status === 'FAILED').length;
        const total      = transactions.length;

        // Group settled amounts by currency
        const settledByCurrency = transactions
            .filter(t => t.status === 'SETTLED')
            .reduce((acc, t) => {
                const currency = t.currency ?? 'UNKNOWN';
                acc[currency] = (acc[currency] ?? 0) + Number(t.amount);
                return acc;
            }, {} as Record<string, number>);

        return { total, pending, settled, processing, failed, settledByCurrency };
    }, [transactions]);

    // Currency flag emoji map
    const currencyFlags: Record<string, string> = {
        SGD: '🇸🇬', USD: '🇺🇸', HKD: '🇭🇰',
        EUR: '🇪🇺', GBP: '🇬🇧',
    };

    const topCards = [
        {
            label: 'Total',
            value: summary.total,
            color: 'border-blue-500',
            text: 'text-blue-700',
            icon: '📊',
        },
        {
            label: 'Pending',
            value: summary.pending,
            color: 'border-yellow-500',
            text: 'text-yellow-700',
            icon: '⏳',
        },
        {
            label: 'Processing',
            value: summary.processing,
            color: 'border-blue-400',
            text: 'text-blue-600',
            icon: '🔄',
        },
        {
            label: 'Settled',
            value: summary.settled,
            color: 'border-green-500',
            text: 'text-green-700',
            icon: '✅',
        },
        {
            label: 'Failed',
            value: summary.failed,
            color: 'border-red-500',
            text: 'text-red-700',
            icon: '❌',
        },
    ];

    return (
        <div className="mb-8">

            {/* ── Top 5 count cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {topCards.map(card => (
                    <div key={card.label}
                         className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${card.color} hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                {card.label}
                            </p>
                            <span className="text-lg">{card.icon}</span>
                        </div>
                        <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Settled amount per currency ── */}
            {Object.keys(summary.settledByCurrency).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">💰</span>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                            Settled Amount by Currency
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(summary.settledByCurrency)
                            .sort((a, b) => b[1] - a[1]) // sort by amount descending
                            .map(([currency, amount]) => (
                                <div key={currency}
                                     className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-4 py-2">
                  <span className="text-xl">
                    {currencyFlags[currency] ?? '🏳️'}
                  </span>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">{currency}</p>
                                        <p className="text-lg font-bold text-purple-700">
                                            {amount.toLocaleString('en-SG', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

        </div>
    );
}
