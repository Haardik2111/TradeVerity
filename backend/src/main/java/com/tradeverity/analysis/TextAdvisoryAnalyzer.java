package com.tradeverity.analysis;

import com.tradeverity.domain.EvidenceItem;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TextAdvisoryAnalyzer implements EvidenceAnalyzer {

    private static final Pattern UPI_PATTERN = Pattern.compile("[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?91[\\-\\s]?)?[6-9]\\d{9}");

    @Override
    public boolean supports(String evidenceType) {
        return "MESSAGE_TEXT".equalsIgnoreCase(evidenceType) || "DOCUMENT".equalsIgnoreCase(evidenceType);
    }

    @Override
    public void analyze(EvidenceItem item) {
        String raw = item.getRawValue();
        if (raw == null || raw.trim().isEmpty()) return;

        item.setNormalizedValue(raw.trim());
        item.setMaskedValue(raw.length() > 80 ? raw.substring(0, 80) + "..." : raw);

        // Detect embedded UPI or Phone in message
        Matcher upiMatcher = UPI_PATTERN.matcher(raw);
        if (upiMatcher.find()) {
            item.setVerificationState("CONTAINS_EMBEDDED_UPI");
        } else {
            item.setVerificationState("ANALYZED");
        }
    }
}
