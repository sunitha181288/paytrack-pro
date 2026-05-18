package com.paytrack.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class SummaryResponse {
    private Long totalTransactions;
    private Long pendingCount;
    private Long settledCount;
    private Long processingCount;
    private Long failedCount;
    private BigDecimal totalSettledAmount;
}