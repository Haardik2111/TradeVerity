package com.tradeverity.domain;

import java.time.OffsetDateTime;

public class SourceRecord {
    private Long sourceId;
    private String sourceCode;
    private String sourceName;
    private String sourceUrl;
    private String category;
    private String dataFreshness; // LIVE, CACHED, DEMO, UNAVAILABLE, STALE
    private String status; // LIVE, CACHED, DEMO, UNAVAILABLE, STALE
    private String datasetVersion;
    private OffsetDateTime lastCheckedAt;
    private OffsetDateTime createdAt;

    public SourceRecord() {}

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDataFreshness() { return dataFreshness; }
    public void setDataFreshness(String dataFreshness) { this.dataFreshness = dataFreshness; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDatasetVersion() { return datasetVersion; }
    public void setDatasetVersion(String datasetVersion) { this.datasetVersion = datasetVersion; }

    public OffsetDateTime getLastCheckedAt() { return lastCheckedAt; }
    public void setLastCheckedAt(OffsetDateTime lastCheckedAt) { this.lastCheckedAt = lastCheckedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
