package com.tradeverity;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.reporting.PdfReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PdfReportServiceTest {

    @Test
    @DisplayName("Should generate actual OpenPDF byte array containing header and tables")
    void testPdfGeneration() {
        PdfReportService service = new PdfReportService();

        CaseReport report = new CaseReport();
        report.setCaseId("CRV-2026-TEST");
        report.setEntityName("Test Entity Corp");
        report.setCategory("Investment Advisor");
        report.setClaimedOrg("Test Claimed Org");
        report.setRegistrationNo("INA00009871");
        report.setSummaryNarrative("Detailed narrative describing investment solicitation.");
        report.setRiskBand("HIGH_ATTENTION");
        report.setRiskScore(88);

        List<EvidenceItem> evidence = new ArrayList<>();
        EvidenceItem item = new EvidenceItem();
        item.setEvidenceType("URL");
        item.setRawValue("https://test.online");
        item.setVerificationState("FLAGGED");
        evidence.add(item);

        List<RiskAssessment> assessments = new ArrayList<>();
        RiskAssessment ra = new RiskAssessment();
        ra.setRuleId("RULE-01");
        ra.setSeverity("HIGH");
        ra.setTriggered(true);
        ra.setExplanation("Guaranteed return detected");
        assessments.add(ra);

        List<VerificationCheck> checks = new ArrayList<>();

        byte[] pdfBytes = service.generateReport(report, evidence, assessments, checks);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 500, "PDF byte array should be non-empty and well-formed");
        // Check PDF magic header "%PDF-"
        assertEquals('%', (char) pdfBytes[0]);
        assertEquals('P', (char) pdfBytes[1]);
        assertEquals('D', (char) pdfBytes[2]);
        assertEquals('F', (char) pdfBytes[3]);
    }
}
