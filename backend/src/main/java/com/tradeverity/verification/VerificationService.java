package com.tradeverity.verification;

import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.repository.VerificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificationService {

    private final List<VerificationProvider> providers;
    private final VerificationRepository verificationRepository;

    public VerificationService(List<VerificationProvider> providers, VerificationRepository verificationRepository) {
        this.providers = providers;
        this.verificationRepository = verificationRepository;
    }

    public VerificationCheck performCheck(String identifier, String category, String providerCode) {
        VerificationProvider selected = null;

        if (providerCode != null) {
            for (VerificationProvider p : providers) {
                if (p.supports(providerCode)) {
                    selected = p;
                    break;
                }
            }
        }

        if (selected == null) {
            // Default to SEBI registry provider
            selected = providers.get(0);
        }

        VerificationCheck check = selected.verify(identifier, category);
        return verificationRepository.save(check);
    }

    public List<VerificationCheck> getRecentHistory() {
        return verificationRepository.findAllRecent(25);
    }

    public List<VerificationCheck> getCaseChecks(String caseId) {
        return verificationRepository.findByCaseId(caseId);
    }
}
