export interface PipelineStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
}

export interface PipelineResult {
  answer?: string;
  chain?: string;
  stats: PipelineStats;
  detectedCorrection?: boolean;
}

export interface EvaluationPayload {
  success: boolean;
  error?: string;
  remediation?: string;
  question: string;
  direct: PipelineResult;
  cot: PipelineResult;
  corrected: PipelineResult;
}

export interface VirtualFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
}

export interface BenchmarkData {
  category: string;
  direct: number;
  cot: number;
  corrected: number;
}
