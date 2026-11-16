package com.tradeverity.analysis.rules;

import com.tradeverity.analysis.RiskRule;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
public class UrgentPaymentPressureRule implements RiskRule {

    @Override
    public String getRuleId() { return "RULE-02"; }

    @Override
    public String getRuleName() { return "Urgent Investment & Direct Payment Solicitation"; }

    @Override
    public String getVersion() { return "1.0.0"; }

    @Override
    public RiskAssessment evaluate(CaseReport caseReport, List<EvidenceItem> evidence) {
        String text = (caseReport.getSummaryNarrative() + " " + caseReport.getContactInfo()).toLowerCase(Locale.ROOT);
        boolean hasUpi = false;

        for (EvidenceItem item : evidence) {
            if ("PAYMENT_UPI".equalsIgnoreCase(item.getEvidenceType())) {
                hasUpi = true;
            }
            if (item.getRawValue() != null) {
                text += " " + item.getRawValue().toLowerCase(Locale.ROOT);
            }
        }

        boolean pressure = text.contains("urgent") || 
                           text.contains("limited seats") || 
                           text.contains("immediate transfer") || 
                           text.contains("within 10 min") ||
                           text.contains("deposit now") ||
                           text.contains("@ok") ||
                           hasUpi;

        RiskAssessment ra = new RiskAssessment();
        ra.setCaseId(caseReport.getCaseId());
        ra.setRuleId(getRuleId());
        ra.setRuleName(getRuleName());
        ra.setRuleVersion(getVersion());
        ra.setSeverity("HIGH");
        ra.setTriggered(pressure);

        if (pressure) {
            ra.setExplanation("Submission describes high-urgency transfer pressure or requests remittance directly to private/merchant UPI VPAs rather than SEBI-mandated clearing corporation escrow accounts.");
            ra.setEvidenceRef(hasUpi ? "Direct UPI remittance handle embedded in submission" : "High-pressure urgency markers detected");
        } else {
            ra.setExplanation("No anomalous payment urgency or non-standard fund transfer demands identified.");
        }

        return ra;
    }
}
