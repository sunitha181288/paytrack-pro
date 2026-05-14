package com.paytrack.backend.dto;

import com.paytrack.backend.model.TransactionType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransactionRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    @Pattern(regexp = "^(SGD|USD|HKD|EUR|GBP)$", message = "Currency must be SGD, USD, HKD, EUR or GBP")
    private String currency;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    @NotBlank(message = "Merchant ID is required")
    private String merchantId;

    @NotBlank(message = "Account ID is required")
    private String accountId;

    private String reference;
    private String description;
}