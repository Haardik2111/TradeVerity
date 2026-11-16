package com.tradeverity.dto;

public class EvidenceSubmissionDto {
    private String evidenceType;
    private String rawValue;
    private String sourceOrigin;

    public EvidenceSubmissionDto() {}

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getRawValue() { return rawValue; }
    public void setRawValue(String rawValue) { this.rawValue = rawValue; }

    public String getSourceOrigin() { return sourceOrigin; }
    public void setSourceOrigin(String sourceOrigin) { this.sourceOrigin = sourceOrigin; }
}
