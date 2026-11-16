package com.tradeverity.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class EntityLink {
    private Long linkId;
    private Long sourceEntityId;
    private Long targetEntityId;
    private String relationshipType; // SHARED_CONTACT, SIMILAR_DOMAIN, CO_REPORTED_INDICATOR, MENTIONED_IN_CAMPAIGN, EVIDENCE_LINK, CLAIMED_ORG
    private String relationshipLabel;
    private BigDecimal confidenceScore;
    private String status; // SUGGESTED, ACCEPTED, REJECTED
    private String caseId;
    private OffsetDateTime createdAt;

    public EntityLink() {}

    public Long getLinkId() { return linkId; }
    public void setLinkId(Long linkId) { this.linkId = linkId; }

    public Long getSourceEntityId() { return sourceEntityId; }
    public void setSourceEntityId(Long sourceEntityId) { this.sourceEntityId = sourceEntityId; }

    public Long getTargetEntityId() { return targetEntityId; }
    public void setTargetEntityId(Long targetEntityId) { this.targetEntityId = targetEntityId; }

    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }

    public String getRelationshipLabel() { return relationshipLabel; }
    public void setRelationshipLabel(String relationshipLabel) { this.relationshipLabel = relationshipLabel; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
