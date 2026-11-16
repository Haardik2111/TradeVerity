package com.tradeverity.repository;

import com.tradeverity.domain.EvidenceItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class EvidenceRepository {
    private final JdbcTemplate jdbcTemplate;

    public EvidenceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<EvidenceItem> evidenceRowMapper = (rs, rowNum) -> {
        EvidenceItem ev = new EvidenceItem();
        ev.setEvidenceId(rs.getLong("evidence_id"));
        ev.setCaseId(rs.getString("case_id"));
        ev.setEvidenceType(rs.getString("evidence_type"));
        ev.setRawValue(rs.getString("raw_value"));
        ev.setMaskedValue(rs.getString("masked_value"));
        ev.setNormalizedValue(rs.getString("normalized_value"));
        ev.setSourceOrigin(rs.getString("source_origin"));
        ev.setFilePath(rs.getString("file_path"));
        ev.setFileType(rs.getString("file_type"));
        ev.setFileSize((Long) rs.getObject("file_size"));
        ev.setVerificationState(rs.getString("verification_state"));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) ev.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return ev;
    };

    public List<EvidenceItem> findByCaseId(String caseId) {
        String sql = "SELECT * FROM evidence_items WHERE case_id = ? ORDER BY evidence_id ASC";
        return jdbcTemplate.query(sql, evidenceRowMapper, caseId);
    }

    public List<EvidenceItem> findByNormalizedValue(String normalized) {
        String sql = "SELECT * FROM evidence_items WHERE normalized_value = ?";
        return jdbcTemplate.query(sql, evidenceRowMapper, normalized);
    }

    public EvidenceItem save(EvidenceItem item) {
        String sql = "INSERT INTO evidence_items (case_id, evidence_type, raw_value, masked_value, " +
                     "normalized_value, source_origin, file_path, file_type, file_size, verification_state, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql,
            item.getCaseId(),
            item.getEvidenceType(),
            item.getRawValue(),
            item.getMaskedValue(),
            item.getNormalizedValue(),
            item.getSourceOrigin(),
            item.getFilePath(),
            item.getFileType(),
            item.getFileSize(),
            item.getVerificationState() != null ? item.getVerificationState() : "PENDING"
        );
        return item;
    }
}
