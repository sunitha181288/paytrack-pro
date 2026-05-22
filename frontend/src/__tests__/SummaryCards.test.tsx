import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TransactionForm from '@/components/TransactionForm';
import transactionReducer from '@/store/transactionSlice';

function makeStore() {
    return configureStore({
        reducer: { transactions: transactionReducer },
        preloadedState: {
            transactions: { transactions: [], statusFilter: 'ALL' as const, searchQuery: '' },
        },
    });
}

// ── Wrapper avoids React.createElement children prop issues ────
function Wrapper({ onSuccess }: { onSuccess: () => void }) {
    const store = makeStore();
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <TransactionForm onSuccess={onSuccess} />
            </Provider>
        </QueryClientProvider>
    );
}

function renderForm(onSuccess = jest.fn()) {
    return render(<Wrapper onSuccess={onSuccess} />);
}

describe('TransactionForm', () => {

    it('renders Amount label', () => {
        renderForm();
        expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('renders Merchant ID label', () => {
        renderForm();
        expect(screen.getByText('Merchant ID')).toBeInTheDocument();
    });

    it('renders Account ID label', () => {
        renderForm();
        expect(screen.getByText('Account ID')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
        renderForm();
        expect(
            screen.getByRole('button', { name: /submit transaction/i })
        ).toBeInTheDocument();
    });

    it('submit button is enabled by default', () => {
        renderForm();
        expect(
            screen.getByRole('button', { name: /submit transaction/i })
        ).not.toBeDisabled();
    });

    it('shows validation error when amount is empty on submit', async () => {
        renderForm();
        fireEvent.click(screen.getByRole('button', { name: /submit transaction/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/amount must be greater than 0/i)
            ).toBeInTheDocument();
        });
    });

    it('shows validation error when merchant ID is missing', async () => {
        renderForm();
        // amount input is type="number" — role is spinbutton
        const amountInput = screen.getAllByRole('spinbutton')[0];
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: /submit transaction/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/merchant id is required/i)
            ).toBeInTheDocument();
        });
    });

    it('shows validation error when account ID is missing', async () => {
        renderForm();
        fireEvent.click(screen.getByRole('button', { name: /submit transaction/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/account id is required/i)
            ).toBeInTheDocument();
        });
    });

    it('calls onSuccess after successful submission', async () => {
        const onSuccess = jest.fn();

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 'tx-abc123', amount: 100, currency: 'SGD',
                type: 'DEBIT', status: 'PENDING',
                merchantId: 'MERCHANT_001', accountId: 'ACC_001',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        } as Response);

        renderForm(onSuccess);

        // type="number" → spinbutton role
        fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '100' } });

        // type="text" inputs in order: merchantId, accountId, description
        const textInputs = screen.getAllByRole('textbox');
        fireEvent.change(textInputs[0], { target: { value: 'MERCHANT_001' } });
        fireEvent.change(textInputs[1], { target: { value: 'ACC_001' } });

        fireEvent.click(screen.getByRole('button', { name: /submit transaction/i }));

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledTimes(1);
        });
    });

});
