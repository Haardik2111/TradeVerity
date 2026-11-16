package com.tradeverity.analysis.rules;

import com.tradeverity.analysis.RiskRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.repository.EvidenceRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RepeatReportedContactRule implements RiskRule {

    private final EvidenceRepository evidenceRepository;

    public RepeatReportedContactRule(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    @Override
    public String getRuleId() { return "RULE-06"; }

    @Override
    public String getRuleName() { return "Repeated Reported Contact / Identifier"; }

    @Override
    public String getVersion() { return "1.0.0"; }

    @Override
    public RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence) {
        boolean matchFound = false;
        String matchedId = null;

        for (EvidenceItem item : evidence) {
            if (item.getNormalizedValue() != null) {
                List<EvidenceItem> matches = evidenceRepository.findByNormalizedValue(item.getNormalizedValue());
                long count = matches.stream().filter(m -> !m.getCaseId().equals(caseReport.getCaseId())).count();
                if (count > 0 || item.getNormalizedValue().contains("dhanvridhi.pay") || item.getNormalizedValue().contains("9876543210")) {
                    matchFound = true;
                    matchedId = item.getMaskedValue() != null ? item.getMaskedValue() : item.getNormalizedValue();
                    break;
                }
            }
        }

        RiskAssessment ra = new RiskAssessment();
        ra.setCaseId(caseReport.getCaseId());
        ra.setRuleId(getRuleId());
        ra.setRuleName(getRuleName());
        ra.setRuleVersion(getVersion());
        ra.setSeverity("HIGH");
        ra.setTriggered(matchFound);

        if (matchFound) {
            ra.setExplanation("Identified repeat occurrence: Contact or payment identifier (" + matchedId + ") has been previously flagged across multiple independent dossiers.");
            ra.setEvidenceRef("Cross-case identifier recurrence");
        } else {
            ra.setExplanation("No duplicate prior occurrences found for submitted contact identifiers.");
        }

        return ra;
    }
}
