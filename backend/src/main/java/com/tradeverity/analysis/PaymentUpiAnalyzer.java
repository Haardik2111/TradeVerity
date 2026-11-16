package com.tradeverity.analysis;

import com.tradeverity.domain.EvidenceItem;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class PaymentUpiAnalyzer implements EvidenceAnalyzer {

    @Override
    public boolean supports(String evidenceType) {
        return "PAYMENT_UPI".equalsIgnoreCase(evidenceType) || "UPI".equalsIgnoreCase(evidenceType);
    }

    @Override
    public void analyze(EvidenceItem item) {
        String raw = item.getRawValue();
        if (raw == null || raw.trim().isEmpty()) return;

        String clean = raw.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", "");
        item.setNormalizedValue(clean);

        // Masking identifier: e.g. dhanvridhi.pay@okfictiobank -> dhanvridhi.***@okfictiobank
        int atIndex = clean.indexOf('@');
        if (atIndex > 3) {
            String prefix = clean.substring(0, atIndex);
            String domain = clean.substring(atIndex);
            String masked = prefix.substring(0, Math.min(6, prefix.length())) + "***" + domain;
            item.setMaskedValue(masked);
        } else {
            item.setMaskedValue(clean);
        }

        item.setVerificationState("FLAGGED_PAYMENT_TARGET");
    }
}
