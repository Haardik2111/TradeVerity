export type UserRole = 'INVESTOR' | 'REVIEWER' | 'ADMIN';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    digestFrequency?: 'DAILY' | 'WEEKLY' | 'NEVER';
  };
  onboardingComplete?: boolean;
}

export type InvestigationCategory =
  | 'Trading Application'
  | 'Website or URL'
  | 'Investment Advisor'
  | 'Broker Impersonation'
  | 'Stock Broker'
  | 'Research Analyst'
  | 'Suspicious Message'
  | 'Social Media Campaign'
  | 'Phone Number / Contact'
  | 'Payment Identifier'
  | 'Other';

export type CaseStatus = 'SUBMITTED' | 'PROCESSING' | 'COMPLETED' | 'NEEDS_REVIEW' | 'FAILED';
export type RiskBand = 'LOW_INDICATORS' | 'NEEDS_REVIEW' | 'HIGH_ATTENTION';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CaseReport {
  caseId: string;
  userId?: number;
  entityName: string;
  category: InvestigationCategory;
  claimedOrg?: string;
  registrationNo?: string;
  websiteUrl?: string;
  contactInfo?: string;
  summaryNarrative?: string;
  status: CaseStatus;
  riskBand: RiskBand;
  riskScore: number;
  evidenceConfidence: ConfidenceLevel;
  relationshipConfidence: ConfidenceLevel;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  evidenceCount?: number;
}

export interface EvidenceItem {
  evidenceId: number;
  caseId: string;
  evidenceType: 'URL' | 'SCREENSHOT' | 'MESSAGE_TEXT' | 'PAYMENT_UPI' | 'PHONE_NUMBER' | 'REGISTRATION_NO' | 'DOCUMENT';
  rawValue: string;
  maskedValue?: string;
  normalizedValue?: string;
  sourceOrigin: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  verificationState: string;
  createdAt: string;
}

export type EntityType = 'WEBSITE' | 'APP' | 'PHONE' | 'EMAIL' | 'ADVISOR' | 'UPI' | 'SOCIAL_ACCOUNT' | 'REPORT';

export interface EntityRecord {
  entityId: number;
  entityIdentifier: string;
  displayName: string;
  entityType: EntityType;
  maskedIdentifier: string;
  riskBand: RiskBand;
  verificationStatus: string;
  reputationScore: number;
  reportCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface EntityLink {
  linkId: number;
  sourceEntityId: number;
  targetEntityId: number;
  relationshipType: 'SHARED_CONTACT' | 'SIMILAR_DOMAIN' | 'CO_REPORTED_INDICATOR' | 'MENTIONED_IN_CAMPAIGN' | 'EVIDENCE_LINK' | 'CLAIMED_ORG';
  relationshipLabel: string;
  confidenceScore: number;
  status: 'SUGGESTED' | 'ACCEPTED' | 'REJECTED';
  caseId?: string;
  createdAt: string;
}

export type SourceStatus = 'LIVE' | 'CACHED' | 'DEMO' | 'UNAVAILABLE' | 'STALE';

export interface SourceRecord {
  sourceId: number;
  sourceCode: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  dataFreshness: string;
  status: SourceStatus;
  datasetVersion: string;
  lastCheckedAt: string;
  createdAt?: string;
}

export type VerificationOutcome =
  | 'VERIFIED_REFERENCE'
  | 'NO_MATCH_FOUND'
  | 'INFORMATION_MISMATCH'
  | 'DATA_UNAVAILABLE'
  | 'REQUIRES_MANUAL_REVIEW';

export interface VerificationCheck {
  checkId: number;
  caseId?: string;
  entityIdentifier: string;
  sourceId?: number;
  providerName: string;
  outcome: VerificationOutcome;
  explanation: string;
  rawResponse?: string;
  isDemo: boolean;
  checkedAt: string;
}

export interface RiskAssessment {
  assessmentId: number;
  caseId: string;
  ruleId: string;
  ruleName: string;
  ruleVersion: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  triggered: boolean;
  explanation: string;
  evidenceRef?: string;
  createdAt: string;
}

export interface ReviewerNote {
  noteId: number;
  caseId: string;
  reviewerId?: number;
  reviewerName: string;
  decision?: string;
  noteContent: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalInvestigations: number;
  highAttentionCases: number;
  verifiedEntities: number;
  pendingReviews: number;
  threatDistribution: {
    whatsappTelegram: number;
    unregisteredUpiApps: number;
    fraudulentRIA: number;
    deceptivePortals: number;
  };
  recentActivities: Array<{
    id: string;
    type: 'INVESTIGATION_SUBMITTED' | 'VERIFICATION_COMPLETED' | 'RELATIONSHIP_DETECTED' | 'REVIEW_UPDATED' | 'REPORT_GENERATED';
    title: string;
    detail: string;
    timestamp: string;
    badge?: string;
  }>;
}
