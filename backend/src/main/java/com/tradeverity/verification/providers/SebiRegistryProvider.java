package com.tradeverity.verification.providers;

import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.verification.VerificationProvider;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Locale;

@Component
public class SebiRegistryProvider implements VerificationProvider {

    @Override
    public String getProviderCode() { return "SEBI_REG"; }

    @Override
    public String getProviderName() { return "SEBI Intermediary Registry Provider"; }

    @Override
    public boolean supports(String providerCode) {
        return getProviderCode().equalsIgnoreCase(providerCode) || "SEBI".equalsIgnoreCase(providerCode);
    }

    @Override
    public VerificationCheck verify(String identifier, String category) {
        VerificationCheck check = new VerificationCheck();
        check.setEntityIdentifier(identifier);
        check.setProviderName(getProviderName());
        check.setIsDemo(true);
        check.setCheckedAt(OffsetDateTime.now());

        String clean = identifier.toUpperCase(Locale.ROOT).trim();

        if (clean.contains("INZ000214838") || clean.contains("BLUEPEAK")) {
            check.setOutcome("VERIFIED_REFERENCE");
            check.setExplanation("Registration code verified active in regulatory benchmark database: BluePeak Capital India Advisory LLP holds valid Stock Broker credentials.");
        } else if (clean.contains("INA00009871")) {
            check.setOutcome("INFORMATION_MISMATCH");
            check.setExplanation("Reference database records confirm registration number INA00009871 was issued to an independent RIA in Mumbai, but is falsely claimed by 'Apex Alpha'.");
        } else if (clean.contains("SHARENIDHI")) {
            check.setOutcome("NO_MATCH_FOUND");
            check.setExplanation("No registered stock broker, investment advisor, or research analyst record found under 'ShareNidhi'.");
        } else if (clean.contains("VANGUARD")) {
            check.setOutcome("INFORMATION_MISMATCH");
            check.setExplanation("Official registry lists international institutional entities, but no domestic VIP Telegram tips channel holds valid credentials under this trademark.");
        } else {
            check.setOutcome("NO_MATCH_FOUND");
            check.setExplanation("No matching intermediary record located in the reference database for identifier: " + identifier);
        }

        return check;
    }
}
