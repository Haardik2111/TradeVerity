package com.tradeverity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserBootstrapDto {
    @NotBlank
    private String uid;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String displayName;

    private String role; // INVESTOR (default), REVIEWER, ADMIN
    private String photoUrl;

    public UserBootstrapDto() {}

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
