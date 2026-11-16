package com.tradeverity.analysis;

import com.tradeverity.domain.EvidenceItem;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Locale;

@Component
public class UrlAnalyzer implements EvidenceAnalyzer {

    @Override
    public boolean supports(String evidenceType) {
        return "URL".equalsIgnoreCase(evidenceType) || "WEBSITE".equalsIgnoreCase(evidenceType);
    }

    @Override
    public void analyze(EvidenceItem item) {
        String raw = item.getRawValue();
        if (raw == null || raw.trim().isEmpty()) return;

        try {
            String clean = raw.trim().toLowerCase(Locale.ROOT);
            if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
                clean = "https://" + clean;
            }
            URI uri = URI.create(clean);
            String host = uri.getHost();
            if (host != null) {
                if (host.startsWith("www.")) {
                    host = host.substring(4);
                }
                item.setNormalizedValue(host);
                item.setMaskedValue(host);
                
                // Fast heuristic check on domain extensions
                if (host.endsWith(".site") || host.endsWith(".online") || host.endsWith(".cc") || host.endsWith(".top") || host.endsWith(".vip")) {
                    item.setVerificationState("SUSPICIOUS_TLD");
                } else {
                    item.setVerificationState("NORMALIZED");
                }
            }
        } catch (Exception e) {
            item.setNormalizedValue(raw.trim());
            item.setMaskedValue(raw.trim());
            item.setVerificationState("PARSE_ERROR");
        }
    }
}
