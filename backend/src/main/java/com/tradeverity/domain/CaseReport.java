package com.tradeverity.domain;

import java.time.OffsetDateTime;

public class CaseReport {
    private String caseId;
    private Long userId;
    private String entityName;
    private String category;
    private String claimedOrg;
    private String registrationNo;
    private String websiteUrl;
    private String contactInfo;
    private String summaryNarrative;
    private String status; // SUBMITTED, PROCESSING, COMPLETED, NEEDS_REVIEW, FAILED
    private String riskBand; // LOW_INDICATORS, NEEDS_REVIEW, HIGH_ATTENTION
    private Integer riskScore;
    private String evidenceConfidence; // LOW, MEDIUM, HIGH
    private String relationshipConfidence; // LOW, MEDIUM, HIGH
    private Boolean isDemo;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public CaseReport() {}

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getClaimedOrg() { return claimedOrg; }
    public void setClaimedOrg(String claimedOrg) { this.claimedOrg = claimedOrg; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getSummaryNarrative() { return summaryNarrative; }
    public void setSummaryNarrative(String summaryNarrative) { this.summaryNarrative = summaryNarrative; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRiskBand() { return riskBand; }
    public void setRiskBand(String riskBand) { this.riskBand = riskBand; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getEvidenceConfidence() { return evidenceConfidence; }
    public void setEvidenceConfidence(String evidenceConfidence) { this.evidenceConfidence = evidenceConfidence; }

    public String getRelationshipConfidence() { return relationshipConfidence; }
    public void setRelationshipConfidence(String relationshipConfidence) { this.relationshipConfidence = relationshipConfidence; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean isDemo) { this.isDemo = isDemo; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
