package com.tradeverity.analysis;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;

import java.util.List;

public interface RiskRule {
    String getRuleId();
    String getRuleName();
    String getVersion();
    RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence);
}
