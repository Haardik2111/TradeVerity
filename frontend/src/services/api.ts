import { 
  CaseReport, 
  EntityRecord, 
  EntityLink, 
  VerificationCheck, 
  SourceRecord, 
  RiskAssessment, 
  ReviewerNote, 
  EvidenceItem, 
  DashboardMetrics, 
  UserProfile 
} from '../types';

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080/api/v1';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`API [${endpoint}] error:`, err.message);
      throw err;
    }
  }

  // User
  async getCurrentUser(): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me');
  }

  async bootstrapUser(userData: { uid: string; email: string; displayName: string; role?: string }): Promise<UserProfile> {
    return this.request<UserProfile>('/users/bootstrap', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('/metrics/overview');
  }

  // Cases
  async getCases(params?: { category?: string; status?: string; riskBand?: string; search?: string }): Promise<CaseReport[]> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<CaseReport[]>(`/cases${query ? `?${query}` : ''}`);
  }

  async getCaseById(caseId: string): Promise<{
    caseReport: CaseReport;
    evidence: EvidenceItem[];
    assessments: RiskAssessment[];
    verificationChecks: VerificationCheck[];
    reviewerNotes: ReviewerNote[];
  }> {
    return this.request(`/cases/${caseId}`);
  }

  async submitCase(caseData: Partial<CaseReport> & { evidence?: Partial<EvidenceItem>[] }): Promise<CaseReport> {
    return this.request<CaseReport>('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData)
    });
  }

  async triggerAnalysis(caseId: string): Promise<{
    caseReport: CaseReport;
    assessments: RiskAssessment[];
  }> {
    return this.request(`/cases/${caseId}/analyze`, {
      method: 'POST'
    });
  }

  // Intelligence Network Graph
  async getIntelligenceGraph(filter?: string): Promise<{
    nodes: Array<{
      id: string;
      data: {
        label: string;
        entityType: string;
        riskBand: string;
        verificationStatus: string;
        reputationScore: number;
        reportCount: number;
        identifier: string;
      };
      position: { x: number; y: number };
      type?: string;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      label: string;
      type?: string;
      animated?: boolean;
      data?: {
        relationshipType: string;
        confidence: number;
      };
    }>;
  }> {
    return this.request(`/intelligence/graph${filter ? `?filter=${filter}` : ''}`);
  }

  async getEntityDetails(entityId: string | number): Promise<{
    entity: EntityRecord;
    links: EntityLink[];
    relatedCases: CaseReport[];
  }> {
    return this.request(`/entities/${entityId}`);
  }

  // Verification
  async runVerification(payload: { entityIdentifier: string; category?: string; provider?: string }): Promise<VerificationCheck> {
    return this.request<VerificationCheck>('/verification/check', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getVerificationHistory(): Promise<VerificationCheck[]> {
    return this.request<VerificationCheck[]>('/verification/history');
  }

  // Reports
  async getReports(): Promise<Array<{
    reportId: string;
    caseId: string;
    entityName: string;
    riskBand: string;
    generatedAt: string;
    fileSize: string;
  }>> {
    return this.request('/reports');
  }

  async downloadReportPdf(caseId: string): Promise<Blob> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const res = await fetch(`${API_BASE}/reports/${caseId}/download`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to download report PDF`);
    }
    return await res.blob();
  }

  // Reviewer Workspace
  async getReviewQueue(): Promise<CaseReport[]> {
    return this.request<CaseReport[]>('/review/queue');
  }

  async addReviewerNote(caseId: string, note: { noteContent: string; decision?: string }): Promise<ReviewerNote> {
    return this.request<ReviewerNote>(`/review/${caseId}/notes`, {
      method: 'POST',
      body: JSON.stringify(note)
    });
  }

  async decideEntityLink(caseId: string, linkId: number, decision: 'ACCEPTED' | 'REJECTED'): Promise<void> {
    return this.request(`/review/${caseId}/links/${linkId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision })
    });
  }

  // Source Management (Admin)
  async getSources(): Promise<SourceRecord[]> {
    return this.request<SourceRecord[]>('/admin/sources');
  }

  async updateSource(sourceId: number, updates: Partial<SourceRecord>): Promise<SourceRecord> {
    return this.request<SourceRecord>(`/admin/sources/${sourceId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async addSource(source: Partial<SourceRecord>): Promise<SourceRecord> {
    return this.request<SourceRecord>('/admin/sources', {
      method: 'POST',
      body: JSON.stringify(source)
    });
  }
}

export const api = new ApiService();
