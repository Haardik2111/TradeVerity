package com.tradeverity.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CaseSubmissionDto {
    @NotBlank
    private String entityName;

    @NotBlank
    private String category;

    private String claimedOrg;
    private String registrationNo;
    private String websiteUrl;
    private String contactInfo;

    @NotBlank
    private String summaryNarrative;

    private List<EvidenceSubmissionDto> evidence;

    public CaseSubmissionDto() {}

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

    public List<EvidenceSubmissionDto> getEvidence() { return evidence; }
    public void setEvidence(List<EvidenceSubmissionDto> evidence) { this.evidence = evidence; }
}
