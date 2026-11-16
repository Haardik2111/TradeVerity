-- ========================================================
-- TRADEVERITY SCHEMA MIGRATION V1
-- Intelligent Stock Market Fraud Detection & Investor Protection System
-- ========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'INVESTOR',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. CASE REPORTS TABLE
CREATE TABLE IF NOT EXISTS case_reports (
    case_id VARCHAR(64) PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    entity_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    claimed_org VARCHAR(255),
    registration_no VARCHAR(100),
    website_url TEXT,
    contact_info VARCHAR(255),
    summary_narrative TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    risk_band VARCHAR(50) NOT NULL DEFAULT 'NEEDS_REVIEW',
    risk_score INT DEFAULT 0,
    evidence_confidence VARCHAR(50) DEFAULT 'MEDIUM',
    relationship_confidence VARCHAR(50) DEFAULT 'MEDIUM',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_case_reports_user ON case_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_case_reports_status ON case_reports(status);
CREATE INDEX IF NOT EXISTS idx_case_reports_risk_band ON case_reports(risk_band);
CREATE INDEX IF NOT EXISTS idx_case_reports_category ON case_reports(category);

-- 3. EVIDENCE ITEMS TABLE
CREATE TABLE IF NOT EXISTS evidence_items (
    evidence_id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL REFERENCES case_reports(case_id) ON DELETE CASCADE,
    evidence_type VARCHAR(100) NOT NULL,
    raw_value TEXT NOT NULL,
    masked_value TEXT,
    normalized_value TEXT,
    source_origin VARCHAR(255),
    file_path TEXT,
    file_type VARCHAR(50),
    file_size BIGINT,
    verification_state VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence_items(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_normalized ON evidence_items(normalized_value);

-- 4. ENTITY RECORDS TABLE
CREATE TABLE IF NOT EXISTS entity_records (
    entity_id BIGSERIAL PRIMARY KEY,
    entity_identifier VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    masked_identifier VARCHAR(255),
    risk_band VARCHAR(50) DEFAULT 'NEEDS_REVIEW',
    verification_status VARCHAR(50) DEFAULT 'UNVERIFIED',
    reputation_score INT DEFAULT 50,
    report_count INT DEFAULT 1,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entity_identifier ON entity_records(entity_identifier);
CREATE INDEX IF NOT EXISTS idx_entity_type ON entity_records(entity_type);
CREATE INDEX IF NOT EXISTS idx_entity_risk_band ON entity_records(risk_band);

-- 5. ENTITY LINKS TABLE (Relationship Network)
CREATE TABLE IF NOT EXISTS entity_links (
    link_id BIGSERIAL PRIMARY KEY,
    source_entity_id BIGINT NOT NULL REFERENCES entity_records(entity_id) ON DELETE CASCADE,
    target_entity_id BIGINT NOT NULL REFERENCES entity_records(entity_id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL,
    relationship_label VARCHAR(255) NOT NULL,
    confidence_score DECIMAL(4,2) DEFAULT 0.75,
    status VARCHAR(50) DEFAULT 'SUGGESTED',
    case_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entity_links_source ON entity_links(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_links_target ON entity_links(target_entity_id);

-- 6. SOURCE RECORDS TABLE (Official and Reference Sources)
CREATE TABLE IF NOT EXISTS source_records (
    source_id BIGSERIAL PRIMARY KEY,
    source_code VARCHAR(50) NOT NULL UNIQUE,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    data_freshness VARCHAR(50) DEFAULT 'LIVE',
    status VARCHAR(50) DEFAULT 'LIVE',
    dataset_version VARCHAR(50) DEFAULT 'v2026.1',
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. VERIFICATION CHECKS TABLE
CREATE TABLE IF NOT EXISTS verification_checks (
    check_id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(64),
    entity_identifier VARCHAR(255) NOT NULL,
    source_id BIGINT REFERENCES source_records(source_id) ON DELETE SET NULL,
    provider_name VARCHAR(100) NOT NULL,
    outcome VARCHAR(100) NOT NULL,
    explanation TEXT NOT NULL,
    raw_response TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verification_case_id ON verification_checks(case_id);

-- 8. RISK ASSESSMENTS TABLE (Rule-based explainable findings)
CREATE TABLE IF NOT EXISTS risk_assessments (
    assessment_id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL REFERENCES case_reports(case_id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    rule_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    severity VARCHAR(50) NOT NULL,
    triggered BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT NOT NULL,
    evidence_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risk_assessments_case ON risk_assessments(case_id);

-- 9. AUDIT EVENTS TABLE
CREATE TABLE IF NOT EXISTS audit_events (
    event_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);

-- 10. REVIEWER NOTES TABLE
CREATE TABLE IF NOT EXISTS reviewer_notes (
    note_id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL REFERENCES case_reports(case_id) ON DELETE CASCADE,
    reviewer_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    decision VARCHAR(50),
    note_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviewer_notes_case ON reviewer_notes(case_id);
