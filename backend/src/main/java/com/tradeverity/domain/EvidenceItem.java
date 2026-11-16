package com.tradeverity.domain;

import java.time.OffsetDateTime;

public class EvidenceItem {
    private Long evidenceId;
    private String caseId;
    private String evidenceType; // URL, SCREENSHOT, MESSAGE_TEXT, PAYMENT_UPI, PHONE_NUMBER, REGISTRATION_NO, DOCUMENT
    private String rawValue;
    private String maskedValue;
    private String normalizedValue;
    private String sourceOrigin;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private String verificationState; // PENDING, VERIFIED_FLAGGED, UNVERIFIED_MISMATCH, CLEARED
    private OffsetDateTime createdAt;

    public EvidenceItem() {}

    public Long getEvidenceId() { return evidenceId; }
    public void setEvidenceId(Long evidenceId) { this.evidenceId = evidenceId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getRawValue() { return rawValue; }
    public void setRawValue(String rawValue) { this.rawValue = rawValue; }

    public String getMaskedValue() { return maskedValue; }
    public void setMaskedValue(String maskedValue) { this.maskedValue = maskedValue; }

    public String getNormalizedValue() { return normalizedValue; }
    public void setNormalizedValue(String normalizedValue) { this.normalizedValue = normalizedValue; }

    public String getSourceOrigin() { return sourceOrigin; }
    public void setSourceOrigin(String sourceOrigin) { this.sourceOrigin = sourceOrigin; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getVerificationState() { return verificationState; }
    public void setVerificationState(String verificationState) { this.verificationState = verificationState; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
