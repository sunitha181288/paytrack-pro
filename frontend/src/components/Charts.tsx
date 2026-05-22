'use client';
import { useAppSelector } from '@/store';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
    PieChart, Pie, Legend,
} from 'recharts';

// Status colours — no Cell needed, use fill directly on Pie data
const STATUS_COLORS: Record<string, string> = {
    PENDING:    '#f59e0b',
    PROCESSING: '#3b82f6',
    SETTLED:    '#10b981',
    FAILED:     '#ef4444',
};

export default function Charts() {
    const transactions = useAppSelector(s => s.transactions.transactions);

    // ── Pie chart data — count by status with colour embedded ──
    const pieData = Object.entries(
        transactions.reduce((acc, tx) => {
            acc[tx.status] = (acc[tx.status] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([name, value]) => ({
        name,
        value,
        fill: STATUS_COLORS[name] ?? '#6b7280', // colour embedded in data
    }));

    // ── Bar chart — daily transaction volume last 7 days ──
    const barData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const label = date.toLocaleDateString('en-SG', { weekday: 'short' });
        const total = transactions
            .filter(tx => new Date(tx.createdAt).toDateString() === date.toDateString())
            .reduce((sum, tx) => sum + Number(tx.amount), 0);
        return { label, total: Number(total.toFixed(2)) };
    });

    if (transactions.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">

            {/* ── Bar Chart ── */}
            <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-bold text-gray-800 mb-1">
                    Daily Transaction Volume
                </h4>
                <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}
                              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value) =>
                                typeof value === 'number'
                                    ? value.toLocaleString('en-SG', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })
                                    : String(value)
                            }
                        />
                        <Bar dataKey="total" fill="#3b82f6"
                             radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Pie Chart — fill comes from data, no Cell needed ── */}
            <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-bold text-gray-800 mb-1">
                    Status Breakdown
                </h4>
                <p className="text-xs text-gray-400 mb-4">
                    {transactions.length} total transactions
                </p>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) =>
                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                        />
                        <Legend />
                        <Tooltip
                            formatter={(value, name) =>
                                [`${value} transactions`, String(name)]
                            }
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}
