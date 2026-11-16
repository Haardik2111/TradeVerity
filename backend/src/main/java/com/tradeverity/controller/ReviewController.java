package com.tradeverity.controller;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.ReviewerNote;
import com.tradeverity.dto.LinkDecisionDto;
import com.tradeverity.dto.ReviewerNoteDto;
import com.tradeverity.events.ReviewerActionEvent;
import com.tradeverity.repository.CaseReportRepository;
import com.tradeverity.repository.EntityRepository;
import com.tradeverity.repository.ReviewerNoteRepository;
import com.tradeverity.security.SecurityContextHelper;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/review")
public class ReviewController {

    private final CaseReportRepository caseReportRepository;
    private final ReviewerNoteRepository reviewerNoteRepository;
    private final EntityRepository entityRepository;
    private final SecurityContextHelper securityContextHelper;
    private final ApplicationEventPublisher eventPublisher;

    public ReviewController(CaseReportRepository caseReportRepository,
                            ReviewerNoteRepository reviewerNoteRepository,
                            EntityRepository entityRepository,
                            SecurityContextHelper securityContextHelper,
                            ApplicationEventPublisher eventPublisher) {
        this.caseReportRepository = caseReportRepository;
        this.reviewerNoteRepository = reviewerNoteRepository;
        this.entityRepository = entityRepository;
        this.securityContextHelper = securityContextHelper;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/queue")
    public ResponseEntity<List<CaseReport>> getReviewQueue() {
        return ResponseEntity.ok(caseReportRepository.findPendingReviewQueue());
    }

    @PostMapping("/{caseId}/notes")
    public ResponseEntity<ReviewerNote> addNote(@PathVariable String caseId, @Valid @RequestBody ReviewerNoteDto dto) {
        var user = securityContextHelper.getCurrentUser();

        ReviewerNote note = new ReviewerNote();
        note.setCaseId(caseId);
        note.setReviewerId(user.map(u -> u.getUserId()).orElse(1L));
        note.setReviewerName(user.map(u -> u.getFullName()).orElse("Arjun Mehta (RedTeam)"));
        note.setDecision(dto.getDecision() != null ? dto.getDecision() : "CONFIRMED_HIGH_RISK");
        note.setNoteContent(dto.getNoteContent());

        ReviewerNote saved = reviewerNoteRepository.save(note);
        eventPublisher.publishEvent(new ReviewerActionEvent(this, saved));

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{caseId}/links/{linkId}/decision")
    public ResponseEntity<Void> decideLink(@PathVariable String caseId, @PathVariable Long linkId, @Valid @RequestBody LinkDecisionDto dto) {
        entityRepository.updateLinkStatus(linkId, dto.getDecision());
        return ResponseEntity.ok().build();
    }
}
