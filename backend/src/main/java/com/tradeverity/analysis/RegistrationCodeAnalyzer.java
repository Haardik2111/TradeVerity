package com.tradeverity.analysis;

import com.tradeverity.domain.EvidenceItem;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class RegistrationCodeAnalyzer implements EvidenceAnalyzer {

    @Override
    public boolean supports(String evidenceType) {
        return "REGISTRATION_NO".equalsIgnoreCase(evidenceType) || "SEBI_ID".equalsIgnoreCase(evidenceType);
    }

    @Override
    public void analyze(EvidenceItem item) {
        String raw = item.getRawValue();
        if (raw == null || raw.trim().isEmpty()) return;

        String clean = raw.trim().toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]", "");
        item.setNormalizedValue(clean);
        item.setMaskedValue(clean);

        // Standard SEBI Intermediary prefixes: INA (Advisor), INH (Analyst), INZ (Stock Broker), INF (Mutual Fund)
        if (clean.startsWith("INA") || clean.startsWith("INH") || clean.startsWith("INZ") || clean.startsWith("INF")) {
            item.setVerificationState("FORMAT_VALID_SEBI_PREFIX");
        } else {
            item.setVerificationState("NON_STANDARD_IDENTIFIER");
        }
    }
}
