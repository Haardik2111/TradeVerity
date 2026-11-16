package com.tradeverity.verification;

import com.tradeverity.domain.VerificationCheck;

public interface VerificationProvider {
    String getProviderCode();
    String getProviderName();
    boolean supports(String providerCode);
    VerificationCheck verify(String identifier, String category);
}
