package com.tradeverity.dto;

import jakarta.validation.constraints.NotBlank;

public class LinkDecisionDto {
    @NotBlank
    private String decision; // ACCEPTED, REJECTED

    public LinkDecisionDto() {}

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
}
