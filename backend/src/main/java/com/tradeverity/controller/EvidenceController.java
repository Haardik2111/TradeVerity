package com.tradeverity.controller;

import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.dto.EvidenceSubmissionDto;
import com.tradeverity.repository.EvidenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cases/{caseId}/evidence")
public class EvidenceController {

    private final EvidenceRepository evidenceRepository;

    public EvidenceController(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    @GetMapping
    public ResponseEntity<List<EvidenceItem>> getEvidence(@PathVariable String caseId) {
        return ResponseEntity.ok(evidenceRepository.findByCaseId(caseId));
    }

    @PostMapping
    public ResponseEntity<EvidenceItem> addEvidence(@PathVariable String caseId, @RequestBody EvidenceSubmissionDto dto) {
        EvidenceItem item = new EvidenceItem();
        item.setCaseId(caseId);
        item.setEvidenceType(dto.getEvidenceType() != null ? dto.getEvidenceType() : "URL");
        item.setRawValue(dto.getRawValue());
        item.setSourceOrigin(dto.getSourceOrigin() != null ? dto.getSourceOrigin() : "Manual Ingestion");
        item.setVerificationState("PENDING");

        EvidenceItem saved = evidenceRepository.save(item);
        return ResponseEntity.ok(saved);
    }
}
