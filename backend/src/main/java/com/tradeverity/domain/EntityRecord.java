package com.tradeverity.domain;

import java.time.OffsetDateTime;

public class EntityRecord {
    private Long entityId;
    private String entityIdentifier;
    private String displayName;
    private String entityType; // WEBSITE, APP, PHONE, EMAIL, ADVISOR, UPI, SOCIAL_ACCOUNT, REPORT
    private String maskedIdentifier;
    private String riskBand;
    private String verificationStatus;
    private Integer reputationScore;
    private Integer reportCount;
    private OffsetDateTime firstSeenAt;
    private OffsetDateTime lastSeenAt;

    public EntityRecord() {}

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getEntityIdentifier() { return entityIdentifier; }
    public void setEntityIdentifier(String entityIdentifier) { this.entityIdentifier = entityIdentifier; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getMaskedIdentifier() { return maskedIdentifier; }
    public void setMaskedIdentifier(String maskedIdentifier) { this.maskedIdentifier = maskedIdentifier; }

    public String getRiskBand() { return riskBand; }
    public void setRiskBand(String riskBand) { this.riskBand = riskBand; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Integer getReputationScore() { return reputationScore; }
    public void setReputationScore(Integer reputationScore) { this.reputationScore = reputationScore; }

    public Integer getReportCount() { return reportCount; }
    public void setReportCount(Integer reportCount) { this.reportCount = reportCount; }

    public OffsetDateTime getFirstSeenAt() { return firstSeenAt; }
    public void setFirstSeenAt(OffsetDateTime firstSeenAt) { this.firstSeenAt = firstSeenAt; }

    public OffsetDateTime getLastSeenAt() { return lastSeenAt; }
    public void setLastSeenAt(OffsetDateTime lastSeenAt) { this.lastSeenAt = lastSeenAt; }
}
