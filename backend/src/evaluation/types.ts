// backend/src/evaluation/types.ts
export interface Scenario {
  id: string;
  name: string;
  category: string;
  description: string;
  preconditions?: () => Promise<void>;
  request: { message: string };
  expected: { decision: 'ALLOW' | 'DENY'; outcome?: any };
}

export interface EvaluationResult {
  runId: string;
  scenarioId: string;
  status: 'PASS' | 'FAIL' | 'ERROR' | 'SKIPPED';
  expected: any;
  actual: any;
  failureReason?: string;
  requestId?: string;
  decision?: string;
  outcome?: any;
  timestamp: string;
}

export interface EvaluationRun {
  runId: string;
  start: string;
  end?: string;
  status: 'RUNNING' | 'COMPLETED' | 'ERROR';
  total: number;
  passed: number;
  failed: number;
  error: number;
  skipped: number;
}
