-- ========================================================
-- TRADEVERITY SEED DEMO DATA V2
-- High-fidelity intelligence data matching the Obsidian Radar Stitch reference
-- ========================================================

-- Sources
INSERT INTO source_records (source_code, source_name, source_url, category, data_freshness, status, dataset_version)
VALUES 
('SEBI_REG', 'SEBI Intermediary Registration Database', 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13', 'REGULATORY', 'CACHED', 'CACHED', 'v2026.11-DEMO'),
('RBI_SACHET', 'RBI Sachet Fraud Reporting Repository', 'https://sachet.rbi.org.in', 'REGULATORY', 'CACHED', 'CACHED', 'v2026.10-DEMO'),
('NSE_ALERTS', 'NSE Unauthorized Scheme Warnings & Cautions', 'https://www.nseindia.com/invest/caution-notices-against-unauthorized-schemes', 'REGULATORY', 'LIVE', 'LIVE', 'v2026.11-DEMO'),
('BSE_CAUTION', 'BSE Caution Notices on Market Manipulation', 'https://www.bseindia.com/investors/caution_investor.aspx', 'REGULATORY', 'LIVE', 'LIVE', 'v2026.11-DEMO'),
('CYBER_CRIME', 'National Cyber Crime Reporting Coordination', 'https://cybercrime.gov.in', 'THREAT_FEED', 'LIVE', 'LIVE', 'v2026.10-DEMO'),
('WHOIS_INTEL', 'Global Domain RDAP & Fast-Flux Telemetry', 'https://rdap.org', 'WHOIS_LOOKUP', 'LIVE', 'LIVE', 'v2026.11-RDAP');

-- Demo Users
INSERT INTO users (user_id, firebase_uid, full_name, email, role, status)
VALUES 
(1, 'demo-analyst-arjun', 'Arjun Mehta', 'arjun.mehta@tradeverity.internal', 'REVIEWER', 'ACTIVE'),
(2, 'demo-investor-user', 'Priya Sharma', 'priya.investor@example.com', 'INVESTOR', 'ACTIVE'),
(3, 'demo-admin-system', 'Chief Security Officer', 'admin@tradeverity.internal', 'ADMIN', 'ACTIVE');

-- Cases
INSERT INTO case_reports (case_id, user_id, entity_name, category, claimed_org, registration_no, website_url, contact_info, summary_narrative, status, risk_band, risk_score, evidence_confidence, relationship_confidence, is_demo)
VALUES
('CRV-2026-8814', 1, 'Apex Alpha Wealth Advisors', 'Investment Advisor', 'Apex Capital Markets', 'INA00009871 (Claimed)', 'https://apexalpha-invest.online', '+91 98765 43210', 'Entity solicits funds on Telegram promising 35% weekly guaranteed returns on algorithmic options trading. Claimed SEBI registration number does not match registered RIA entities.', 'COMPLETED', 'HIGH_ATTENTION', 88, 'HIGH', 'HIGH', TRUE),
('CRV-2026-9137', 1, 'ShareNidhi Online App', 'Trading Application', 'ShareNidhi FinTech Pvt Ltd', 'UNREGISTERED', 'https://sharenidhi-trading-apk.site', 'dhanvridhi.pay@okfictiobank', 'Third-party APK distributed via WhatsApp investment groups requesting deposit to personal/merchant UPI VPA instead of SEBI-mandated clearing account.', 'COMPLETED', 'HIGH_ATTENTION', 92, 'HIGH', 'HIGH', TRUE),
('CRV-2026-7201', 1, 'Kisan Samriddhi Mutual Syndicate', 'Social Media Campaign', 'Samriddhi Agro Equity', 'UNREGISTERED', 'https://samriddhi-kisan-wealth.in', '+91 91234 56789', 'Targeted Facebook and Instagram video ads promising agricultural equity derivative dividends with zero downside risk.', 'NEEDS_REVIEW', 'NEEDS_REVIEW', 64, 'MEDIUM', 'HIGH', TRUE),
('CRV-2026-6419', 1, 'BluePeak Capital India Advisory LLP', 'Stock Broker', 'BluePeak Capital LLP', 'INZ000214838', 'https://bluepeakcapital.in', 'support@bluepeakcapital.in', 'Verification submitted to cross-check credentials after receiving unexpected onboarding invitation. Verified authentic SEBI-registered broker member.', 'COMPLETED', 'LOW_INDICATORS', 12, 'HIGH', 'HIGH', TRUE),
('CRV-2026-5590', 1, 'Vanguard Securities Global VIP Tips', 'Broker Impersonation', 'Vanguard Group (Impersonated)', 'MISMATCH_REF', 'https://vanguard-vip-india.cc', '+91 88990 01122', 'Channel impersonates international fund brand using spoofed logos and altered SEBI certificates to extract cryptocurrency and UPI transfers.', 'COMPLETED', 'HIGH_ATTENTION', 95, 'HIGH', 'HIGH', TRUE);

-- Evidence Items
INSERT INTO evidence_items (case_id, evidence_type, raw_value, masked_value, normalized_value, source_origin, verification_state)
VALUES
('CRV-2026-8814', 'URL', 'https://apexalpha-invest.online', 'https://apexalpha-invest.online', 'apexalpha-invest.online', 'User Submission', 'VERIFIED_FLAGGED'),
('CRV-2026-8814', 'PHONE_NUMBER', '+91 98765 43210', '+91 98765 *****', '+919876543210', 'WhatsApp Group Admin', 'VERIFIED_FLAGGED'),
('CRV-2026-8814', 'REGISTRATION_NO', 'INA00009871', 'INA00009871', 'INA00009871', 'Promotional PDF Header', 'UNVERIFIED_MISMATCH'),
('CRV-2026-9137', 'PAYMENT_UPI', 'dhanvridhi.pay@okfictiobank', 'dhanvridhi.***@okfictiobank', 'dhanvridhi.pay@okfictiobank', 'App Deposit Screen', 'VERIFIED_FLAGGED'),
('CRV-2026-9137', 'URL', 'https://sharenidhi-trading-apk.site/dl/app.apk', 'https://sharenidhi-trading-apk.site/****', 'sharenidhi-trading-apk.site', 'Telegram Channel', 'VERIFIED_FLAGGED'),
('CRV-2026-5590', 'PHONE_NUMBER', '+91 88990 01122', '+91 88990 *****', '+918899001122', 'VIP Admin Contact', 'VERIFIED_FLAGGED');

-- Entities
INSERT INTO entity_records (entity_identifier, display_name, entity_type, masked_identifier, risk_band, verification_status, reputation_score, report_count)
VALUES
('dhanvridhi.pay@okfictiobank', 'dhanvridhi.pay@okfictiobank', 'UPI', 'dhanvridhi.***@okfictiobank', 'HIGH_ATTENTION', 'FLAGGED', 8, 14),
('sharenidhi-trading-apk.site', 'ShareNidhi Trading APK Portal', 'WEBSITE', 'sharenidhi-trading-apk.site', 'HIGH_ATTENTION', 'SUSPICIOUS', 12, 9),
('+919876543210', '+91 98765 43210 (Alpha Operator)', 'PHONE', '+91 98765 *****', 'HIGH_ATTENTION', 'FLAGGED', 15, 6),
('apexalpha-invest.online', 'apexalpha-invest.online', 'WEBSITE', 'apexalpha-invest.online', 'HIGH_ATTENTION', 'SUSPICIOUS', 18, 5),
('INA00009871', 'Claimed RIA INA00009871', 'ADVISOR', 'INA00009871', 'HIGH_ATTENTION', 'MISMATCH', 20, 4),
('bluepeakcapital.in', 'BluePeak Capital Official Domain', 'WEBSITE', 'bluepeakcapital.in', 'LOW_INDICATORS', 'VERIFIED', 96, 1),
('samriddhi-kisan-wealth.in', 'Samriddhi Kisan Portal', 'WEBSITE', 'samriddhi-kisan-wealth.in', 'NEEDS_REVIEW', 'UNVERIFIED', 45, 2),
('vanguard-vip-india.cc', 'Vanguard Spoofed Portal (.cc)', 'WEBSITE', 'vanguard-vip-india.cc', 'HIGH_ATTENTION', 'FLAGGED', 5, 8);

-- Entity Links (Network Graph)
INSERT INTO entity_links (source_entity_id, target_entity_id, relationship_type, relationship_label, confidence_score, status, case_id)
VALUES
(1, 2, 'EVIDENCE_LINK', 'Payment gateway embedded in APK download', 0.95, 'ACCEPTED', 'CRV-2026-9137'),
(2, 3, 'SHARED_CONTACT', 'Shared campaign admin contact on Telegram', 0.88, 'ACCEPTED', 'CRV-2026-9137'),
(3, 4, 'CO_REPORTED_INDICATOR', 'Phone listed in registration WHOIS & contact card', 0.92, 'ACCEPTED', 'CRV-2026-8814'),
(4, 5, 'CLAIMED_ORG', 'Website claims ownership of RIA number INA00009871', 0.78, 'ACCEPTED', 'CRV-2026-8814'),
(1, 8, 'SHARED_CONTACT', 'Identical recipient VPA utilized in VIP deposit channel', 0.90, 'ACCEPTED', 'CRV-2026-5590');

-- Risk Assessments
INSERT INTO risk_assessments (case_id, rule_id, rule_name, rule_version, severity, triggered, explanation, evidence_ref)
VALUES
('CRV-2026-8814', 'RULE-01', 'Guaranteed or Assured Return Claims', '1.0.0', 'HIGH', TRUE, 'Promotion promises "35% weekly risk-free profit", which directly violates SEBI advisory guidelines prohibiting guaranteed yields.', 'Promotional message pitch text'),
('CRV-2026-8814', 'RULE-04', 'Claimed Financial Affiliation Mismatch', '1.0.0', 'HIGH', TRUE, 'Registration number INA00009871 does not correspond to "Apex Alpha" in the regulatory database.', 'INA00009871 claimed vs SEBI RIA database'),
('CRV-2026-8814', 'RULE-05', 'Suspicious Lookalike Domain Structure', '1.0.0', 'MEDIUM', TRUE, 'Domain registered under generic new gTLD (.online) within the last 45 days with privacy masking.', 'apexalpha-invest.online'),
('CRV-2026-9137', 'RULE-02', 'Direct UPI / Personal Account Fund Solicitation', '1.0.0', 'HIGH', TRUE, 'App instructs investors to send capital to individual UPI ID (dhanvridhi.pay@okfictiobank) instead of SEBI clearing corporation accounts.', 'dhanvridhi.pay@okfictiobank'),
('CRV-2026-9137', 'RULE-06', 'Repeated Reported Contact / Identifier', '1.0.0', 'HIGH', TRUE, 'The UPI identifier dhanvridhi.pay@okfictiobank has been reported across 14 distinct investor submissions.', 'dhanvridhi.pay@okfictiobank cluster matches');

-- Verification Checks
INSERT INTO verification_checks (case_id, entity_identifier, source_id, provider_name, outcome, explanation, is_demo)
VALUES
('CRV-2026-8814', 'INA00009871', 1, 'SEBI Intermediary Registry Provider', 'INFORMATION_MISMATCH', 'Reference database shows registration INA00009871 was issued to a different entity located in Mumbai, not "Apex Alpha".', TRUE),
('CRV-2026-9137', 'ShareNidhi FinTech Pvt Ltd', 1, 'SEBI Intermediary Registry Provider', 'NO_MATCH_FOUND', 'No stock broker, sub-broker, or RIA registration found under the name "ShareNidhi".', TRUE),
('CRV-2026-6419', 'INZ000214838', 1, 'SEBI Intermediary Registry Provider', 'VERIFIED_REFERENCE', 'Registration verified active: BluePeak Capital India Advisory LLP holds valid Broker Member registration.', TRUE);

-- Reviewer Notes
INSERT INTO reviewer_notes (case_id, reviewer_id, reviewer_name, decision, note_content)
VALUES
('CRV-2026-8814', 1, 'Arjun Mehta', 'CONFIRMED_HIGH_RISK', 'Cross-referenced WHOIS telemetry with cybercrime portal alerts. Confirmed fraudulent impersonation scheme targeting retail derivatives traders.'),
('CRV-2026-9137', 1, 'Arjun Mehta', 'CLUSTER_TAGGED', 'Entity linked to Alpha-ShantiNidhi Syndicate cluster. UPI handle forwarded to payment gateway nodal officer for freeze review.');
