package com.tradeverity.repository;

import com.tradeverity.domain.EntityLink;
import com.tradeverity.domain.EntityRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class EntityRepository {
    private final JdbcTemplate jdbcTemplate;

    public EntityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<EntityRecord> entityRowMapper = (rs, rowNum) -> {
        EntityRecord er = new EntityRecord();
        er.setEntityId(rs.getLong("entity_id"));
        er.setEntityIdentifier(rs.getString("entity_identifier"));
        er.setDisplayName(rs.getString("display_name"));
        er.setEntityType(rs.getString("entity_type"));
        er.setMaskedIdentifier(rs.getString("masked_identifier"));
        er.setRiskBand(rs.getString("risk_band"));
        er.setVerificationStatus(rs.getString("verification_status"));
        er.setReputationScore((Integer) rs.getObject("reputation_score"));
        er.setReportCount((Integer) rs.getObject("report_count"));

        java.sql.Timestamp firstSeen = rs.getTimestamp("first_seen_at");
        if (firstSeen != null) er.setFirstSeenAt(firstSeen.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        java.sql.Timestamp lastSeen = rs.getTimestamp("last_seen_at");
        if (lastSeen != null) er.setLastSeenAt(lastSeen.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return er;
    };

    private final RowMapper<EntityLink> linkRowMapper = (rs, rowNum) -> {
        EntityLink el = new EntityLink();
        el.setLinkId(rs.getLong("link_id"));
        el.setSourceEntityId(rs.getLong("source_entity_id"));
        el.setTargetEntityId(rs.getLong("target_entity_id"));
        el.setRelationshipType(rs.getString("relationship_type"));
        el.setRelationshipLabel(rs.getString("relationship_label"));
        el.setConfidenceScore(rs.getBigDecimal("confidence_score"));
        el.setStatus(rs.getString("status"));
        el.setCaseId(rs.getString("case_id"));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) el.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return el;
    };

    public List<EntityRecord> findAllEntities() {
        return jdbcTemplate.query("SELECT * FROM entity_records ORDER BY report_count DESC", entityRowMapper);
    }

    public Optional<EntityRecord> findById(Long entityId) {
        String sql = "SELECT * FROM entity_records WHERE entity_id = ?";
        return jdbcTemplate.query(sql, entityRowMapper, entityId).stream().findFirst();
    }

    public Optional<EntityRecord> findByIdentifier(String identifier) {
        String sql = "SELECT * FROM entity_records WHERE entity_identifier = ?";
        return jdbcTemplate.query(sql, entityRowMapper, identifier).stream().findFirst();
    }

    public EntityRecord saveEntity(EntityRecord entity) {
        Optional<EntityRecord> existing = findByIdentifier(entity.getEntityIdentifier());
        if (existing.isPresent()) {
            EntityRecord e = existing.get();
            String sql = "UPDATE entity_records SET report_count = report_count + 1, last_seen_at = CURRENT_TIMESTAMP WHERE entity_id = ?";
            jdbcTemplate.update(sql, e.getEntityId());
            return findById(e.getEntityId()).orElse(e);
        } else {
            String sql = "INSERT INTO entity_records (entity_identifier, display_name, entity_type, " +
                         "masked_identifier, risk_band, verification_status, reputation_score, report_count, " +
                         "first_seen_at, last_seen_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            jdbcTemplate.update(sql,
                entity.getEntityIdentifier(),
                entity.getDisplayName(),
                entity.getEntityType(),
                entity.getMaskedIdentifier(),
                entity.getRiskBand() != null ? entity.getRiskBand() : "NEEDS_REVIEW",
                entity.getVerificationStatus() != null ? entity.getVerificationStatus() : "UNVERIFIED",
                entity.getReputationScore() != null ? entity.getReputationScore() : 50,
                entity.getReportCount() != null ? entity.getReportCount() : 1
            );
            return findByIdentifier(entity.getEntityIdentifier()).orElse(entity);
        }
    }

    public List<EntityLink> findAllLinks() {
        return jdbcTemplate.query("SELECT * FROM entity_links ORDER BY link_id ASC", linkRowMapper);
    }

    public List<EntityLink> findLinksByEntityId(Long entityId) {
        String sql = "SELECT * FROM entity_links WHERE source_entity_id = ? OR target_entity_id = ?";
        return jdbcTemplate.query(sql, linkRowMapper, entityId, entityId);
    }

    public EntityLink saveLink(EntityLink link) {
        String sql = "INSERT INTO entity_links (source_entity_id, target_entity_id, relationship_type, " +
                     "relationship_label, confidence_score, status, case_id, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql,
            link.getSourceEntityId(),
            link.getTargetEntityId(),
            link.getRelationshipType(),
            link.getRelationshipLabel(),
            link.getConfidenceScore(),
            link.getStatus() != null ? link.getStatus() : "SUGGESTED",
            link.getCaseId()
        );
        return link;
    }

    public void updateLinkStatus(Long linkId, String status) {
        jdbcTemplate.update("UPDATE entity_links SET status = ? WHERE link_id = ?", status, linkId);
    }

    public long countVerifiedEntities() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM entity_records WHERE verification_status = 'VERIFIED'", Long.class);
    }
}
