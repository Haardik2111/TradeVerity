package com.tradeverity.domain;

import java.time.OffsetDateTime;

public class VerificationCheck {
    private Long checkId;
    private String caseId;
    private String entityIdentifier;
    private Long sourceId;
    private String providerName;
    private String outcome; // VERIFIED_REFERENCE, NO_MATCH_FOUND, INFORMATION_MISMATCH, DATA_UNAVAILABLE, REQUIRES_MANUAL_REVIEW
    private String explanation;
    private String rawResponse;
    private Boolean isDemo;
    private OffsetDateTime checkedAt;

    public VerificationCheck() {}

    public Long getCheckId() { return checkId; }
    public void setCheckId(Long checkId) { this.checkId = checkId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getEntityIdentifier() { return entityIdentifier; }
    public void setEntityIdentifier(String entityIdentifier) { this.entityIdentifier = entityIdentifier; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getRawResponse() { return rawResponse; }
    public void setRawResponse(String rawResponse) { this.rawResponse = rawResponse; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean isDemo) { this.isDemo = isDemo; }

    public OffsetDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(OffsetDateTime checkedAt) { this.checkedAt = checkedAt; }
}
