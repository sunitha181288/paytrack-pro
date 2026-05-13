package com.paytrack.backend.repository;

import com.paytrack.backend.model.Transaction;
import com.paytrack.backend.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByMerchantId(String merchantId);

    List<Transaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT t FROM Transaction t WHERE t.status = 'PENDING' ORDER BY t.createdAt ASC")
    List<Transaction> findPendingForSettlement();

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'SETTLED'")
    BigDecimal getTotalSettledAmount();

    Long countByStatus(TransactionStatus status);
}