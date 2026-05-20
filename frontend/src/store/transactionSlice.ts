import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction, TransactionStatus } from '@/types/transaction';

interface TransactionState {
    transactions:     Transaction[];
    statusFilter:     TransactionStatus | 'ALL';
    searchQuery:      string;
}

const initialState: TransactionState = {
    transactions: [],
    statusFilter: 'ALL',
    searchQuery:  '',
};

const slice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions(state, action: PayloadAction<Transaction[]>) {
            state.transactions = action.payload;
        },
        addTransaction(state, action: PayloadAction<Transaction>) {
            state.transactions.unshift(action.payload);
        },
        setStatusFilter(state, action: PayloadAction<TransactionStatus | 'ALL'>) {
            state.statusFilter = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
    },
});

export const { setTransactions, addTransaction, setStatusFilter, setSearchQuery }
    = slice.actions;
export default slice.reducer;

// Selectors
export const selectFiltered = (state: { transactions: TransactionState }) => {
    let list = state.transactions.transactions;
    if (state.transactions.statusFilter !== 'ALL')
        list = list.filter(t => t.status === state.transactions.statusFilter);
    if (state.transactions.searchQuery)
        list = list.filter(t =>
            t.id.toLowerCase().includes(state.transactions.searchQuery.toLowerCase()) ||
            t.merchantId.toLowerCase().includes(state.transactions.searchQuery.toLowerCase())
        );
    return list;
};