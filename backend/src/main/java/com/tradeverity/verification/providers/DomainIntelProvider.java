package com.tradeverity.verification.providers;

import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.verification.VerificationProvider;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class DomainIntelProvider implements VerificationProvider {

    @Override
    public String getProviderCode() { return "WHOIS_INTEL"; }

    @Override
    public String getProviderName() { return "Domain WHOIS & Fast-Flux Telemetry Provider"; }

    @Override
    public boolean supports(String providerCode) {
        return getProviderCode().equalsIgnoreCase(providerCode) || "WHOIS".equalsIgnoreCase(providerCode);
    }

    @Override
    public VerificationCheck verify(String identifier, String category) {
        VerificationCheck check = new VerificationCheck();
        check.setEntityIdentifier(identifier);
        check.setProviderName(getProviderName());
        check.setIsDemo(true);
        check.setCheckedAt(OffsetDateTime.now());

        if (identifier.endsWith(".online") || identifier.endsWith(".site") || identifier.endsWith(".cc")) {
            check.setOutcome("REQUIRES_MANUAL_REVIEW");
            check.setExplanation("RDAP records indicate domain was registered within 45 days through privacy proxy with nameservers hosted on bulletproof dynamic DNS infrastructure.");
        } else {
            check.setOutcome("VERIFIED_REFERENCE");
            check.setExplanation("Domain demonstrates established DNS historical longevity and authentic commercial registrant records.");
        }

        return check;
    }
}
