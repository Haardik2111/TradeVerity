package com.tradeverity.repository;

import com.tradeverity.domain.ReviewerNote;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class ReviewerNoteRepository {
    private final JdbcTemplate jdbcTemplate;

    public ReviewerNoteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ReviewerNote> noteRowMapper = (rs, rowNum) -> {
        ReviewerNote rn = new ReviewerNote();
        rn.setNoteId(rs.getLong("note_id"));
        rn.setCaseId(rs.getString("case_id"));
        rn.setReviewerId((Long) rs.getObject("reviewer_id"));
        rn.setReviewerName(rs.getString("reviewer_name"));
        rn.setDecision(rs.getString("decision"));
        rn.setNoteContent(rs.getString("note_content"));

        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) rn.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return rn;
    };

    public List<ReviewerNote> findByCaseId(String caseId) {
        String sql = "SELECT * FROM reviewer_notes WHERE case_id = ? ORDER BY note_id DESC";
        return jdbcTemplate.query(sql, noteRowMapper, caseId);
    }

    public ReviewerNote save(ReviewerNote note) {
        String sql = "INSERT INTO reviewer_notes (case_id, reviewer_id, reviewer_name, decision, note_content, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql,
            note.getCaseId(),
            note.getReviewerId(),
            note.getReviewerName(),
            note.getDecision(),
            note.getNoteContent()
        );
        return note;
    }
}
