package com.tradeverity.controller;

import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.domain.VerificationCheck;
import com.tradeverity.reporting.PdfReportService;
import com.tradeverity.repository.CaseReportRepository;
import com.tradeverity.repository.EvidenceRepository;
import com.tradeverity.repository.RiskAssessmentRepository;
import com.tradeverity.repository.VerificationRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final CaseReportRepository caseReportRepository;
    private final EvidenceRepository evidenceRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final VerificationRepository verificationRepository;
    private final PdfReportService pdfReportService;

    public ReportController(CaseReportRepository caseReportRepository,
                            EvidenceRepository evidenceRepository,
                            RiskAssessmentRepository riskAssessmentRepository,
                            VerificationRepository verificationRepository,
                            PdfReportService pdfReportService) {
        this.caseReportRepository = caseReportRepository;
        this.evidenceRepository = evidenceRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.verificationRepository = verificationRepository;
        this.pdfReportService = pdfReportService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listReports() {
        List<CaseReport> cases = caseReportRepository.findAll(null, null, null, null);
        List<Map<String, Object>> reports = new ArrayList<>();

        for (CaseReport c : cases) {
            Map<String, Object> r = new HashMap<>();
            r.put("reportId", "REP-" + c.getCaseId().replace("CRV-", "") + "-A");
            r.put("caseId", c.getCaseId());
            r.put("entityName", c.getEntityName());
            r.put("riskBand", c.getRiskBand());
            r.put("generatedAt", c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : c.getCreatedAt().toString());
            r.put("fileSize", (220 + (c.getCaseId().hashCode() % 80)) + " KB");
            reports.add(r);
        }

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{caseId}/download")
    public ResponseEntity<byte[]> downloadPdfReport(@PathVariable String caseId) {
        Optional<CaseReport> caseOpt = caseReportRepository.findById(caseId);
        if (caseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CaseReport caseReport = caseOpt.get();
        List<EvidenceItem> evidence = evidenceRepository.findByCaseId(caseId);
        List<RiskAssessment> assessments = riskAssessmentRepository.findByCaseId(caseId);
        List<VerificationCheck> checks = verificationRepository.findByCaseId(caseId);

        byte[] pdfBytes = pdfReportService.generateReport(caseReport, evidence, assessments, checks);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "TradeVerity-Dossier-" + caseId + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdfBytes);
    }
}
