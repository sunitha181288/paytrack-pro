/*'use client';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { setTransactions, setStatusFilter, selectFiltered } from '@/store/transactionSlice';
import { useEffect, useState } from 'react';
import { Transaction, TransactionStatus } from '@/types/transaction';
import TransactionForm from './TransactionForm';

const STATUS_COLORS: Record<TransactionStatus, string> = {
    PENDING:    'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SETTLED:    'bg-green-100 text-green-800',
    FAILED:     'bg-red-100 text-red-800',
};

const FILTERS: (TransactionStatus | 'ALL')[] = ['ALL', 'PENDING', 'PROCESSING', 'SETTLED', 'FAILED'];

export default function TransactionTableClient() {
    const dispatch    = useAppDispatch();
    const transactions = useAppSelector(selectFiltered);
    const filter      = useAppSelector(s => s.transactions.statusFilter);
    const [page, setPage] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const PAGE_SIZE = 10;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await fetch('/api/transactions');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json() as Promise<Transaction[]>;
        },
        refetchInterval: 15000,
    });

    useEffect(() => {
        if (data) dispatch(setTransactions(data));
    }, [data, dispatch]);

    const paginated = transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

    if (isLoading) return <div className="text-gray-400 py-8 text-center">Loading...</div>;
    if (error) return (
        <div className="text-red-500 py-8 text-center">
            Error loading transactions.
            <button onClick={() => refetch()} className="ml-2 underline">Retry</button>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow">
            {
             //Header
}
            <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">Transactions ({transactions.length})</h3>
                <button onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    {showForm ? 'Close' : '+ New Transaction'}
                </button>
            </div>

            {showForm && <div className="p-6 border-b bg-gray-50"><TransactionForm onSuccess={() => { refetch(); setShowForm(false); }} /></div>}

            {//Filters
}
            <div className="p-4 border-b flex gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f}
                            onClick={() => { dispatch(setStatusFilter(f)); setPage(0); }}
                            className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
              ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {// Table }
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        {['ID', 'Amount', 'Currency', 'Type', 'Status', 'Merchant', 'Date'].map(h => (
                            <th key={h} className="px-4 py-3 text-left">{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginated.map(tx => (
                        <tr key={tx.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs text-blue-600">{tx.id}</td>
                            <td className="px-4 py-3 font-semibold">{Number(tx.amount).toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-500">{tx.currency}</td>
                            <td className="px-4 py-3 text-gray-500">{tx.type}</td>
                            <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[tx.status]}`}>
                    {tx.status}
                  </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{tx.merchantId}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                                {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {// Pagination }
            {totalPages > 1 && (
                <div className="p-4 border-t flex justify-between items-center text-sm">
                    <span className="text-gray-500">Page {page + 1} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                                className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
                        <button onClick={() => setPage(p => p + 1)} disabled={page + 1 === totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}
*/

// ═══════════════════════════════════════════════════════════════
// FILE 1: src/components/TransactionTableClient.tsx
// REPLACE your entire existing TransactionTableClient.tsx with this
// Added: column sorting, search bar, live total fix
// ═══════════════════════════════════════════════════════════════

'use client';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { setTransactions, setStatusFilter } from '@/store/transactionSlice';
import { useEffect, useState, useMemo } from 'react';
import { Transaction, TransactionStatus } from '@/types/transaction';
import TransactionForm from './TransactionForm';

// Status badge colours
const STATUS_COLORS: Record<TransactionStatus, string> = {
    PENDING:    'bg-yellow-100 text-yellow-800 border border-yellow-300',
    PROCESSING: 'bg-blue-100 text-blue-800 border border-blue-300',
    SETTLED:    'bg-green-100 text-green-800 border border-green-300',
    FAILED:     'bg-red-100 text-red-800 border border-red-300',
};

const FILTERS: (TransactionStatus | 'ALL')[] = ['ALL', 'PENDING', 'PROCESSING', 'SETTLED', 'FAILED'];

// Sort direction type
type SortDir = 'asc' | 'desc' | null;
type SortField = keyof Transaction | null;

