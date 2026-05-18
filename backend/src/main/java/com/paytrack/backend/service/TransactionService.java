package com.paytrack.backend.service;

import com.paytrack.backend.dto.*;
import com.paytrack.backend.model.*;
import com.paytrack.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository repository;

    @Transactional
    public TransactionResponse create(TransactionRequest request) {
        Transaction tx = Transaction.builder()
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .type(request.getType())
                .status(TransactionStatus.PENDING)
                .merchantId(request.getMerchantId())
                .accountId(request.getAccountId())
                .reference(request.getReference())
                .description(request.getDescription())
                .build();

        Transaction saved = repository.save(tx);
        log.info("Created transaction: {} for merchant: {}", saved.getId(), saved.getMerchantId());
        return TransactionResponse.from(saved);
    }

    public List<TransactionResponse> getAll(TransactionStatus status) {
        List<Transaction> txs = (status != null)
                ? repository.findByStatus(status)
                : repository.findAll();
        return txs.stream().map(TransactionResponse::from).collect(Collectors.toList());
    }

    public TransactionResponse getById(String id) {
        return repository.findById(id)
                .map(TransactionResponse::from)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found: " + id));
    }

    public SummaryResponse getSummary() {
        return SummaryResponse.builder()
                .totalTransactions(repository.count())
                .pendingCount(repository.countByStatus(TransactionStatus.PENDING))
                .settledCount(repository.countByStatus(TransactionStatus.SETTLED))
                .processingCount(repository.countByStatus(TransactionStatus.PROCESSING))
                .failedCount(repository.countByStatus(TransactionStatus.FAILED))
                .totalSettledAmount(repository.getTotalSettledAmount())
                .build();
    }

    @Transactional
    public TransactionResponse cancel(String id) {
        Transaction tx = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found: " + id));
        if (tx.getStatus() == TransactionStatus.SETTLED)
            throw new IllegalArgumentException("Cannot cancel a settled transaction");
        tx.setStatus(TransactionStatus.FAILED);
        return TransactionResponse.from(repository.save(tx));
    }
}