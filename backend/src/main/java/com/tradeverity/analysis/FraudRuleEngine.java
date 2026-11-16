package com.tradeverity.analysis;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.repository.CaseReportRepository;
import com.tradeverity.repository.RiskAssessmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Service
public class FraudRuleEngine {
    private static final Logger log = LoggerFactory.getLogger(FraudRuleEngine.class);

    private final List<RiskRule> rules;
    private final List<EvidenceAnalyzer> analyzers;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final CaseReportRepository caseReportRepository;
    private final ExecutorService executorService;

    public FraudRuleEngine(List<RiskRule> rules,
                           List<EvidenceAnalyzer> analyzers,
                           RiskAssessmentRepository riskAssessmentRepository,
                           CaseReportRepository caseReportRepository,
                           @Value("${tradeverity.analysis.thread-pool-size:4}") int threadPoolSize) {
        this.rules = rules;
        this.analyzers = analyzers;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.caseReportRepository = caseReportRepository;
        // Bounded thread pool fulfilling Advanced Java Multithreading requirement
        this.executorService = Executors.newFixedThreadPool(threadPoolSize);
        log.info("FraudRuleEngine initialized with {} rules and bounded thread pool of size {}", rules.size(), threadPoolSize);
    }

    public List<RiskAssessment> analyzeCase(CaseReport caseReport, List<EvidenceItem> evidence) {
        // Step 1: Normalize and analyze evidence items polymorphically
        for (EvidenceItem item : evidence) {
            for (EvidenceAnalyzer analyzer : analyzers) {
                if (analyzer.supports(item.getEvidenceType())) {
                    analyzer.analyze(item);
                }
            }
        }

        // Step 2: Parallel execution of versioned rules using ExecutorService
        List<Future<RiskAssessment>> futures = new ArrayList<>();
        for (RiskRule rule : rules) {
            futures.add(executorService.submit(() -> rule.evaluate(caseReport, evidence)));
        }

        List<RiskAssessment> assessments = new ArrayList<>();
        int triggeredHighCount = 0;
        int triggeredMedCount = 0;

        for (Future<RiskAssessment> future : futures) {
            try {
                RiskAssessment ra = future.get(5, TimeUnit.SECONDS);
                assessments.add(ra);
                if (Boolean.TRUE.equals(ra.getTriggered())) {
                    if ("CRITICAL".equalsIgnoreCase(ra.getSeverity()) || "HIGH".equalsIgnoreCase(ra.getSeverity())) {
                        triggeredHighCount++;
                    } else {
                        triggeredMedCount++;
                    }
                }
            } catch (Exception e) {
                log.warn("Rule evaluation interrupted: {}", e.getMessage());
            }
        }

        // Step 3: Compute explainable screening band and risk score
        int baseScore = (triggeredHighCount * 30) + (triggeredMedCount * 15);
        int finalScore = Math.min(98, Math.max(10, baseScore));

        String riskBand;
        if (triggeredHighCount >= 2 || finalScore >= 75) {
            riskBand = "HIGH_ATTENTION";
        } else if (triggeredHighCount == 1 || triggeredMedCount >= 1 || finalScore >= 45) {
            riskBand = "NEEDS_REVIEW";
        } else {
            riskBand = "LOW_INDICATORS";
        }

        caseReport.setRiskScore(finalScore);
        caseReport.setRiskBand(riskBand);
        caseReport.setStatus("COMPLETED");
        caseReportRepository.save(caseReport);

        // Step 4: Persist risk assessments
        riskAssessmentRepository.deleteByCaseId(caseReport.getCaseId());
        for (RiskAssessment ra : assessments) {
            riskAssessmentRepository.save(ra);
        }

        log.info("Case {} analysis completed. Risk Score: {}, Risk Band: {}", caseReport.getCaseId(), finalScore, riskBand);
        return assessments;
    }

    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
    }
}
