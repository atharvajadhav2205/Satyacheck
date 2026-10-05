export type InputType = 'text' | 'image' | 'voice' | 'pdf' | 'url';

export type VerdictType = 'supported' | 'contradicted' | 'misleading' | 'insufficient';

export interface Claim {
  id: string;
  text: string;
  verdict: VerdictType;
  confidence: number;
  explanation: string;
  evidenceIds: string[];
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  publishedDate: string;
  snippet: string;
  url: string;
}

export interface AnalysisResult {
  id: string;
  inputType: InputType;
  inputPreview: string;
  originalText?: string;
  language?: string;
  overallVerdict: VerdictType;
  overallConfidence: number;
  overallExplanation: string;
  claims: Claim[];
  sources: Source[];
  analyzedAt: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  inputType: InputType;
  shortClaim: string;
  verdict: VerdictType;
  confidence: number;
}

export interface AnalysisStep {
  label: string;
  status: 'done' | 'active' | 'pending';
}
