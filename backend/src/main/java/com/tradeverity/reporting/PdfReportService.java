package com.tradeverity.reporting;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.tradeverity.domain.CaseReport;
import com.tradeverity.domain.EvidenceItem;
import com.tradeverity.domain.RiskAssessment;
import com.tradeverity.domain.VerificationCheck;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReportService implements ReportExporter {
    private static final Logger log = LoggerFactory.getLogger(PdfReportService.class);

    private static final Color DARK_BG = new Color(8, 12, 10);
    private static final Color PANEL_BG = new Color(18, 25, 21);
    private static final Color AMBER = new Color(226, 125, 66);
    private static final Color EMERALD = new Color(54, 185, 131);
    private static final Color TEXT_WHITE = new Color(228, 234, 229);
    private static final Color TEXT_MUTED = new Color(155, 167, 159);
    private static final Color BORDER_COLOR = new Color(40, 53, 45);

    @Override
    public byte[] generateReport(CaseReport caseReport,
                                 List<EvidenceItem> evidence,
                                 List<RiskAssessment> assessments,
                                 List<VerificationCheck> checks) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 40, 40);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Document Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, AMBER);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, TEXT_WHITE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10, TEXT_WHITE);
            Font monoFont = FontFactory.getFont(FontFactory.COURIER, 9, AMBER);
            Font mutedFont = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED);

            // 1. Header Banner
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{65, 35});

            PdfPCell leftCell = new PdfPCell();
            leftCell.setBackgroundColor(PANEL_BG);
            leftCell.setBorderColor(BORDER_COLOR);
            leftCell.setPadding(10);
            leftCell.addElement(new Paragraph("TRADEVERITY FINANCIAL INTELLIGENCE", titleFont));
            leftCell.addElement(new Paragraph("Intelligent Stock Market Fraud Detection & Investor Protection", mutedFont));
            headerTable.addCell(leftCell);

            PdfPCell rightCell = new PdfPCell();
            rightCell.setBackgroundColor(PANEL_BG);
            rightCell.setBorderColor(BORDER_COLOR);
            rightCell.setPadding(10);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(new Paragraph("CASE DOSSIER #" + caseReport.getCaseId(), monoFont));
            rightCell.addElement(new Paragraph("Classification: FORENSIC AUDIT", mutedFont));
            headerTable.addCell(rightCell);

            document.add(headerTable);
            document.add(new Paragraph(" ", mutedFont));

            // 2. Case Details Table
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{30, 70});

            addTableRow(infoTable, "Target Entity / App:", caseReport.getEntityName(), headerFont, bodyFont);
            addTableRow(infoTable, "Investigation Category:", caseReport.getCategory(), headerFont, bodyFont);
            addTableRow(infoTable, "Claimed Organization:", caseReport.getClaimedOrg() != null ? caseReport.getClaimedOrg() : "None Disclosed", headerFont, bodyFont);
            addTableRow(infoTable, "Registration Reference:", caseReport.getRegistrationNo() != null ? caseReport.getRegistrationNo() : "Unregistered", headerFont, bodyFont);
            addTableRow(infoTable, "Screening Band:", caseReport.getRiskBand().replace("_", " ") + " (Score: " + caseReport.getRiskScore() + "/100)", headerFont, monoFont);
            document.add(infoTable);

            document.add(new Paragraph(" ", mutedFont));

            // 3. Narrative Section
            Paragraph narrativeTitle = new Paragraph("REPORTED NARRATIVE & INCIDENT SUMMARY", headerFont);
            document.add(narrativeTitle);
            Paragraph narrativeText = new Paragraph(caseReport.getSummaryNarrative(), bodyFont);
            narrativeText.setSpacingAfter(10);
            document.add(narrativeText);

            // 4. Explainable Findings Table
            Paragraph findingsTitle = new Paragraph("EXPLAINABLE HEURISTIC FINDINGS (" + assessments.size() + ")", headerFont);
            findingsTitle.setSpacingAfter(6);
            document.add(findingsTitle);

            PdfPTable rulesTable = new PdfPTable(3);
            rulesTable.setWidthPercentage(100);
            rulesTable.setWidths(new float[]{20, 55, 25});

            addHeaderCell(rulesTable, "RULE ID", monoFont);
            addHeaderCell(rulesTable, "FINDING EXPLANATION", bodyFont);
            addHeaderCell(rulesTable, "SEVERITY", monoFont);

            for (RiskAssessment ra : assessments) {
                if (Boolean.TRUE.equals(ra.getTriggered())) {
                    addCell(rulesTable, ra.getRuleId(), monoFont);
                    addCell(rulesTable, ra.getExplanation(), bodyFont);
                    addCell(rulesTable, ra.getSeverity(), monoFont);
                }
            }
            document.add(rulesTable);

            document.add(new Paragraph(" ", mutedFont));

            // 5. Official Regulatory Cross-Checks
            if (!checks.isEmpty()) {
                Paragraph checksTitle = new Paragraph("OFFICIAL REFERENCE REGISTRY CROSS-CHECKS", headerFont);
                checksTitle.setSpacingAfter(6);
                document.add(checksTitle);

                PdfPTable checksTable = new PdfPTable(3);
                checksTable.setWidthPercentage(100);
                checksTable.setWidths(new float[]{30, 25, 45});

                addHeaderCell(checksTable, "PROVIDER", bodyFont);
                addHeaderCell(checksTable, "OUTCOME", monoFont);
                addHeaderCell(checksTable, "EXPLANATION", bodyFont);

                for (VerificationCheck chk : checks) {
                    addCell(checksTable, chk.getProviderName(), bodyFont);
                    addCell(checksTable, chk.getOutcome().replace("_", " "), monoFont);
                    addCell(checksTable, chk.getExplanation(), bodyFont);
                }
                document.add(checksTable);
                document.add(new Paragraph(" ", mutedFont));
            }

            // 6. Evidence Items Table
            if (!evidence.isEmpty()) {
                Paragraph evTitle = new Paragraph("CORRELATED EVIDENCE INDICATORS (MASKED)", headerFont);
                evTitle.setSpacingAfter(6);
                document.add(evTitle);

                PdfPTable evTable = new PdfPTable(3);
                evTable.setWidthPercentage(100);
                evTable.setWidths(new float[]{25, 45, 30});

                addHeaderCell(evTable, "TYPE", monoFont);
                addHeaderCell(evTable, "MASKED IDENTIFIER", monoFont);
                addHeaderCell(evTable, "STATUS", bodyFont);

                for (EvidenceItem item : evidence) {
                    addCell(evTable, item.getEvidenceType(), monoFont);
                    addCell(evTable, item.getMaskedValue() != null ? item.getMaskedValue() : item.getRawValue(), monoFont);
                    addCell(evTable, item.getVerificationState(), bodyFont);
                }
                document.add(evTable);
                document.add(new Paragraph(" ", mutedFont));
            }

            // 7. Responsible Guidance & Statutory Disclaimer
            Paragraph disclaimerTitle = new Paragraph("STATUTORY INVESTOR GUIDANCE & LIMITATIONS", headerFont);
            document.add(disclaimerTitle);

            String disclaimer = "TradeVerity operates as an evidentiary screening and public reference cross-check tool. " +
                "A screening band of HIGH ATTENTION highlights non-standard indicators (such as unregistered advisory or requests for personal UPI transfer) " +
                "and does not constitute a legal declaration of guilt. Verify all stock brokers and investment advisors through official SEBI directories (sebi.gov.in) " +
                "before transferring capital.";
            Paragraph disclaimerPara = new Paragraph(disclaimer, mutedFont);
            disclaimerPara.setSpacingBefore(4);
            document.add(disclaimerPara);

            document.close();
            log.info("PDF Dossier generated successfully for case: {}", caseReport.getCaseId());
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF report: {}", e.getMessage(), e);
            return new byte[0];
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setBackgroundColor(PANEL_BG);
        c1.setBorderColor(BORDER_COLOR);
        c1.setPadding(6);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, valueFont));
        c2.setBackgroundColor(PANEL_BG);
        c2.setBorderColor(BORDER_COLOR);
        c2.setPadding(6);
        table.addCell(c2);
    }

    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(BORDER_COLOR);
        cell.setBorderColor(DARK_BG);
        cell.setPadding(6);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(PANEL_BG);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(6);
        table.addCell(cell);
    }
}
