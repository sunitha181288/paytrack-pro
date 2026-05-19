package com.paytrack.backend;

import com.paytrack.backend.dto.TransactionRequest;
import com.paytrack.backend.dto.TransactionResponse;
import com.paytrack.backend.model.*;
import com.paytrack.backend.repository.TransactionRepository;
import com.paytrack.backend.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock private TransactionRepository repository;
    @InjectMocks private TransactionService service;

    @Test
    void create_validRequest_returnsPendingTransaction() {
        TransactionRequest req = new TransactionRequest();
        req.setAmount(new BigDecimal("100.00"));
        req.setCurrency("SGD");
        req.setType(TransactionType.DEBIT);
        req.setMerchantId("MERCHANT_001");
        req.setAccountId("ACC_001");

        Transaction saved = Transaction.builder()
                .id("tx-test-001")
                .amount(new BigDecimal("100.00"))
                .currency("SGD")
                .type(TransactionType.DEBIT)
                .status(TransactionStatus.PENDING)
                .merchantId("MERCHANT_001")
                .accountId("ACC_001")
                .build();

        when(repository.save(any())).thenReturn(saved);

        TransactionResponse result = service.create(req);

        assertThat(result.getId()).isEqualTo("tx-test-001");
        assertThat(result.getStatus()).isEqualTo(TransactionStatus.PENDING);
        verify(repository, times(1)).save(any(Transaction.class));
    }

    @Test
    void getById_notFound_throwsException() {
        when(repository.findById("bad-id")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.getById("bad-id"))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("bad-id");
    }

    @Test
    void cancel_settledTransaction_throwsException() {
        Transaction settled = Transaction.builder()
                .id("tx-001").status(TransactionStatus.SETTLED).build();
        when(repository.findById("tx-001")).thenReturn(Optional.of(settled));
        assertThatThrownBy(() -> service.cancel("tx-001"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void cancel_pendingTransaction_setsStatusFailed() {
        Transaction pending = Transaction.builder()
                .id("tx-002").status(TransactionStatus.PENDING).build();
        when(repository.findById("tx-002")).thenReturn(Optional.of(pending));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        TransactionResponse result = service.cancel("tx-002");
        assertThat(result.getStatus()).isEqualTo(TransactionStatus.FAILED);
    }
}