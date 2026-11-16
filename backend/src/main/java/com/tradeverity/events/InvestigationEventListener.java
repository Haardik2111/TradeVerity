package com.tradeverity.events;

import com.tradeverity.domain.AuditEvent;
import com.tradeverity.repository.AuditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class InvestigationEventListener {
    private static final Logger log = LoggerFactory.getLogger(InvestigationEventListener.class);

    private final AuditRepository auditRepository;

    public InvestigationEventListener(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    @EventListener
    public void onCaseSubmitted(CaseSubmittedEvent event) {
        log.info("Event received: CaseSubmitted for caseId {}", event.getCaseReport().getCaseId());
        auditRepository.log(new AuditEvent(
            event.getCaseReport().getUserId(),
            "investigator@tradeverity.system",
            "CASE_SUBMITTED",
            "CASE",
            event.getCaseReport().getCaseId(),
            "Submitted investigation for entity: " + event.getCaseReport().getEntityName(),
            "127.0.0.1"
        ));
    }

    @EventListener
    public void onAnalysisCompleted(AnalysisCompletedEvent event) {
        log.info("Event received: AnalysisCompleted for caseId {}", event.getCaseReport().getCaseId());
        auditRepository.log(new AuditEvent(
            event.getCaseReport().getUserId(),
            "rule-engine@tradeverity.system",
            "ANALYSIS_COMPLETED",
            "CASE",
            event.getCaseReport().getCaseId(),
            "Heuristic risk score computed: " + event.getCaseReport().getRiskScore() + " (" + event.getCaseReport().getRiskBand() + ")",
            "127.0.0.1"
        ));
    }

    @EventListener
    public void onReviewerAction(ReviewerActionEvent event) {
        log.info("Event received: ReviewerAction for caseId {}", event.getNote().getCaseId());
        auditRepository.log(new AuditEvent(
            event.getNote().getReviewerId(),
            event.getNote().getReviewerName(),
            "REVIEWER_DECISION",
            "CASE",
            event.getNote().getCaseId(),
            "Decision: " + event.getNote().getDecision() + " | " + event.getNote().getNoteContent(),
            "127.0.0.1"
        ));
    }
}
