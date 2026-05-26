INSERT INTO transactions (...) VALUES
                                   ('tx-a1b2c3d4', 250.00, 'SGD', ...),
                                   ('tx-b2c3d4e5', 1200.50, 'SGD', ...)
    ON CONFLICT (id) DO NOTHING;