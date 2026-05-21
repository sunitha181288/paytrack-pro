package com.paytrack.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    private String id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransactionStatus status;

    private String merchantId;
    private String accountId;
    private String reference;
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime settledAt;
    private String settlementBatchId;

    // Auto-generates tx-a3f2c1d4 style ID before first save
    @PrePersist
    public void generateId() {
        if (this.id == null) {
            String shortId = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8);
            this.id = "tx-" + shortId;
        }
    }
}