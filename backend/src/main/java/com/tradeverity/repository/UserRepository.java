package com.tradeverity.repository;

import com.tradeverity.domain.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User u = new User();
        u.setUserId(rs.getLong("user_id"));
        u.setFirebaseUid(rs.getString("firebase_uid"));
        u.setFullName(rs.getString("full_name"));
        u.setEmail(rs.getString("email"));
        u.setRole(rs.getString("role"));
        u.setStatus(rs.getString("status"));
        u.setPhotoUrl(rs.getString("photo_url"));
        
        java.sql.Timestamp created = rs.getTimestamp("created_at");
        if (created != null) u.setCreatedAt(created.toInstant().atOffset(OffsetDateTime.now().getOffset()));
        
        java.sql.Timestamp updated = rs.getTimestamp("updated_at");
        if (updated != null) u.setUpdatedAt(updated.toInstant().atOffset(OffsetDateTime.now().getOffset()));

        return u;
    };

    public Optional<User> findByFirebaseUid(String firebaseUid) {
        String sql = "SELECT * FROM users WHERE firebase_uid = ?";
        return jdbcTemplate.query(sql, userRowMapper, firebaseUid).stream().findFirst();
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        return jdbcTemplate.query(sql, userRowMapper, email).stream().findFirst();
    }

    public Optional<User> findById(Long userId) {
        String sql = "SELECT * FROM users WHERE user_id = ?";
        return jdbcTemplate.query(sql, userRowMapper, userId).stream().findFirst();
    }

    public User save(User user) {
        if (user.getUserId() == null) {
            String sql = "INSERT INTO users (firebase_uid, full_name, email, role, status, photo_url, created_at, updated_at) " +
                         "VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            jdbcTemplate.update(sql, 
                user.getFirebaseUid(), 
                user.getFullName(), 
                user.getEmail(), 
                user.getRole() != null ? user.getRole() : "INVESTOR", 
                user.getStatus() != null ? user.getStatus() : "ACTIVE", 
                user.getPhotoUrl()
            );
            return findByFirebaseUid(user.getFirebaseUid()).orElse(user);
        } else {
            String sql = "UPDATE users SET full_name = ?, photo_url = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";
            jdbcTemplate.update(sql, user.getFullName(), user.getPhotoUrl(), user.getRole(), user.getUserId());
            return user;
        }
    }
}
