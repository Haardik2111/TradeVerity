package com.tradeverity.repository;

import com.tradeverity.domain.CaseReport;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CaseReportRepository {
    private final JdbcTemplate jdbcTemplate;

    public CaseReportRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CaseReport> caseRowMapper = (rs, rowNum) -> {
        CaseReport c = new CaseReport();
        c.setCaseId(rs.getString("case_id"));
        c.setUserId((Long) rs.getObject("user_id"));
        c.setEntityName(rs.getString("entity_name"));
        c.setCategory(rs.getString("category"));
        c.setClaimedOrg(rs.getString("claimed_org"));
        c.setRegistrationNo(rs.getString("registration_no"));
        c.setWebsiteUrl(rs.getString("website_url"));
        c.setContactInfo(rs.getString("contact_info"));
        c.setSummaryNarrative(rs.getString("summary_narrative"));
        c.setStatus(rs.getString("status"));
        c.setRiskBand(rs.getString("risk_band"));
        c.setRiskScore((Integer) rs.getObject("risk_score"));
        c.setEvidenceConfidence(rs.getString("evidence_confidence"));
        c.setRelationshipConfidence(rs.getString("relationship_confidence"));
        c.setIsDemo(rs.getBoolean("is_demo"));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) c.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        java.sql.Timestamp updated = rs.getTimestamp("updated_at");
        if (updated != null) c.setUpdatedAt(updated.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return c;
    };

    public List<CaseReport> findAll(String category, String status, String riskBand, String search) {
        StringBuilder sql = new StringBuilder("SELECT * FROM case_reports WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (category != null && !category.equalsIgnoreCase("ALL")) {
            sql.append(" AND category = ?");
            params.add(category);
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            sql.append(" AND status = ?");
            params.add(status);
        }
        if (riskBand != null && !riskBand.equalsIgnoreCase("ALL")) {
            sql.append(" AND risk_band = ?");
            params.add(riskBand);
        }
        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (LOWER(entity_name) LIKE ? OR LOWER(case_id) LIKE ? OR LOWER(claimed_org) LIKE ?)");
            String pattern = "%" + search.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }

        sql.append(" ORDER BY created_at DESC");
        return jdbcTemplate.query(sql.toString(), caseRowMapper, params.toArray());
    }

    public Optional<CaseReport> findById(String caseId) {
        String sql = "SELECT * FROM case_reports WHERE case_id = ?";
        return jdbcTemplate.query(sql, caseRowMapper, caseId).stream().findFirst();
    }

    public List<CaseReport> findPendingReviewQueue() {
        String sql = "SELECT * FROM case_reports WHERE status IN ('SUBMITTED', 'NEEDS_REVIEW', 'PROCESSING') ORDER BY risk_score DESC";
        return jdbcTemplate.query(sql, caseRowMapper);
    }

    public CaseReport save(CaseReport report) {
        String checkSql = "SELECT COUNT(*) FROM case_reports WHERE case_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, report.getCaseId());

        if (count == null || count == 0) {
            String insertSql = "INSERT INTO case_reports (case_id, user_id, entity_name, category, claimed_org, registration_no, " +
                               "website_url, contact_info, summary_narrative, status, risk_band, risk_score, " +
                               "evidence_confidence, relationship_confidence, is_demo, created_at, updated_at) " +
                               "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            jdbcTemplate.update(insertSql,
                report.getCaseId(),
                report.getUserId(),
                report.getEntityName(),
                report.getCategory(),
                report.getClaimedOrg(),
                report.getRegistrationNo(),
                report.getWebsiteUrl(),
                report.getContactInfo(),
                report.getSummaryNarrative(),
                report.getStatus() != null ? report.getStatus() : "SUBMITTED",
                report.getRiskBand() != null ? report.getRiskBand() : "NEEDS_REVIEW",
                report.getRiskScore() != null ? report.getRiskScore() : 50,
                report.getEvidenceConfidence() != null ? report.getEvidenceConfidence() : "MEDIUM",
                report.getRelationshipConfidence() != null ? report.getRelationshipConfidence() : "MEDIUM",
                report.getIsDemo() != null ? report.getIsDemo() : false
            );
        } else {
            String updateSql = "UPDATE case_reports SET status = ?, risk_band = ?, risk_score = ?, " +
                               "evidence_confidence = ?, relationship_confidence = ?, updated_at = CURRENT_TIMESTAMP WHERE case_id = ?";
            jdbcTemplate.update(updateSql,
                report.getStatus(),
                report.getRiskBand(),
                report.getRiskScore(),
                report.getEvidenceConfidence(),
                report.getRelationshipConfidence(),
                report.getCaseId()
            );
        }
        return findById(report.getCaseId()).orElse(report);
    }

    public long countTotal() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM case_reports", Long.class);
    }

    public long countHighAttention() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM case_reports WHERE risk_band = 'HIGH_ATTENTION'", Long.class);
    }

    public long countPending() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM case_reports WHERE status IN ('SUBMITTED', 'NEEDS_REVIEW')", Long.class);
    }
}
