package com.tradeverity.repository;

import com.tradeverity.domain.RiskAssessment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class RiskAssessmentRepository {
    private final JdbcTemplate jdbcTemplate;

    public RiskAssessmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<RiskAssessment> assessmentRowMapper = (rs, rowNum) -> {
        RiskAssessment ra = new RiskAssessment();
        ra.setAssessmentId(rs.getLong("assessment_id"));
        ra.setCaseId(rs.getString("case_id"));
        ra.setRuleId(rs.getString("rule_id"));
        ra.setRuleName(rs.getString("rule_name"));
        ra.setRuleVersion(rs.getString("rule_version"));
        ra.setSeverity(rs.getString("severity"));
        ra.setTriggered(rs.getBoolean("triggered"));
        ra.setExplanation(rs.getString("explanation"));
        ra.setEvidenceRef(rs.getString("evidence_ref"));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) ra.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return ra;
    };

    public List<RiskAssessment> findByCaseId(String caseId) {
        String sql = "SELECT * FROM risk_assessments WHERE case_id = ? ORDER BY assessment_id ASC";
        return jdbcTemplate.query(sql, assessmentRowMapper, caseId);
    }

    public void deleteByCaseId(String caseId) {
        jdbcTemplate.update("DELETE FROM risk_assessments WHERE case_id = ?", caseId);
    }

    public RiskAssessment save(RiskAssessment ra) {
        String sql = "INSERT INTO risk_assessments (case_id, rule_id, rule_name, rule_version, " +
                     "severity, triggered, explanation, evidence_ref, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql,
            ra.getCaseId(),
            ra.getRuleId(),
            ra.getRuleName(),
            ra.getRuleVersion() != null ? ra.getRuleVersion() : "1.0.0",
            ra.getSeverity(),
            ra.getTriggered(),
            ra.getExplanation(),
            ra.getEvidenceRef()
        );
        return ra;
    }
}
