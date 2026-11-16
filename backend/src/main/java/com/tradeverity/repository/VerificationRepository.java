package com.tradeverity.repository;

import com.tradeverity.domain.VerificationCheck;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class VerificationRepository {
    private final JdbcTemplate jdbcTemplate;

    public VerificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<VerificationCheck> checkRowMapper = (rs, rowNum) -> {
        VerificationCheck vc = new VerificationCheck();
        vc.setCheckId(rs.getLong("check_id"));
        vc.setCaseId(rs.getString("case_id"));
        vc.setEntityIdentifier(rs.getString("entity_identifier"));
        vc.setSourceId((Long) rs.getObject("source_id"));
        vc.setProviderName(rs.getString("provider_name"));
        vc.setOutcome(rs.getString("outcome"));
        vc.setExplanation(rs.getString("explanation"));
        vc.setRawResponse(rs.getString("raw_response"));
        vc.setIsDemo(rs.getBoolean("is_demo"));

        java.sql.Timestamp checked = rs.getTimestamp("checked_at");
        if (checked != null) vc.setCheckedAt(checked.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return vc;
    };

    public List<VerificationCheck> findByCaseId(String caseId) {
        String sql = "SELECT * FROM verification_checks WHERE case_id = ? ORDER BY check_id DESC";
        return jdbcTemplate.query(sql, checkRowMapper, caseId);
    }

    public List<VerificationCheck> findAllRecent(int limit) {
        String sql = "SELECT * FROM verification_checks ORDER BY check_id DESC LIMIT ?";
        return jdbcTemplate.query(sql, checkRowMapper, limit);
    }

    public VerificationCheck save(VerificationCheck check) {
        String sql = "INSERT INTO verification_checks (case_id, entity_identifier, source_id, provider_name, " +
                     "outcome, explanation, raw_response, is_demo, checked_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql,
            check.getCaseId(),
            check.getEntityIdentifier(),
            check.getSourceId(),
            check.getProviderName(),
            check.getOutcome(),
            check.getExplanation(),
            check.getRawResponse(),
            check.getIsDemo() != null ? check.getIsDemo() : false
        );
        return check;
    }
}
