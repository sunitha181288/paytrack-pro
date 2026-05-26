'use client';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';
import {
    TrendingUp, Clock, RefreshCw,
    CheckCircle, XCircle, BarChart2,
} from 'lucide-react';

const CURRENCY_FLAGS: Record<string, string> = {
    SGD: '/images/flags/sgd.svg',
    USD: '/images/flags/usd.svg',
    HKD: '/images/flags/hkd.svg',
    EUR: '/images/flags/eur.svg',
    GBP: '/images/flags/gbp.svg',
};

const CURRENCY_NAMES: Record<string, string> = {
    SGD: 'Singapore Dollar',
    USD: 'US Dollar',
    HKD: 'Hong Kong Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
};

export default function SummaryCards() {
    const transactions = useAppSelector(s => s.transactions.transactions);

    const summary = useMemo(() => {
        const pending    = transactions.filter(t => t.status === 'PENDING').length;
        const settled    = transactions.filter(t => t.status === 'SETTLED').length;
        const processing = transactions.filter(t => t.status === 'PROCESSING').length;
        const failed     = transactions.filter(t => t.status === 'FAILED').length;
        const total      = transactions.length;

        const settledByCurrency = transactions
            .filter(t => t.status === 'SETTLED')
            .reduce((acc, t) => {
                const cur = t.currency ?? 'UNKNOWN';
                acc[cur] = (acc[cur] ?? 0) + Number(t.amount);
                return acc;
            }, {} as Record<string, number>);

        return { total, pending, settled, processing, failed, settledByCurrency };
    }, [transactions]);

    const topCards = [
        {
            label:  'Total',
            value:  summary.total,
            border: 'border-blue-500',
            text:   'text-blue-700',
            bg:     'bg-blue-50',
            icon:   <BarChart2   size={18} className="text-blue-500" />,
        },
        {
            label:  'Pending',
            value:  summary.pending,
            border: 'border-yellow-500',
            text:   'text-yellow-700',
            bg:     'bg-yellow-50',
            icon:   <Clock       size={18} className="text-yellow-500" />,
        },
        {
            label:  'Processing',
            value:  summary.processing,
            border: 'border-blue-400',
            text:   'text-blue-600',
            bg:     'bg-blue-50',
            icon:   <RefreshCw   size={18} className="text-blue-400" />,
        },
        {
            label:  'Settled',
            value:  summary.settled,
            border: 'border-green-500',
            text:   'text-green-700',
            bg:     'bg-green-50',
            icon:   <CheckCircle size={18} className="text-green-500" />,
        },
        {
            label:  'Failed',
            value:  summary.failed,
            border: 'border-red-500',
            text:   'text-red-700',
            bg:     'bg-red-50',
            icon:   <XCircle     size={18} className="text-red-500" />,
        },
    ];

    return (
        <div className="mb-8">

            {/* ── Count cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {topCards.map(card => (
                    <div
                        key={card.label}
                        className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${card.border} hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                {card.label}
                            </p>
                            <div className={`p-1.5 rounded-lg ${card.bg}`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Settled amount by currency ── */}
            {Object.keys(summary.settledByCurrency).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-purple-50">
                            <TrendingUp size={18} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                Settled Amount
                            </p>
                            <p className="text-xs text-gray-400">Grouped by currency</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {Object.entries(summary.settledByCurrency)
                            .sort((a, b) => b[1] - a[1])
                            .map(([currency, amount]) => (
                                <div
                                    key={currency}
                                    className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <div className="rounded overflow-hidden shadow-sm border border-gray-200 flex-shrink-0"
                                         style={{ width: 32, height: 24 }}>
                                        {CURRENCY_FLAGS[currency] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={CURRENCY_FLAGS[currency]}
                                                alt={`${currency} flag`}
                                                width={32}
                                                height={24}
                                                style={{ display: 'block', width: 32, height: 24 }}
                                            />
                                        ) : (
                                            <div className="w-8 h-6 bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {currency.slice(0, 2)}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 font-medium leading-none mb-1">
                                            {CURRENCY_NAMES[currency] ?? currency}
                                        </p>
                                        <p className="text-lg font-bold text-purple-700 leading-none">
                      <span className="text-xs font-semibold text-gray-500 mr-1">
                        {currency}
                      </span>
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
