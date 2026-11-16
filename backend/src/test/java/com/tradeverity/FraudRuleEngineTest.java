package com.tradeverity;

import com.tradeverity.analysis.EvidenceAnalyzer;
import com.tradeverity.analysis.FraudRuleEngine;
import com.tradeverity.analysis.RiskRule;
import com.tradeverity.analysis.rules.GuaranteedReturnRule;
import com.tradeverity.analysis.rules.UrgentPaymentPressureRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.repository.CaseReportRepository;
import com.tradeverity.repository.RiskAssessmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

public class FraudRuleEngineTest {

    private FraudRuleEngine engine;
    private CaseReportRepository caseReportRepository;
    private RiskAssessmentRepository riskAssessmentRepository;

    @BeforeEach
    void setUp() {
        caseReportRepository = Mockito.mock(CaseReportRepository.class);
        riskAssessmentRepository = Mockito.mock(RiskAssessmentRepository.class);

        Mockito.when(caseReportRepository.save(any(CaseReport.class))).thenAnswer(i -> i.getArgument(0));

        List<RiskRule> rules = List.of(
            new GuaranteedReturnRule(),
            new UrgentPaymentPressureRule()
        );
        List<EvidenceAnalyzer> analyzers = new ArrayList<>();

        engine = new FraudRuleEngine(rules, analyzers, riskAssessmentRepository, caseReportRepository, 2);
    }

    @Test
    @DisplayName("Should detect guaranteed return claims and flag as high attention")
    void testGuaranteedReturnDetection() {
        CaseReport report = new CaseReport();
        report.setCaseId("CRV-TEST-001");
        report.setEntityName("Test VIP Options Channel");
        report.setSummaryNarrative("Group promises 35% weekly guaranteed return with zero risk.");
        report.setStatus("PROCESSING");
        report.setRiskBand("NEEDS_REVIEW");
        report.setRiskScore(50);

        List<EvidenceItem> evidence = new ArrayList<>();

        List<RiskAssessment> assessments = engine.analyzeCase(report, evidence);

        assertNotNull(assessments);
        assertEquals(2, assessments.size());

        RiskAssessment rule01 = assessments.stream()
            .filter(a -> "RULE-01".equals(a.getRuleId()))
            .findFirst()
            .orElseThrow();

        assertTrue(rule01.getTriggered());
        assertEquals("HIGH", rule01.getSeverity());
        assertTrue(report.getRiskScore() >= 30);
    }
}
