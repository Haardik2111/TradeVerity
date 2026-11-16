package com.tradeverity.analysis.rules;

import com.tradeverity.analysis.RiskRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
public class CredentialHarvestingRule implements RiskRule {

    @Override
    public String getRuleId() { return "RULE-03"; }

    @Override
    public String getRuleName() { return "Requests for Trading Passwords or Credentials"; }

    @Override
    public String getVersion() { return "1.0.0"; }

    @Override
    public RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence) {
        String text = caseReport.getSummaryNarrative() != null ? caseReport.getSummaryNarrative().toLowerCase(Locale.ROOT) : "";

        boolean match = text.contains("password") || 
                        text.contains("otp") || 
                        text.contains("demat login") || 
                        text.contains("anydesk") || 
                        text.contains("teamviewer") || 
                        text.contains("remote access") ||
                        text.contains("pin");

        RiskAssessment ra = new RiskAssessment();
        ra.setCaseId(caseReport.getCaseId());
        ra.setRuleId(getRuleId());
        ra.setRuleName(getRuleName());
        ra.setRuleVersion(getVersion());
        ra.setSeverity("CRITICAL");
        ra.setTriggered(match);

        if (match) {
            ra.setExplanation("CRITICAL RISK: Solicitation requests trading account credentials, OTP sharing, or remote desktop software installation (e.g. AnyDesk/TeamViewer). SEBI-regulated intermediaries are strictly barred from demanding account credentials.");
            ra.setEvidenceRef("Demands for user credential disclosure or remote device management");
        } else {
            ra.setExplanation("No credential-harvesting indicators or remote desktop access demands detected.");
        }

        return ra;
    }
}
