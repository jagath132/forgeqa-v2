export type BugSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type BugStatus = 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'FIXED' | 'CLOSED';
export type BugPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface Bug {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  status: BugStatus;
  severity: BugSeverity;
  priority: BugPriority;
  module: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  reporter: string;
  createdAt: string;
  updatedAt: string;
  slaBreachTime: string;
  isBreached: boolean;
  rootCauseAnalysis?: string;
  environment: {
    browser: string;
    os: string;
    screenRes: string;
    userAgent: string;
  };
  linkedTestCaseId?: string;
  tags: string[];
}

export type TestCasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TestCaseType = 'AUTOMATED' | 'MANUAL' | 'HYBRID';
export type TestExecutionStatus = 'PASSED' | 'FAILED' | 'BLOCKED' | 'SKIPPED' | 'UNTESTED';

export interface TestStep {
  stepNumber: number;
  action: string;
  data?: string;
  expectedResult: string;
}

export interface TestCaseV2 {
  id: string;
  title: string;
  suiteId: string;
  suiteName: string;
  description: string;
  priority: TestCasePriority;
  type: TestCaseType;
  status: TestExecutionStatus;
  preconditions: string[];
  steps: TestStep[];
  linkedRequirementId?: string;
  linkedBugId?: string;
  lastRunAt?: string;
  durationMs?: number;
  author: string;
  tags: string[];
  parameterizedData?: Record<string, string>[];
}

export interface TestSuiteV2 {
  id: string;
  name: string;
  description: string;
  testCaseCount: number;
  passRate: number;
  module: string;
  tags: string[];
}

export interface TestRunV2 {
  id: string;
  name: string;
  environment: string;
  suiteId: string;
  suiteName: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'SCHEDULED' | 'FAILED';
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  executedBy: string;
  stepResults: Record<string, TestExecutionStatus>;
}

export interface Requirement {
  id: string;
  code: string;
  title: string;
  description: string;
  acceptanceCriteria: { id: string; text: string; covered: boolean }[];
  coveragePercent: number;
  testCaseIds: string[];
  bugIds: string[];
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'IN_TEST';
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface ApiHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiAssertion {
  id: string;
  type: 'STATUS_CODE' | 'RESPONSE_TIME' | 'BODY_CONTAINS' | 'JSON_PATH';
  target: string;
  expected: string;
  passed?: boolean;
}

export interface ApiRequest {
  id: string;
  collectionId: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: ApiParam[];
  headers: ApiHeader[];
  authType: 'NONE' | 'BEARER' | 'API_KEY' | 'BASIC';
  authConfig: Record<string, string>;
  bodyType: 'NONE' | 'JSON' | 'FORM_DATA' | 'GRAPHQL' | 'RAW';
  body: string;
  preRequestScript?: string;
  assertions: ApiAssertion[];
}

export interface ApiResponse {
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  responseSizeBytes: number;
  headers: Record<string, string>;
  body: string;
  timestamp: string;
  assertionResults: {
    assertion: ApiAssertion;
    passed: boolean;
    actual: string;
  }[];
}

export interface ApiCollection {
  id: string;
  name: string;
  description: string;
  requests: ApiRequest[];
  variables: Record<string, string>;
}

export interface AutomationScript {
  id: string;
  name: string;
  framework: 'PLAYWRIGHT' | 'CYPRESS' | 'SELENIUM' | 'K6';
  language: 'TYPESCRIPT' | 'JAVASCRIPT' | 'PYTHON';
  code: string;
  lastExecutionStatus?: 'PASSED' | 'FAILED' | 'RUNNING';
  lastRunAt?: string;
  durationMs?: number;
}

export interface LoadTestConfig {
  id: string;
  name: string;
  targetUrl: string;
  virtualUsers: number;
  rampUpSeconds: number;
  durationSeconds: number;
  regions: string[];
  status: 'IDLE' | 'RUNNING' | 'COMPLETED';
}

export interface LoadMetricPoint {
  timeSeconds: number;
  virtualUsers: number;
  rps: number;
  p95LatencyMs: number;
  errorRatePercent: number;
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvssScore: number;
  endpoint: string;
  method: string;
  parameter?: string;
  description: string;
  remediation: string;
  vulnerableSnippet: string;
  secureSnippet: string;
  status: 'OPEN' | 'FALSE_POSITIVE' | 'REMEDIATED';
}

export interface VisualDiffItem {
  id: string;
  name: string;
  route: string;
  browser: 'Chrome 122' | 'Firefox 123' | 'Safari 17' | 'Edge 122';
  os: 'macOS Sonoma' | 'Windows 11' | 'iOS 17' | 'Android 14';
  baselineUrl: string;
  currentUrl: string;
  diffPercent: number;
  hasLayoutShift: boolean;
  status: 'DIFF_DETECTED' | 'MATCH' | 'ACCEPTED';
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeBlocks?: { language: string; code: string; title?: string }[];
  actionData?: any;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'BUG_TRACKER' | 'CI_CD' | 'COMMUNICATION' | 'MONITORING';
  icon: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'CONFIG_REQUIRED';
  description: string;
  syncInterval: string;
  lastSyncAt?: string;
}