// Sort icon component
function SortIcon({ field, sortField, sortDir }: {
    field: string; sortField: SortField; sortDir: SortDir
}) {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function TransactionTableClient() {
    const dispatch    = useAppDispatch();
    const filter      = useAppSelector(s => s.transactions.statusFilter);
    const [page, setPage]         = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch]     = useState('');
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDir, setSortDir]     = useState<SortDir>('desc');

    const PAGE_SIZE = 10;

    // Fetch transactions — refetch every 10 seconds
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await fetch('/api/transactions');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json() as Promise<Transaction[]>;
        },
        refetchInterval: 10000, // auto-refresh every 10s
    });

    // Push to Redux whenever data changes
    useEffect(() => {
        if (data) dispatch(setTransactions(data));
    }, [data, dispatch]);

    // All transactions from Redux
    const allTransactions = useAppSelector(s => s.transactions.transactions);

    // 1. Filter by status
    const statusFiltered = useMemo(() => {
        if (filter === 'ALL') return allTransactions;
        return allTransactions.filter(t => t.status === filter);
    }, [allTransactions, filter]);

    // 2. Filter by search (ID, merchant, reference, description)
    const searched = useMemo(() => {
        if (!search.trim()) return statusFiltered;
        const q = search.toLowerCase();
        return statusFiltered.filter(t =>
            t.id.toLowerCase().includes(q) ||
            t.merchantId?.toLowerCase().includes(q) ||
            t.reference?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q) ||
            t.currency?.toLowerCase().includes(q) ||
            t.type?.toLowerCase().includes(q) ||
            t.status?.toLowerCase().includes(q)
        );
    }, [statusFiltered, search]);

    // 3. Sort
    const sorted = useMemo(() => {
        if (!sortField || !sortDir) return searched;
        return [...searched].sort((a, b) => {
            const av = a[sortField] ?? '';
            const bv = b[sortField] ?? '';
            const dir = sortDir === 'asc' ? 1 : -1;
            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
            return String(av).localeCompare(String(bv)) * dir;
        });
    }, [searched, sortField, sortDir]);

    // 4. Paginate
    const totalPages  = Math.ceil(sorted.length / PAGE_SIZE);
    const paginated   = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    // Handle column header click for sorting
    function handleSort(field: SortField) {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
        setPage(0);
    }

    // Reset page when filter or search changes
    useEffect(() => { setPage(0); }, [filter, search]);

    if (isLoading) return (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            <div className="text-2xl mb-2">⏳</div>Loading transactions...
        </div>
    );

    if (error) return (
        <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="text-red-500 mb-2">Failed to load transactions</div>
            <button onClick={() => refetch()}
                    className="text-blue-600 underline text-sm">Retry</button>
        </div>
    );

    const columns: { label: string; field: SortField; align?: string }[] = [
        { label: 'ID',       field: 'id' },
        { label: 'Amount',   field: 'amount',     align: 'right' },
        { label: 'Currency', field: 'currency' },
        { label: 'Type',     field: 'type' },
        { label: 'Status',   field: 'status' },
        { label: 'Merchant', field: 'merchantId' },
        { label: 'Date',     field: 'createdAt' },
    ];

    return (
        <div className="bg-white rounded-xl shadow">

            {/* ── Header ── */}
            <div className="p-6 border-b flex flex-wrap justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">
                    Transactions
                    <span className="ml-2 text-sm font-normal text-gray-400">
            ({sorted.length} of {allTransactions.length})
          </span>
                </h3>
                <button onClick={() => setShowForm(f => !f)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                    {showForm ? 'Close' : '+ New Transaction'}
                </button>
            </div>

            {/* ── New Transaction Form ── */}
            {showForm && (
                <div className="p-6 border-b bg-gray-50">
                    <TransactionForm onSuccess={() => { refetch(); setShowForm(false); }} />
                </div>
            )}

            {/* ── Search Bar ── */}
            <div className="px-6 pt-4 pb-2">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by ID, merchant, type, currency, status..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    {search && (
                        <button onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* ── Status Filters ── */}
            <div className="px-6 py-3 border-b flex gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f}
                            onClick={() => dispatch(setStatusFilter(f))}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filter === f
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
                        {f}
                    </button>
                ))}
                {search && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            🔍 "{search}" — {sorted.length} results
          </span>
                )}
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        {columns.map(col => (
                            <th key={col.label}
                                onClick={() => handleSort(col.field)}
                                className={`px-4 py-3 text-left cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap
                    ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                                {col.label}
                                <SortIcon field={col.field as string} sortField={sortField} sortDir={sortDir} />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginated.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                {search ? `No transactions match "${search}"` : 'No transactions found'}
                            </td>
                        </tr>
                    ) : (
                        paginated.map((tx, i) => (
                            <tr key={tx.id}
                                className={`border-t hover:bg-blue-50 transition-colors
                    ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <td className="px-4 py-3 font-mono text-xs text-blue-600 max-w-[180px] truncate">
                                    {tx.id}
                                </td>
                                <td className="px-4 py-3 font-semibold text-right">
                                    {Number(tx.amount).toLocaleString('en-SG', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </td>
                                <td className="px-4 py-3 text-gray-500">{tx.currency}</td>
                                <td className="px-4 py-3 text-gray-500">{tx.type}</td>
                                <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[tx.status]}`}>
                      {tx.status}
                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{tx.merchantId}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                                    {new Date(tx.createdAt).toLocaleDateString('en-GB')}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
        <span>
          Page {page + 1} of {totalPages || 1}
            <span className="ml-2 text-gray-400 text-xs">
            ({sorted.length} results)
          </span>
        </span>
                <div className="flex gap-2">
                    <button onClick={() => setPage(0)} disabled={page === 0}
                            className="px-3 py-1 border rounded text-xs disabled:opacity-40 hover:bg-gray-50">
                        «
                    </button>
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">
                        Prev
                    </button>
                    <button onClick={() => setPage(p => p + 1)} disabled={page + 1 >= totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">
                        Next
                    </button>
                    <button onClick={() => setPage(totalPages - 1)} disabled={page + 1 >= totalPages}
                            className="px-3 py-1 border rounded text-xs disabled:opacity-40 hover:bg-gray-50">
                        »
                    </button>
                </div>
            </div>

        </div>
    );
}