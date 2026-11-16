package com.tradeverity.repository;

import com.tradeverity.domain.SourceRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class SourceRepository {
    private final JdbcTemplate jdbcTemplate;

    public SourceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SourceRecord> sourceRowMapper = (rs, rowNum) -> {
        SourceRecord sr = new SourceRecord();
        sr.setSourceId(rs.getLong("source_id"));
        sr.setSourceCode(rs.getString("source_code"));
        sr.setSourceName(rs.getString("source_name"));
        sr.setSourceUrl(rs.getString("source_url"));
        sr.setCategory(rs.getString("category"));
        sr.setDataFreshness(rs.getString("data_freshness"));
        sr.setStatus(rs.getString("status"));
        sr.setDatasetVersion(rs.getString("dataset_version"));

        java.sql.Timestamp lastChecked = rs.getTimestamp("last_checked_at");
        if (lastChecked != null) sr.setLastCheckedAt(lastChecked.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) sr.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return sr;
    };

    public List<SourceRecord> findAll() {
        return jdbcTemplate.query("SELECT * FROM source_records ORDER BY source_id ASC", sourceRowMapper);
    }

    public Optional<SourceRecord> findById(Long sourceId) {
        String sql = "SELECT * FROM source_records WHERE source_id = ?";
        return jdbcTemplate.query(sql, sourceRowMapper, sourceId).stream().findFirst();
    }

    public Optional<SourceRecord> findByCode(String code) {
        String sql = "SELECT * FROM source_records WHERE source_code = ?";
        return jdbcTemplate.query(sql, sourceRowMapper, code).stream().findFirst();
    }

    public SourceRecord save(SourceRecord src) {
        if (src.getSourceId() == null) {
            String sql = "INSERT INTO source_records (source_code, source_name, source_url, category, " +
                         "data_freshness, status, dataset_version, last_checked_at, created_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            jdbcTemplate.update(sql,
                src.getSourceCode(),
                src.getSourceName(),
                src.getSourceUrl(),
                src.getCategory(),
                src.getDataFreshness() != null ? src.getDataFreshness() : "LIVE",
                src.getStatus() != null ? src.getStatus() : "LIVE",
                src.getDatasetVersion() != null ? src.getDatasetVersion() : "v2026.1"
            );
            return findByCode(src.getSourceCode()).orElse(src);
        } else {
            String sql = "UPDATE source_records SET source_name = ?, source_url = ?, category = ?, " +
                         "data_freshness = ?, status = ?, dataset_version = ?, last_checked_at = CURRENT_TIMESTAMP WHERE source_id = ?";
            jdbcTemplate.update(sql,
                src.getSourceName(),
                src.getSourceUrl(),
                src.getCategory(),
                src.getDataFreshness(),
                src.getStatus(),
                src.getDatasetVersion(),
                src.getSourceId()
            );
            return src;
        }
    }
}
