package com.tradeverity.controller;

import com.tradeverity.analysis.FraudRuleEngine;
import com.tradeverity.correlation.CorrelationEngine;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.dto.ApiResponse;
import com.tradeverity.dto.CaseSubmissionDto;
import com.tradeverity.dto.EvidenceSubmissionDto;
import com.tradeverity.events.AnalysisCompletedEvent;
import com.tradeverity.events.CaseSubmittedEvent;
import com.tradeverity.repository.*;
import com.tradeverity.security.SecurityContextHelper;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/cases")
public class CaseController {

    private final CaseReportRepository caseReportRepository;
    private final EvidenceRepository evidenceRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final VerificationRepository verificationRepository;
    private final ReviewerNoteRepository reviewerNoteRepository;
    private final FraudRuleEngine fraudRuleEngine;
    private final CorrelationEngine correlationEngine;
    private final SecurityContextHelper securityContextHelper;
    private final ApplicationEventPublisher eventPublisher;

    public CaseController(CaseReportRepository caseReportRepository,
                          EvidenceRepository evidenceRepository,
                          RiskAssessmentRepository riskAssessmentRepository,
                          VerificationRepository verificationRepository,
                          ReviewerNoteRepository reviewerNoteRepository,
                          FraudRuleEngine fraudRuleEngine,
                          CorrelationEngine correlationEngine,
                          SecurityContextHelper securityContextHelper,
                          ApplicationEventPublisher eventPublisher) {
        this.caseReportRepository = caseReportRepository;
        this.evidenceRepository = evidenceRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.verificationRepository = verificationRepository;
        this.reviewerNoteRepository = reviewerNoteRepository;
        this.fraudRuleEngine = fraudRuleEngine;
        this.correlationEngine = correlationEngine;
        this.securityContextHelper = securityContextHelper;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping
    public ResponseEntity<List<CaseReport>> getCases(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String riskBand,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(caseReportRepository.findAll(category, status, riskBand, search));
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<Map<String, Object>> getCaseById(@PathVariable String caseId) {
        Optional<CaseReport> caseOpt = caseReportRepository.findById(caseId);
        if (caseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CaseReport caseReport = caseOpt.get();
        List<EvidenceItem> evidence = evidenceRepository.findByCaseId(caseId);
        List<RiskAssessment> assessments = riskAssessmentRepository.findByCaseId(caseId);
        var verificationChecks = verificationRepository.findByCaseId(caseId);
        var reviewerNotes = reviewerNoteRepository.findByCaseId(caseId);

        Map<String, Object> response = new HashMap<>();
        response.put("caseReport", caseReport);
        response.put("evidence", evidence);
        response.put("assessments", assessments);
        response.put("verificationChecks", verificationChecks);
        response.put("reviewerNotes", reviewerNotes);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CaseReport> submitCase(@Valid @RequestBody CaseSubmissionDto dto) {
        String caseId = "CRV-2026-" + (1000 + new Random().nextInt(9000));
        Long currentUserId = securityContextHelper.getCurrentUserId();

        CaseReport report = new CaseReport();
        report.setCaseId(caseId);
        report.setUserId(currentUserId != null ? currentUserId : 1L);
        report.setEntityName(dto.getEntityName());
        report.setCategory(dto.getCategory());
        report.setClaimedOrg(dto.getClaimedOrg());
        report.setRegistrationNo(dto.getRegistrationNo());
        report.setWebsiteUrl(dto.getWebsiteUrl());
        report.setContactInfo(dto.getContactInfo());
        report.setSummaryNarrative(dto.getSummaryNarrative());
        report.setStatus("PROCESSING");
        report.setRiskBand("NEEDS_REVIEW");
        report.setRiskScore(50);
        report.setEvidenceConfidence("MEDIUM");
        report.setRelationshipConfidence("MEDIUM");
        report.setIsDemo(false);

        CaseReport saved = caseReportRepository.save(report);

        // Save submitted evidence items
        List<EvidenceItem> savedEvidence = new ArrayList<>();
        if (dto.getEvidence() != null) {
            for (EvidenceSubmissionDto evDto : dto.getEvidence()) {
                EvidenceItem item = new EvidenceItem();
                item.setCaseId(caseId);
                item.setEvidenceType(evDto.getEvidenceType() != null ? evDto.getEvidenceType() : "URL");
                item.setRawValue(evDto.getRawValue());
                item.setSourceOrigin(evDto.getSourceOrigin() != null ? evDto.getSourceOrigin() : "Investigator Submission");
                item.setVerificationState("PENDING");
                savedEvidence.add(evidenceRepository.save(item));
            }
        }

        // Fire CaseSubmittedEvent
        eventPublisher.publishEvent(new CaseSubmittedEvent(this, saved));

        // Correlate entities and run rule engine
        correlationEngine.correlateCase(saved, savedEvidence);
        fraudRuleEngine.analyzeCase(saved, savedEvidence);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{caseId}/analyze")
    public ResponseEntity<Map<String, Object>> analyzeCase(@PathVariable String caseId) {
        Optional<CaseReport> caseOpt = caseReportRepository.findById(caseId);
        if (caseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CaseReport caseReport = caseOpt.get();
        List<EvidenceItem> evidence = evidenceRepository.findByCaseId(caseId);
        List<RiskAssessment> assessments = fraudRuleEngine.analyzeCase(caseReport, evidence);
        correlationEngine.correlateCase(caseReport, evidence);

        eventPublisher.publishEvent(new AnalysisCompletedEvent(this, caseReport));

        Map<String, Object> result = new HashMap<>();
        result.put("caseReport", caseReport);
        result.put("assessments", assessments);

        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{caseId}/status")
    public ResponseEntity<CaseReport> updateStatus(@PathVariable String caseId, @RequestBody Map<String, String> body) {
        Optional<CaseReport> caseOpt = caseReportRepository.findById(caseId);
        if (caseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CaseReport report = caseOpt.get();
        if (body.containsKey("status")) {
            report.setStatus(body.get("status"));
        }
        if (body.containsKey("riskBand")) {
            report.setRiskBand(body.get("riskBand"));
        }
        caseReportRepository.save(report);

        return ResponseEntity.ok(report);
    }
}
