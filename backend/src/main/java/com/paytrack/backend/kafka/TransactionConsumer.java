package com.paytrack.backend.kafka;

import com.paytrack.backend.model.TransactionStatus;
import com.paytrack.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final TransactionRepository repository;

    @KafkaListener(topics = TransactionProducer.TOPIC,
            groupId = "paytrack-group")
    public void consume(TransactionEvent event) {
        log.info("📨 Received event for transaction: {}", event.getTransactionId());

        repository.findById(event.getTransactionId()).ifPresent(tx -> {
            if (tx.getStatus() == TransactionStatus.PENDING) {
                tx.setStatus(TransactionStatus.PROCESSING);
                repository.save(tx);
                log.info("🔄 Transaction {} moved to PROCESSING", tx.getId());
            }
        });
    }
}