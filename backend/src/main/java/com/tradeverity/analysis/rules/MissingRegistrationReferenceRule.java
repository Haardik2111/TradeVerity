package com.tradeverity.analysis.rules;

import com.tradeverity.analysis.RiskRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MissingRegistrationReferenceRule implements RiskRule {

    @Override
    public String getRuleId() { return "RULE-07"; }

    @Override
    public String getRuleName() { return "Missing or Mismatched Registration References"; }

    @Override
    public String getVersion() { return "1.0.0"; }

    @Override
    public RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence) {
        String reg = caseReport.getRegistrationNo();
        String cat = caseReport.getCategory();

        boolean missing = (reg == null || reg.trim().isEmpty() || reg.equalsIgnoreCase("UNREGISTERED")) &&
                          ("Investment Advisor".equalsIgnoreCase(cat) || "Trading Application".equalsIgnoreCase(cat) || "Broker Impersonation".equalsIgnoreCase(cat));

        RiskAssessment ra = new RiskAssessment();
        ra.setCaseId(caseReport.getCaseId());
        ra.setRuleId(getRuleId());
        ra.setRuleName(getRuleName());
        ra.setRuleVersion(getVersion());
        ra.setSeverity("HIGH");
        ra.setTriggered(missing);

        if (missing) {
            ra.setExplanation("Entity offers securities advisory or market order execution services without disclosing a valid SEBI RIA or Stock Broker registration code.");
            ra.setEvidenceRef("Absence of verifiable regulatory registration reference");
        } else {
            ra.setExplanation("Entity does not present an uncertified securities advisory vector.");
        }

        return ra;
    }
}
