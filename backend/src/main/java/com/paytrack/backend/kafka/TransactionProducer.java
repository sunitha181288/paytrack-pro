package com.paytrack.backend.kafka;

import com.paytrack.backend.model.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;
    public static final String TOPIC = "payment-transactions";

    public void publish(Transaction tx) {
        TransactionEvent event = TransactionEvent.builder()
                .transactionId(tx.getId())
                .amount(tx.getAmount())
                .currency(tx.getCurrency())
                .type(tx.getType().name())
                .merchantId(tx.getMerchantId())
                .timestamp(Instant.now().toString())
                .build();

        kafkaTemplate.send(TOPIC, tx.getId(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("✅ Published transaction {} to partition {}",
                                tx.getId(), result.getRecordMetadata().partition());
                    } else {
                        log.error("❌ Failed to publish transaction {}: {}", tx.getId(), ex.getMessage());
                    }
                });
    }
}