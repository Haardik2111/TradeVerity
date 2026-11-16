package com.tradeverity.repository;

import com.tradeverity.domain.AuditEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class AuditRepository {
    private final JdbcTemplate jdbcTemplate;

    public AuditRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<AuditEvent> auditRowMapper = (rs, rowNum) -> {
        AuditEvent ae = new AuditEvent();
        ae.setEventId(rs.getLong("event_id"));
        ae.setUserId((Long) rs.getObject("user_id"));
        ae.setUserEmail(rs.getString("user_email"));
        ae.setAction(rs.getString("action"));
        ae.setEntityType(rs.getString("entity_type"));
        ae.setEntityId(rs.getString("entity_id"));
        ae.setDetails(rs.getString("details"));
        ae.setIpAddress(rs.getString("ip_address"));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) ae.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return ae;
    };

    public void log(AuditEvent event) {
        String sql = "INSERT INTO audit_events (user_id, user_email, action, entity_type, entity_id, details, ip_address, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql,
            event.getUserId(),
            event.getUserEmail(),
            event.getAction(),
            event.getEntityType(),
            event.getEntityId(),
            event.getDetails(),
            event.getIpAddress()
        );
    }

    public List<AuditEvent> findRecent(int limit) {
        String sql = "SELECT * FROM audit_events ORDER BY event_id DESC LIMIT ?";
        return jdbcTemplate.query(sql, auditRowMapper, limit);
    }
}
