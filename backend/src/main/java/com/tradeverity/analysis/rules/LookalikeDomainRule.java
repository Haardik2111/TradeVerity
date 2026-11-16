package com.tradeverity.analysis.rules;

import com.tradeverity.analysis.RiskRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
public class LookalikeDomainRule implements RiskRule {

    @Override
    public String getRuleId() { return "RULE-05"; }

    @Override
    public String getRuleName() { return "Suspicious or Lookalike Domain Indicators"; }

    @Override
    public String getVersion() { return "1.0.0"; }

    @Override
    public RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence) {
        String url = caseReport.getWebsiteUrl() != null ? caseReport.getWebsiteUrl().toLowerCase(Locale.ROOT) : "";
        for (EvidenceItem item : evidence) {
            if ("URL".equalsIgnoreCase(item.getEvidenceType()) && item.getNormalizedValue() != null) {
                url += " " + item.getNormalizedValue().toLowerCase(Locale.ROOT);
            }
        }

        boolean suspicious = url.contains(".site") || 
                             url.contains(".online") || 
                             url.contains(".cc") || 
                             url.contains(".vip") || 
                             url.contains(".top") || 
                             url.contains("-trading") || 
                             url.contains("-apk");

        RiskAssessment ra = new RiskAssessment();
        ra.setCaseId(caseReport.getCaseId());
        ra.setRuleId(getRuleId());
        ra.setRuleName(getRuleName());
        ra.setRuleVersion(getVersion());
        ra.setSeverity("MEDIUM");
        ra.setTriggered(suspicious);

        if (suspicious) {
            ra.setExplanation("Identified lookalike or generic high-risk TLD (.site, .online, .cc, .vip) frequently associated with disposable fast-flux spoof domains.");
            ra.setEvidenceRef("Domain structure and extension telemetry");
        } else {
            ra.setExplanation("Domain structure exhibits standard top-level registration characteristics.");
        }

        return ra;
    }
}
