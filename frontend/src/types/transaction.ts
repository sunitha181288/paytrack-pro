// Matches Spring Boot DTOs exactly

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SETTLED' | 'FAILED';
export type TransactionType   = 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'REFUND';

export interface Transaction {
    id:                 string;
    amount:             number;
    currency:           string;
    type:               TransactionType;
    status:             TransactionStatus;
    merchantId:         string;
    accountId:          string;
    reference?:         string;
    description?:       string;
    createdAt:          string;
    updatedAt:          string;
    settledAt?:         string;
    settlementBatchId?: string;
}

export interface SummaryData {
    totalTransactions:  number;
    pendingCount:       number;
    settledCount:       number;
    processingCount:    number;
    failedCount:        number;
    totalSettledAmount: number;
}

export interface TransactionRequest {
    amount:     number;
    currency:   string;
    type:       TransactionType;
    merchantId: string;
    accountId:  string;
    reference?: string;
    description?:string;
}