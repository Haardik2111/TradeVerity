package com.tradeverity.dto;

import jakarta.validation.constraints.NotBlank;

public class VerificationRequestDto {
    @NotBlank
    private String entityIdentifier;

    private String category;
    private String provider;

    public VerificationRequestDto() {}

    public String getEntityIdentifier() { return entityIdentifier; }
    public void setEntityIdentifier(String entityIdentifier) { this.entityIdentifier = entityIdentifier; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
}
