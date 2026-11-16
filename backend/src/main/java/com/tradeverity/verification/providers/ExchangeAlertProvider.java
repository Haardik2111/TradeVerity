package com.tradeverity.verification.providers;

import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.verification.VerificationProvider;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class ExchangeAlertProvider implements VerificationProvider {

    @Override
    public String getProviderCode() { return "NSE_ALERTS"; }

    @Override
    public String getProviderName() { return "Exchange Caution Notice Provider (NSE/BSE)"; }

    @Override
    public boolean supports(String providerCode) {
        return getProviderCode().equalsIgnoreCase(providerCode) || "EXCHANGE".equalsIgnoreCase(providerCode);
    }

    @Override
    public VerificationCheck verify(String identifier, String category) {
        VerificationCheck check = new VerificationCheck();
        check.setEntityIdentifier(identifier);
        check.setProviderName(getProviderName());
        check.setIsDemo(true);
        check.setCheckedAt(OffsetDateTime.now());

        if (identifier.toLowerCase().contains("apex") || identifier.toLowerCase().contains("vip tips")) {
            check.setOutcome("INFORMATION_MISMATCH");
            check.setExplanation("Entity name is cataloged in recent exchange caution circulars warning against unauthorized dabba trading or social-media stock tip schemes.");
        } else {
            check.setOutcome("VERIFIED_REFERENCE");
            check.setExplanation("No cautionary alerts issued by exchange surveillance teams for this entity identifier.");
        }

        return check;
    }
}
