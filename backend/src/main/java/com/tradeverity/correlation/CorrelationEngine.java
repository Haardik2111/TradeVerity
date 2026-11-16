package com.tradeverity.correlation;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EntityLink;
import com.tradeverity.domain.EntityRecord;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.repository.EntityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CorrelationEngine {
    private static final Logger log = LoggerFactory.getLogger(CorrelationEngine.class);

    private final EntityRepository entityRepository;
    private final NormalizationService normalizationService;

    public CorrelationEngine(EntityRepository entityRepository, NormalizationService normalizationService) {
        this.entityRepository = entityRepository;
        this.normalizationService = normalizationService;
    }

    public void correlateCase(CaseReport caseReport, List<EvidenceItem> evidence) {
        // Step 1: Ensure primary entity record exists
        String primaryIdentifier = normalizationService.normalizeIdentifier(
            caseReport.getWebsiteUrl() != null ? caseReport.getWebsiteUrl() : caseReport.getEntityName(),
            "WEBSITE"
        );

        EntityRecord primaryEntity = new EntityRecord();
        primaryEntity.setEntityIdentifier(primaryIdentifier);
        primaryEntity.setDisplayName(caseReport.getEntityName());
        primaryEntity.setEntityType(resolveEntityType(caseReport.getCategory()));
        primaryEntity.setMaskedIdentifier(primaryIdentifier);
        primaryEntity.setRiskBand(caseReport.getRiskBand());
        primaryEntity.setVerificationStatus(caseReport.getRiskScore() > 70 ? "FLAGGED" : "PENDING");
        primaryEntity.setReputationScore(100 - caseReport.getRiskScore());
        primaryEntity = entityRepository.saveEntity(primaryEntity);

        // Step 2: Correlate each evidence item
        for (EvidenceItem item : evidence) {
            String norm = normalizationService.normalizeIdentifier(item.getRawValue(), item.getEvidenceType());
            if (norm.isEmpty()) continue;

            item.setNormalizedValue(norm);
            item.setMaskedValue(normalizationService.maskIdentifier(norm, item.getEvidenceType()));

            Optional<EntityRecord> existingTarget = entityRepository.findByIdentifier(norm);
            EntityRecord targetEntity;

            if (existingTarget.isPresent()) {
                targetEntity = existingTarget.get();
                // Create relationship link
                EntityLink link = new EntityLink();
                link.setSourceEntityId(primaryEntity.getEntityId());
                link.setTargetEntityId(targetEntity.getEntityId());
                link.setRelationshipType(resolveRelationshipType(item.getEvidenceType()));
                link.setRelationshipLabel("Shared reported " + item.getEvidenceType() + " in " + caseReport.getCaseId());
                link.setConfidenceScore(BigDecimal.valueOf(0.85));
                link.setStatus("ACCEPTED");
                link.setCaseId(caseReport.getCaseId());
                entityRepository.saveLink(link);
                log.info("Correlated link created between {} and {}", primaryEntity.getDisplayName(), targetEntity.getDisplayName());
            } else {
                targetEntity = new EntityRecord();
                targetEntity.setEntityIdentifier(norm);
                targetEntity.setDisplayName(item.getMaskedValue() != null ? item.getMaskedValue() : norm);
                targetEntity.setEntityType(resolveEntityType(item.getEvidenceType()));
                targetEntity.setMaskedIdentifier(item.getMaskedValue());
                targetEntity.setRiskBand(caseReport.getRiskBand());
                targetEntity.setVerificationStatus("UNVERIFIED");
                targetEntity.setReputationScore(50);
                targetEntity = entityRepository.saveEntity(targetEntity);

                EntityLink link = new EntityLink();
                link.setSourceEntityId(primaryEntity.getEntityId());
                link.setTargetEntityId(targetEntity.getEntityId());
                link.setRelationshipType("EVIDENCE_LINK");
                link.setRelationshipLabel("Associated " + item.getEvidenceType());
                link.setConfidenceScore(BigDecimal.valueOf(0.90));
                link.setStatus("ACCEPTED");
                link.setCaseId(caseReport.getCaseId());
                entityRepository.saveLink(link);
            }
        }
    }

    private String resolveEntityType(String categoryOrType) {
        if (categoryOrType == null) return "WEBSITE";
        String s = categoryOrType.toUpperCase();
        if (s.contains("UPI")) return "UPI";
        if (s.contains("PHONE")) return "PHONE";
        if (s.contains("ADVISOR")) return "ADVISOR";
        if (s.contains("APP")) return "APP";
        return "WEBSITE";
    }

    private String resolveRelationshipType(String evidenceType) {
        if ("PAYMENT_UPI".equalsIgnoreCase(evidenceType)) return "EVIDENCE_LINK";
        if ("PHONE_NUMBER".equalsIgnoreCase(evidenceType)) return "SHARED_CONTACT";
        return "CO_REPORTED_INDICATOR";
    }
}
