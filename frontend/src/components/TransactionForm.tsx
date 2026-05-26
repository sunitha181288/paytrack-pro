'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { addTransaction } from '@/store/transactionSlice';

interface Props { onSuccess: () => void; }

export default function TransactionForm({ onSuccess }: Props) {
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({
        amount: '', currency: 'SGD', type: 'DEBIT',
        merchantId: '', accountId: '', description: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be greater than 0';
        if (!form.merchantId) e.merchantId = 'Merchant ID is required';
        if (!form.accountId)  e.accountId  = 'Account ID is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, amount: Number(form.amount) }),
            });
            if (!res.ok) throw new Error('Submission failed');
            const data = await res.json();
            dispatch(addTransaction(data));
            onSuccess();
        } catch (_err) {
            setErrors({ submit: 'Failed to create transaction. Is the backend running?' });
        } finally {
            setLoading(false);
        }
    };

    const field = (label: string, key: string, type = 'text', options?: string[]) => (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
            {options ? (
                <select value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {options.map(o => <option key={o}>{o}</option>)}
                </select>
            ) : (
                <input type={type} value={(form as any)[key]}
                       onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                       className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
            )}
            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
        </div>
    );

    return (
        <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {field('Amount', 'amount', 'number')}
            {field('Currency', 'currency', 'text', ['SGD', 'USD', 'HKD', 'EUR'])}
            {field('Type', 'type', 'text', ['DEBIT', 'CREDIT', 'TRANSFER', 'REFUND'])}
            {field('Merchant ID', 'merchantId')}
            {field('Account ID', 'accountId')}
            {field('Description', 'description')}
            <div className="col-span-full">
                {errors.submit && <p className="text-red-500 text-sm mb-2">{errors.submit}</p>}
                <button type="submit" disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700">
                    {loading ? 'Submitting...' : 'Submit Transaction'}
                </button>
            </div>
        </form>
    );
}