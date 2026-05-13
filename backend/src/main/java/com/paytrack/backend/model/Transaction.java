package com.paytrack.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @JdbcTypeCode(SqlTypes.VARCHAR)  // ← Better than @Enumerated
    @Column(length = 20)
    private TransactionType type;

    @JdbcTypeCode(SqlTypes.VARCHAR)  // ← Better than @Enumerated
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
}