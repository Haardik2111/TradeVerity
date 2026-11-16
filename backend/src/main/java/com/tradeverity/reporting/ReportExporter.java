package com.tradeverity.reporting;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.domain.VerificationCheck;

import java.util.List;

public interface ReportExporter {
    byte[] generateReport(CaseReport caseReport,
                          List<EvidenceItem> evidence,
                          List<RiskAssessment> assessments,
                          List<VerificationCheck> checks);
}
