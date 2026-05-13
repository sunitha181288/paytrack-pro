-- Simple seed data for testing
DELETE FROM transactions;

-- PENDING transactions (2)
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at)
VALUES ('tran_001', 5.50, 'HKD', 'DEBIT', 'PENDING', 'merch_01', 'acc_001', 'ref_001', 'Coffee', NOW());
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at)
VALUES ('tran_002', 129.99, 'HKD', 'DEBIT', 'PENDING', 'merch_02', 'acc_001', 'ref_002', 'Amazon', NOW());

-- PROCESSING transactions (2)
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at)
VALUES ('tran_003', 3500.00, 'HKD', 'CREDIT', 'PROCESSING', 'merch_03', 'acc_001', 'ref_003', 'Salary', NOW());
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at)
VALUES ('tran_010', 750.00, 'USD', 'DEBIT', 'PROCESSING', 'merch_04', 'acc_001', 'ref_010', 'Airbnb', NOW());

-- SETTLED transactions (5)
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at, settled_at, settlement_batch_id)
VALUES ('tran_004', 85.40, 'HKD', 'DEBIT', 'SETTLED', 'merch_05', 'acc_001', 'ref_004', 'Dinner', DATEADD('DAY', -1, NOW()), DATEADD('DAY', -1, NOW()), 'batch_001');
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at, settled_at, settlement_batch_id)
VALUES ('tran_005', 156.30, 'HKD', 'DEBIT', 'SETTLED', 'merch_06', 'acc_001', 'ref_005', 'Groceries', DATEADD('DAY', -1, NOW()), DATEADD('DAY', -1, NOW()), 'batch_001');
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at, settled_at, settlement_batch_id)
VALUES ('tran_006', 245.80, 'HKD', 'DEBIT', 'SETTLED', 'merch_07', 'acc_001', 'ref_006', 'Electricity', DATEADD('DAY', -2, NOW()), DATEADD('DAY', -2, NOW()), 'batch_002');
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at, settled_at, settlement_batch_id)
VALUES ('tran_008', 25.99, 'HKD', 'REFUND', 'SETTLED', 'merch_08', 'acc_001', 'ref_008', 'Refund', DATEADD('DAY', -3, NOW()), DATEADD('DAY', -3, NOW()), 'batch_003');
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at, settled_at, settlement_batch_id)
VALUES ('tran_009', 500.00, 'HKD', 'TRANSFER', 'SETTLED', 'merch_09', 'acc_001', 'ref_009', 'Savings Transfer', DATEADD('DAY', -4, NOW()), DATEADD('DAY', -4, NOW()), 'batch_004');

-- FAILED transaction (1)
INSERT INTO transactions (id, amount, currency, type, status, merchant_id, account_id, reference, description, created_at)
VALUES ('tran_007', 999.99, 'USD', 'DEBIT', 'FAILED', 'merch_10', 'acc_001', 'ref_007', 'Failed Purchase', NOW());