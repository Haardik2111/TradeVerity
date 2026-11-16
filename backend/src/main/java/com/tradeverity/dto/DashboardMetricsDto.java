package com.tradeverity.dto;

import java.util.List;
import java.util.Map;

public class DashboardMetricsDto {
    private long totalInvestigations;
    private long highAttentionCases;
    private long verifiedEntities;
    private long pendingReviews;
    private Map<String, Integer> threatDistribution;
    private List<RecentActivityItem> recentActivities;

    public DashboardMetricsDto() {}

    public static class RecentActivityItem {
        private String id;
        private String type;
        private String title;
        private String detail;
        private String timestamp;
        private String badge;

        public RecentActivityItem() {}

        public RecentActivityItem(String id, String type, String title, String detail, String timestamp, String badge) {
            this.id = id;
            this.type = type;
            this.title = title;
            this.detail = detail;
            this.timestamp = timestamp;
            this.badge = badge;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getBadge() { return badge; }
        public void setBadge(String badge) { this.badge = badge; }
    }

    public long getTotalInvestigations() { return totalInvestigations; }
    public void setTotalInvestigations(long totalInvestigations) { this.totalInvestigations = totalInvestigations; }

    public long getHighAttentionCases() { return highAttentionCases; }
    public void setHighAttentionCases(long highAttentionCases) { this.highAttentionCases = highAttentionCases; }

    public long getVerifiedEntities() { return verifiedEntities; }
    public void setVerifiedEntities(long verifiedEntities) { this.verifiedEntities = verifiedEntities; }

    public long getPendingReviews() { return pendingReviews; }
    public void setPendingReviews(long pendingReviews) { this.pendingReviews = pendingReviews; }

    public Map<String, Integer> getThreatDistribution() { return threatDistribution; }
    public void setThreatDistribution(Map<String, Integer> threatDistribution) { this.threatDistribution = threatDistribution; }

    public List<RecentActivityItem> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<RecentActivityItem> recentActivities) { this.recentActivities = recentActivities; }
}
