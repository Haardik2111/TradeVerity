package com.tradeverity.verification.providers;

import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.verification.VerificationProvider;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class RbiSachetProvider implements VerificationProvider {

    @Override
    public String getProviderCode() { return "RBI_SACHET"; }

    @Override
    public String getProviderName() { return "RBI Sachet Fraud Portal Provider"; }

    @Override
    public boolean supports(String providerCode) {
        return getProviderCode().equalsIgnoreCase(providerCode) || "SACHET".equalsIgnoreCase(providerCode);
    }

    @Override
    public VerificationCheck verify(String identifier, String category) {
        VerificationCheck check = new VerificationCheck();
        check.setEntityIdentifier(identifier);
        check.setProviderName(getProviderName());
        check.setIsDemo(true);
        check.setCheckedAt(OffsetDateTime.now());

        if (identifier.toLowerCase().contains("dhanvridhi") || identifier.toLowerCase().contains("sharenidhi")) {
            check.setOutcome("INFORMATION_MISMATCH");
            check.setExplanation("Entity or associated UPI handle matches active complaint flags recorded on the unauthorized deposit collection repository.");
        } else {
            check.setOutcome("NO_MATCH_FOUND");
            check.setExplanation("No public alert or regulatory restriction active on the Sachet register for this entity.");
        }

        return check;
    }
}
