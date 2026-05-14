package com.paytrack.backend.dto;

import com.paytrack.backend.model.Transaction;
import com.paytrack.backend.model.TransactionStatus;
import com.paytrack.backend.model.TransactionType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {

    private String id;
    private BigDecimal amount;
    private String currency;
    private TransactionType type;
    private TransactionStatus status;
    private String merchantId;
    private String accountId;
    private String reference;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime settledAt;
    private String settlementBatchId;

    // Static factory method — convert entity to DTO
    public static TransactionResponse from(Transaction tx) {
        TransactionResponse r = new TransactionResponse();
        r.id = tx.getId();
        r.amount = tx.getAmount();
        r.currency = tx.getCurrency();
        r.type = tx.getType();
        r.status = tx.getStatus();
        r.merchantId = tx.getMerchantId();
        r.accountId = tx.getAccountId();
        r.reference = tx.getReference();
        r.description = tx.getDescription();
        r.createdAt = tx.getCreatedAt();
        r.updatedAt = tx.getUpdatedAt();
        r.settledAt = tx.getSettledAt();
        r.settlementBatchId = tx.getSettlementBatchId();
        return r;
    }
}