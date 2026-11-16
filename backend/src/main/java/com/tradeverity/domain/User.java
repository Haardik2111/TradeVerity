package com.tradeverity.domain;

import java.time.OffsetDateTime;

public class User {
    private Long userId;
    private String firebaseUid;
    private String fullName;
    private String email;
    private String role; // INVESTOR, REVIEWER, ADMIN
    private String status; // ACTIVE, SUSPENDED
    private String photoUrl;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public User() {}

    public User(Long userId, String firebaseUid, String fullName, String email, String role, String status, String photoUrl, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.userId = userId;
        this.firebaseUid = firebaseUid;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFirebaseUid() { return firebaseUid; }
    public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
