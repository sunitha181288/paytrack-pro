package com.paytrack.backend.controller;

import com.paytrack.backend.dto.*;
import com.paytrack.backend.model.TransactionStatus;
import com.paytrack.backend.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Transactions", description = "Payment Transaction Management API")
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    @Operation(summary = "Submit a new payment transaction")
    public ResponseEntity<TransactionResponse> create(
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(201).body(service.create(request));
    }

    @GetMapping
    @Operation(summary = "Get all transactions — optionally filter by status")
    public ResponseEntity<List<TransactionResponse>> getAll(
            @RequestParam(required = false) TransactionStatus status) {
        return ResponseEntity.ok(service.getAll(status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single transaction by ID")
    public ResponseEntity<TransactionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get transaction summary counts and total settled amount")
    public ResponseEntity<SummaryResponse> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a pending transaction (ADMIN only)")
    public ResponseEntity<TransactionResponse> cancel(@PathVariable String id) {
        return ResponseEntity.ok(service.cancel(id));
    }
}