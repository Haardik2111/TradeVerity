package com.tradeverity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TradeVerityApplication {
    private static final Logger log = LoggerFactory.getLogger(TradeVerityApplication.class);

    public static void main(String[] args) {
        log.info("Starting TradeVerity Forensic Surveillance & Investor Protection System...");
        SpringApplication.run(TradeVerityApplication.class, args);
        log.info("TradeVerity Backend Online at http://localhost:8080");
    }
}
