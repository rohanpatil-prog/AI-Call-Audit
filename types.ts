
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface ComplianceIssue {
  id: string;
  category: string;
  excerpt: string;
  explanation: string;
  confidence: number;
  status: 'pending' | 'validated' | 'rejected';
  startTime?: number; // In seconds
  endTime?: number;   // In seconds
  notes?: string;     // Manual auditor notes
}

export interface TranscriptSegment {
  speaker: 'Agent' | 'Customer';
  text: string;
  timestamp?: string;
  issueId?: string;
}

export interface AuditMetadata {
  agentName: string;
  customerName: string;
  duration: string;
  department: string;
  callDate: string;
}

export interface AuditResults {
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  issues: ComplianceIssue[];
  transcript: TranscriptSegment[];
  metadata?: AuditMetadata;
}

export interface AuditSession {
  id: string;
  timestamp: string;
  filename: string;
  audioUrl?: string; // URL for the uploaded audio file
  results: AuditResults | null;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
}
