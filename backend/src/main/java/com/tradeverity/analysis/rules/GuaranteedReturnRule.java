package com.tradeverity.analysis.rules;

import com.tradeverity.analysis.RiskRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
public class GuaranteedReturnRule implements RiskRule {

    @Override
    public String getRuleId() { return "RULE-01"; }

    @Override
    public String getRuleName() { return "Guaranteed or Assured Return Claims"; }

    @Override
    public String getVersion() { return "1.0.0"; }

    @Override
    public RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence) {
        String text = (caseReport.getSummaryNarrative() + " " + caseReport.getEntityName()).toLowerCase(Locale.ROOT);
        for (EvidenceItem item : evidence) {
            if (item.getRawValue() != null) {
                text += " " + item.getRawValue().toLowerCase(Locale.ROOT);
            }
        }

        boolean match = text.contains("guaranteed") || 
                        text.contains("assured") || 
                        text.contains("risk-free") || 
                        text.contains("risk free") || 
                        text.contains("35% weekly") || 
                        text.contains("100% profit") || 
                        text.contains("fixed return") ||
                        text.contains("daily profit");

        RiskAssessment ra = new RiskAssessment();
        ra.setCaseId(caseReport.getCaseId());
        ra.setRuleId(getRuleId());
        ra.setRuleName(getRuleName());
        ra.setRuleVersion(getVersion());
        ra.setSeverity("HIGH");
        ra.setTriggered(match);

        if (match) {
            ra.setExplanation("Promotional claims promise assured yields or guaranteed ROI, which directly violates SEBI Investment Advisers Regulations prohibiting guaranteed returns in securities trading.");
            ra.setEvidenceRef("Identified assured-return terminology in submitted pitch");
        } else {
            ra.setExplanation("No overt guaranteed-return or zero-downside promises detected in submitted text.");
        }

        return ra;
    }
}
