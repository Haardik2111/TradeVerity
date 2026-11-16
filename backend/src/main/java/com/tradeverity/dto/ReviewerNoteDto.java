package com.tradeverity.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewerNoteDto {
    @NotBlank
    private String noteContent;

    private String decision;

    public ReviewerNoteDto() {}

    public String getNoteContent() { return noteContent; }
    public void setNoteContent(String noteContent) { this.noteContent = noteContent; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
}
