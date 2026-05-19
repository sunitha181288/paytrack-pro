package com.paytrack.backend.batch;

import com.paytrack.backend.model.Transaction;
import com.paytrack.backend.model.TransactionStatus;
import com.paytrack.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.PlatformTransactionManager;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@EnableScheduling
@Slf4j
public class SettlementBatchConfig {

    private final TransactionRepository repository;
    private final JobLauncher jobLauncher;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public Job settlementJob() {
        return new JobBuilder("settlementJob", jobRepository)
                .start(settlementStep())
                .build();
    }

    @Bean
    public Step settlementStep() {
        return new StepBuilder("settlementStep", jobRepository)
                .<Transaction, Transaction>chunk(100, transactionManager)
                .reader(pendingReader())
                .processor(settlementProcessor())
                .writer(settlementWriter())
                .build();
    }

    @Bean
    public ListItemReader<Transaction> pendingReader() {
        return new ListItemReader<>(repository.findPendingForSettlement());
    }

    @Bean
    public ItemProcessor<Transaction, Transaction> settlementProcessor() {
        return tx -> {
            tx.setStatus(TransactionStatus.SETTLED);
            tx.setSettledAt(LocalDateTime.now());
            tx.setSettlementBatchId("BATCH-" + LocalDate.now());
            log.info("💰 Settling transaction: {}", tx.getId());
            return tx;
        };
    }

    @Bean
    public ItemWriter<Transaction> settlementWriter() {
        return items -> repository.saveAll(items.getItems());
    }

    // Runs every 60 seconds automatically
    @Scheduled(fixedDelay = 60000)
    public void runSettlementJob() throws Exception {
        log.info("⏰ Starting scheduled settlement batch job");
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(settlementJob(), params);
    }
}