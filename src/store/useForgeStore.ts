import { create } from 'zustand';
import { api } from '../lib/api';
import type {
  Bug,
  BugStatus,
  BugSeverity,
  TestCaseV2,
  TestSuiteV2,
  TestRunV2,
  Requirement,
  ApiCollection,
  ApiRequest,
  ApiResponse,
  AutomationScript,
  LoadTestConfig,
  LoadMetricPoint,
  SecurityVulnerability,
  VisualDiffItem,
  AiChatMessage,
  IntegrationConnector,
} from '../types/v2';

export interface ForgeStoreState {
  activeWorkspace: string;
  activeEnvironment: 'Production' | 'Staging' | 'Localhost';
  setActiveWorkspace: (ws: string) => void;
  setActiveEnvironment: (env: 'Production' | 'Staging' | 'Localhost') => void;

  bugs: Bug[];
  addBug: (bug: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'slaBreachTime' | 'isBreached'>) => void;
  updateBugStatus: (id: string, status: BugStatus) => void;
  updateBugSeverity: (id: string, severity: BugSeverity) => void;
  deleteBug: (id: string) => void;

  testSuites: TestSuiteV2[];
  testCases: TestCaseV2[];
  testRuns: TestRunV2[];
  requirements: Requirement[];
  activeRunId: string | null;
  setActiveRunId: (id: string | null) => void;
  updateTestCaseStatus: (id: string, status: TestCaseV2['status']) => void;
  updateRunStep: (runId: string, testCaseId: string, status: TestCaseV2['status']) => void;
  addTestCase: (testCase: Omit<TestCaseV2, 'id'>) => void;

  apiCollections: ApiCollection[];
  activeRequestId: string;
  activeResponse: ApiResponse | null;
  isSendingRequest: boolean;
  setActiveRequestId: (id: string) => void;
  updateActiveRequest: (updates: Partial<ApiRequest>) => void;
  sendActiveRequest: () => Promise<void>;
  addApiRequest: (collectionId: string, request: Omit<ApiRequest, 'id' | 'collectionId'>) => void;

  scripts: AutomationScript[];
  activeScriptId: string;
  isRunningAutomation: boolean;
  terminalLogs: string[];
  setActiveScriptId: (id: string) => void;
  updateScriptCode: (id: string, code: string) => void;
  runAutomationScript: (id: string) => Promise<void>;

  loadTestConfig: LoadTestConfig;
  loadMetrics: LoadMetricPoint[];
  isLoadTestRunning: boolean;
  startLoadTest: () => void;
  stopLoadTest: () => void;

  vulnerabilities: SecurityVulnerability[];
  isSecurityScanRunning: boolean;
  securityScore: number;
  runSecurityScan: () => Promise<void>;
  updateVulnerabilityStatus: (id: string, status: SecurityVulnerability['status']) => void;

  visualDiffs: VisualDiffItem[];
  activeDiffId: string;
  setActiveDiffId: (id: string) => void;
  acceptBaseline: (id: string) => void;

  aiMessages: AiChatMessage[];
  isAiGenerating: boolean;
  sendAiMessage: (prompt: string, contextModule?: string) => Promise<void>;
  clearAiChat: () => void;

  integrations: IntegrationConnector[];
  toggleIntegration: (id: string) => void;

  notifications: { id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; timestamp: string; read: boolean }[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const initialBugs: Bug[] = [
  {
    id: 'BUG-1042',
    title: 'Stripe webhook signature validation fails on raw payload buffer',
    description: 'When processing customer.subscription.created events, the raw body is pre-parsed by body-parser json middleware, corrupting the HMAC signature.',
    stepsToReproduce: [
      'Trigger stripe cli: stripe trigger customer.subscription.created',
      'Inspect POST /api/billing/webhook endpoint response',
      'Observe HTTP 400 Bad Request with "Webhook signature verification failed"'
    ],
    expectedResult: 'Webhook passes signature validation and provisions user subscription plan.',
    actualResult: 'Signature comparison fails due to pre-consumed UTF-8 string encoding.',
    status: 'OPEN',
    severity: 'CRITICAL',
    priority: 'P0',
    module: 'Billing & Payments',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Backend Lead'
    },
    reporter: 'Siddharth M. (QA Lead)',
    createdAt: '2026-10-24 14:20',
    updatedAt: '2026-10-25 09:15',
    slaBreachTime: '2h 15m remaining',
    isBreached: false,
    rootCauseAnalysis: 'Middleware order issue: Express body-parser parses stream before raw buffer capture for stripe.webhooks.constructEvent().',
    environment: {
      browser: 'cURL / Webhook Dispatcher',
      os: 'Linux Alpine (Docker)',
      screenRes: 'Headless',
      userAgent: 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
    },
    linkedTestCaseId: 'TC-301',
    tags: ['Stripe', 'Security', 'SLA-At-Risk']
  },
  {
    id: 'BUG-1043',
    title: 'Concurrent 401 token refresh queue drops parallel requests',
    description: 'When 50 simultaneous API calls receive 401 Unauthorized, only the first request triggers a refresh while remaining requests reject immediately.',
    stepsToReproduce: [
      'Log into dashboard and invalidate session token in Redis',
      'Trigger bulk export with 20 concurrent micro-queries',
      'Check network tab: 1 request 200, 19 requests fail 401 without retry'
    ],
    expectedResult: 'All parallel 401 requests pause and retry successfully once new token is obtained.',
    actualResult: 'Pending refresh queue promise terminates early without queueing retry callers.',
    status: 'IN_PROGRESS',
    severity: 'HIGH',
    priority: 'P1',
    module: 'Auth & Session',
    assignee: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
      role: 'Fullstack Dev'
    },
    reporter: 'Jagath (Automation Eng)',
    createdAt: '2026-10-23 11:30',
    updatedAt: '2026-10-25 10:00',
    slaBreachTime: '6h 40m remaining',
    isBreached: false,
    rootCauseAnalysis: 'isRefreshing boolean flag rejects newcomers rather than resolving a shared pendingRefresh promise.',
    environment: {
      browser: 'Chrome 122',
      os: 'macOS Sonoma',
      screenRes: '1920x1080',
      userAgent: 'Mozilla/5.0 Chrome/122.0.0.0 Safari/537.36'
    },
    linkedTestCaseId: 'TC-302',
    tags: ['Auth', 'Concurrency', 'Network']
  },
  {
    id: 'BUG-1044',
    title: 'Cart drawer recalculation lag on bulk item quantity decrement',
    description: 'Updating item count from 10 to 1 causes 600ms layout freezing in Checkout drawer due to unbounded re-renders.',
    stepsToReproduce: [
      'Add 5 items with 10 quantity to shopping cart',
      'Rapidly click "-" decrement button 5 times',
      'Observe UI freeze and 600ms frame drop'
    ],
    expectedResult: 'Debounced price recalculation with optimistic UI counter update.',
    actualResult: 'Cart recalculation fires expensive synchronous tax recalculation on every click.',
    status: 'FIXED',
    severity: 'MEDIUM',
    priority: 'P2',
    module: 'Checkout Flow',
    assignee: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      role: 'Frontend Dev'
    },
    reporter: 'Ananya Roy',
    createdAt: '2026-10-22 16:45',
    updatedAt: '2026-10-24 18:20',
    slaBreachTime: 'Met',
    isBreached: false,
    environment: {
      browser: 'Safari 17.2',
      os: 'iOS 17.3 (iPhone 15)',
      screenRes: '393x852',
      userAgent: 'Mozilla/5.0 Mobile/15E148 Safari/604.1'
    },
    tags: ['Performance', 'Frontend', 'Mobile']
  },
  {
    id: 'BUG-1045',
    title: 'Password reset link exposes unescaped token in referrer header',
    description: 'Navigating away from the reset password page leaks the reset token to external CDN assets via the Referer HTTP header.',
    stepsToReproduce: [
      'Click password reset link in email',
      'Open network tab while loading',
      'Inspect external font or CDN request Referer header'
    ],
    expectedResult: 'Referrer-Policy: no-referrer or strict-origin-when-cross-origin protects token.',
    actualResult: 'Token query parameter leaked in full URL referrer.',
    status: 'CLOSED',
    severity: 'CRITICAL',
    priority: 'P0',
    module: 'Security & Auth',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Backend Lead'
    },
    reporter: 'ForgeQA OWASP Scanner',
    createdAt: '2026-10-21 09:00',
    updatedAt: '2026-10-22 14:00',
    slaBreachTime: 'Met',
    isBreached: false,
    environment: {
      browser: 'Firefox 123',
      os: 'Windows 11',
      screenRes: '2560x1440',
      userAgent: 'Mozilla/5.0 Gecko/20100101 Firefox/123.0'
    },
    tags: ['Security', 'OWASP-A01', 'Verified']
  },
  {
    id: 'BUG-1046',
    title: 'Checkout button disabled state flickers on zip code validation',
    description: 'Typing zip code 560001 causes place order button to rapidly toggle between disabled and enabled states.',
    stepsToReproduce: [
      'Go to /checkout',
      'Enter valid street address',
      'Type zip code 560001 with 150ms delay per key'
    ],
    expectedResult: 'Button remains disabled until debounced address verification returns HTTP 200.',
    actualResult: 'Asynchronous validation race causes button to enable before zip code verification completes.',
    status: 'NEW',
    severity: 'LOW',
    priority: 'P3',
    module: 'Checkout Flow',
    assignee: {
      name: 'Unassigned',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      role: 'Triage'
    },
    reporter: 'Kavita N.',
    createdAt: '2026-10-25 09:40',
    updatedAt: '2026-10-25 09:40',
    slaBreachTime: '48h remaining',
    isBreached: false,
    environment: {
      browser: 'Chrome 122',
      os: 'Windows 11',
      screenRes: '1920x1080',
      userAgent: 'Mozilla/5.0 Chrome/122.0.0.0 Safari/537.36'
    },
    tags: ['UI/UX', 'Checkout']
  }
];

const initialTestSuites: TestSuiteV2[] = [
  {
    id: 'SUITE-01',
    name: 'Auth & Identity Core',
    description: 'OAuth2, JWT authentication, session expiration, and MFA challenges',
    testCaseCount: 16,
    passRate: 93.7,
    module: 'Authentication',
    tags: ['Core', 'Smoke', 'P0']
  },
  {
    id: 'SUITE-02',
    name: 'Stripe Checkout & Billing v2',
    description: 'Credit card 3DS verification, webhook processing, recurring billing',
    testCaseCount: 24,
    passRate: 91.6,
    module: 'Billing',
    tags: ['Revenue-Critical', 'E2E', 'P0']
  },
  {
    id: 'SUITE-03',
    name: 'API Gateway & Rate Limiter',
    description: 'Token bucket rate limiting, proxy latency, and DDoS protection',
    testCaseCount: 18,
    passRate: 100,
    module: 'Infrastructure',
    tags: ['Performance', 'P1']
  },
  {
    id: 'SUITE-04',
    name: 'Cross-Browser UI Regression',
    description: 'Pixel-perfect visual assertions across Desktop, Tablet, and Mobile',
    testCaseCount: 38,
    passRate: 89.4,
    module: 'Frontend',
    tags: ['Visual', 'Nightly', 'P1']
  }
];

const initialTestCases: TestCaseV2[] = [
  {
    id: 'TC-301',
    title: 'Verify 3D Secure 2.0 card checkout with biometric OTP challenge',
    suiteId: 'SUITE-02',
    suiteName: 'Stripe Checkout & Billing v2',
    description: 'Ensures European SCA (Strong Customer Authentication) cards trigger 3DS modal and succeed on OTP validation.',
    priority: 'CRITICAL',
    type: 'AUTOMATED',
    status: 'PASSED',
    preconditions: ['User is logged in', 'Cart total is > €50.00', 'Stripe test card 4000 0027 6000 3184 used'],
    steps: [
      { stepNumber: 1, action: 'Navigate to checkout page /checkout', expectedResult: 'Checkout form loads with order summary.' },
      { stepNumber: 2, action: 'Fill test 3DS card credentials and submit', expectedResult: 'Stripe 3DS modal iframe opens.' },
      { stepNumber: 3, action: 'Click "Authorize Test Payment" inside iframe', expectedResult: 'Payment confirms, redirects to /order-success.' }
    ],
    linkedRequirementId: 'REQ-101',
    linkedBugId: 'BUG-1042',
    lastRunAt: '2026-10-25 09:30',
    durationMs: 2410,
    author: 'Jagath (Automation Lead)',
    tags: ['Stripe', '3DS', 'E2E']
  },
  {
    id: 'TC-302',
    title: 'Verify concurrent token refresh under 50 simultaneous requests',
    suiteId: 'SUITE-01',
    suiteName: 'Auth & Identity Core',
    description: 'Simulates 50 parallel requests with expired access token to ensure exactly 1 refresh call and zero dropped requests.',
    priority: 'HIGH',
    type: 'AUTOMATED',
    status: 'FAILED',
    preconditions: ['Access token expired in memory', 'Valid refresh token in HttpOnly cookie'],
    steps: [
      { stepNumber: 1, action: 'Dispatch 50 Promise.all GET /api/user/profile', expectedResult: 'All 50 calls receive 401 response.' },
      { stepNumber: 2, action: 'Interceptor captures 401 and calls POST /api/auth/refresh', expectedResult: 'Single refresh request executes.' },
      { stepNumber: 3, action: 'Retry all 50 original requests with new bearer token', expectedResult: 'All 50 requests resolve with HTTP 200.' }
    ],
    linkedRequirementId: 'REQ-102',
    linkedBugId: 'BUG-1043',
    lastRunAt: '2026-10-25 10:15',
    durationMs: 1850,
    author: 'Siddharth M.',
    tags: ['Auth', 'Concurrency']
  },
  {
    id: 'TC-303',
    title: 'Verify session termination after 15 minutes of inactivity',
    suiteId: 'SUITE-01',
    suiteName: 'Auth & Identity Core',
    description: 'Validates that background idle timer clears local memory and prompts re-authentication modal.',
    priority: 'MEDIUM',
    type: 'MANUAL',
    status: 'PASSED',
    preconditions: ['User active in dashboard'],
    steps: [
      { stepNumber: 1, action: 'Leave application idle without mouse/key events for 900 seconds', expectedResult: 'Session timeout banner appears at 14:00.' },
      { stepNumber: 2, action: 'Wait until 15:00 timestamp', expectedResult: 'User redirected to /auth with returnUrl set.' }
    ],
    linkedRequirementId: 'REQ-102',
    lastRunAt: '2026-10-24 16:00',
    durationMs: 900000,
    author: 'Ananya Roy',
    tags: ['Security', 'Session']
  },
  {
    id: 'TC-304',
    title: 'Verify SQL injection boundary in search query parameters',
    suiteId: 'SUITE-03',
    suiteName: 'API Gateway & Rate Limiter',
    description: 'Fuzzes search endpoint with standard SQLi vectors to verify parameterization and WAF blocking.',
    priority: 'CRITICAL',
    type: 'AUTOMATED',
    status: 'PASSED',
    preconditions: ['API gateway running with WAF rule-set active'],
    steps: [
      { stepNumber: 1, action: 'Send GET /api/search?q=1%27%20OR%20%271%27=%271', expectedResult: 'HTTP 400 or sanitized 200 with 0 results.' },
      { stepNumber: 2, action: 'Inspect response headers for WAF signature', expectedResult: 'No database syntax error or stack trace leaked.' }
    ],
    linkedRequirementId: 'REQ-103',
    lastRunAt: '2026-10-25 08:00',
    durationMs: 310,
    author: 'ForgeQA OWASP Scanner',
    tags: ['Security', 'SQLi', 'Automated']
  },
  {
    id: 'TC-305',
    title: 'Verify responsive checkout drawer on mobile viewport 375px',
    suiteId: 'SUITE-04',
    suiteName: 'Cross-Browser UI Regression',
    description: 'Pixel-level visual regression test ensuring checkout CTA is pinned and visible above mobile keyboard.',
    priority: 'MEDIUM',
    type: 'AUTOMATED',
    status: 'PASSED',
    preconditions: ['Viewport resized to 375x667 (iPhone SE)'],
    steps: [
      { stepNumber: 1, action: 'Open cart drawer on mobile viewport', expectedResult: 'Drawer slides up smoothly from bottom.' },
      { stepNumber: 2, action: 'Focus address input and trigger virtual keyboard', expectedResult: 'Sticky checkout CTA remains pinned above bottom safe area.' }
    ],
    linkedRequirementId: 'REQ-104',
    lastRunAt: '2026-10-25 07:45',
    durationMs: 1420,
    author: 'Jagath',
    tags: ['Visual', 'Mobile', 'Responsive']
  }
];

const initialTestRuns: TestRunV2[] = [
  {
    id: 'RUN-9021',
    name: 'Nightly Core Regression - Staging US-East',
    environment: 'Staging (v2.4.0-rc3)',
    suiteId: 'SUITE-ALL',
    suiteName: 'Full Regression Suite',
    status: 'COMPLETED',
    startedAt: '2026-10-25 03:00',
    completedAt: '2026-10-25 03:18',
    durationSeconds: 1080,
    totalTests: 96,
    passed: 91,
    failed: 3,
    blocked: 1,
    skipped: 1,
    executedBy: 'GitHub Actions (#142)',
    stepResults: {
      'TC-301': 'PASSED',
      'TC-302': 'FAILED',
      'TC-303': 'PASSED',
      'TC-304': 'PASSED',
      'TC-305': 'PASSED'
    }
  },
  {
    id: 'RUN-9022',
    name: 'PR #418 - Stripe SCA Payment Verification',
    environment: 'Preview Environment',
    suiteId: 'SUITE-02',
    suiteName: 'Stripe Checkout & Billing v2',
    status: 'IN_PROGRESS',
    startedAt: '2026-10-25 10:20',
    durationSeconds: 240,
    totalTests: 24,
    passed: 18,
    failed: 1,
    blocked: 0,
    skipped: 5,
    executedBy: 'Alex Rivera (Manual Trigger)',
    stepResults: {
      'TC-301': 'PASSED',
      'TC-302': 'FAILED'
    }
  }
];

const initialRequirements: Requirement[] = [
  {
    id: 'REQ-101',
    code: 'REQ-CHECKOUT-01',
    title: 'Support European 3DS 2.0 Biometric Card Authentication',
    description: 'System must automatically identify cards requiring 3DS challenge and display bank challenge iframe seamlessly without page reload.',
    acceptanceCriteria: [
      { id: 'AC-1', text: 'Stripe paymentIntent returns status requires_action when card mandates 3DS', covered: true },
      { id: 'AC-2', text: 'Bank OTP modal renders with responsive mobile container', covered: true },
      { id: 'AC-3', text: 'Cancelling 3DS dialog returns user to review order step without losing cart items', covered: false }
    ],
    coveragePercent: 66.7,
    testCaseIds: ['TC-301'],
    bugIds: ['BUG-1042'],
    status: 'IN_TEST'
  },
  {
    id: 'REQ-102',
    code: 'REQ-AUTH-02',
    title: 'Seamless Token Refresh with Zero-Drop Concurrency',
    description: 'When JWT access token expires (15m TTL), client must transparently queue pending requests and reissue upon refresh.',
    acceptanceCriteria: [
      { id: 'AC-1', text: 'No user sees a 401 toast if valid refresh token exists in cookie', covered: false },
      { id: 'AC-2', text: 'Only 1 network call to /api/auth/refresh made for N concurrent 401s', covered: false }
    ],
    coveragePercent: 0,
    testCaseIds: ['TC-302', 'TC-303'],
    bugIds: ['BUG-1043'],
    status: 'REVIEW'
  },
  {
    id: 'REQ-103',
    code: 'REQ-SEC-01',
    title: 'OWASP Top 10 API Security Compliance',
    description: 'All public REST endpoints must enforce rate limiting, parameterized queries, and CORS origin whitelisting.',
    acceptanceCriteria: [
      { id: 'AC-1', text: 'No SQL or NoSQL injection payloads leak database structure', covered: true },
      { id: 'AC-2', text: 'Burst limit capped at 100 requests per IP per minute', covered: true }
    ],
    coveragePercent: 100,
    testCaseIds: ['TC-304'],
    bugIds: ['BUG-1045'],
    status: 'APPROVED'
  }
];

const initialApiCollections: ApiCollection[] = [
  {
    id: 'COL-01',
    name: 'ForgeQA Core REST API',
    description: 'Authentication, test case execution, and defect endpoints',
    variables: {
      baseUrl: 'http://localhost:5001',
      authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfOTA4In0...'
    },
    requests: [
      {
        id: 'REQ-API-01',
        collectionId: 'COL-01',
        name: 'Get Quality Dashboard Metrics',
        method: 'GET',
        url: '{{baseUrl}}/api/admin/stats',
        params: [{ key: 'timeRange', value: '30d', enabled: true }],
        headers: [
          { key: 'Accept', value: 'application/json', enabled: true },
          { key: 'Authorization', value: 'Bearer {{authToken}}', enabled: true }
        ],
        authType: 'BEARER',
        authConfig: { token: '{{authToken}}' },
        bodyType: 'NONE',
        body: '',
        assertions: [
          { id: 'AS-1', type: 'STATUS_CODE', target: 'status', expected: '200', passed: true },
          { id: 'AS-2', type: 'RESPONSE_TIME', target: 'responseTime', expected: '< 300ms', passed: true },
          { id: 'AS-3', type: 'BODY_CONTAINS', target: 'body', expected: 'qualityScore', passed: true }
        ]
      },
      {
        id: 'REQ-API-02',
        collectionId: 'COL-01',
        name: 'Create Defect with AI Deduplication',
        method: 'POST',
        url: '{{baseUrl}}/api/bugs',
        params: [],
        headers: [
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'Authorization', value: 'Bearer {{authToken}}', enabled: true }
        ],
        authType: 'BEARER',
        authConfig: { token: '{{authToken}}' },
        bodyType: 'JSON',
        body: JSON.stringify({
          title: 'Payment gateway timeout on 3DS callback',
          severity: 'CRITICAL',
          module: 'Billing',
          steps: ['Trigger payment', 'Wait 30s for OTP', 'Submit callback']
        }, null, 2),
        assertions: [
          { id: 'AS-1', type: 'STATUS_CODE', target: 'status', expected: '201', passed: true },
          { id: 'AS-2', type: 'JSON_PATH', target: '$.data.status', expected: 'NEW', passed: true }
        ]
      }
    ]
  }
];

const initialScripts: AutomationScript[] = [
  {
    id: 'SCR-01',
    name: 'checkout.spec.ts',
    framework: 'PLAYWRIGHT',
    language: 'TYPESCRIPT',
    lastExecutionStatus: 'PASSED',
    lastRunAt: '2026-10-25 09:30',
    durationMs: 3120,
    code: "// Playwright E2E Suite\nimport { test, expect } from '@playwright/test';\n\ntest('Complete 3DS purchase', async ({ page }) => {\n  await page.goto('https://staging.forgeqa.in/pricing');\n  await page.click('button:has-text(\"Subscribe to Pro\")');\n  await page.fill('#card-number', '4000 0027 6000 3184');\n  await page.click('button#submit-payment');\n  await expect(page).toHaveURL(/.*checkout\\/success/);\n});"
  },
  {
    id: 'SCR-02',
    name: 'auth-concurrency.cy.ts',
    framework: 'CYPRESS',
    language: 'TYPESCRIPT',
    lastExecutionStatus: 'FAILED',
    lastRunAt: '2026-10-25 10:15',
    durationMs: 2480,
    code: "// Cypress Test Suite\ndescribe('Auth Token Concurrency', () => {\n  it('handles 50 parallel requests', () => {\n    cy.loginViaApi();\n    cy.request('/api/user/profile').its('status').should('eq', 200);\n  });\n});"
  }
];

const initialVulnerabilities: SecurityVulnerability[] = [
  {
    id: 'SEC-801',
    title: 'Reflected Cross-Site Scripting (XSS) in Search Filter',
    category: 'OWASP A03:2021-Injection',
    severity: 'HIGH',
    cvssScore: 7.4,
    endpoint: '/api/search',
    method: 'GET',
    parameter: 'query',
    description: 'Unsanitized user search term is echoed directly into response HTML without proper entity encoding.',
    remediation: 'Use HTML entity encoding on search query outputs or sanitize using DOMPurify.',
    vulnerableSnippet: "const html = '<div>Results: ' + req.query.query + '</div>';\nres.send(html);",
    secureSnippet: "import escapeHtml from 'escape-html';\nconst safe = escapeHtml(req.query.query || '');\nres.send('<div>Results: ' + safe + '</div>');",
    status: 'OPEN'
  },
  {
    id: 'SEC-802',
    title: 'Missing Rate Limiting on Password Reset Endpoint',
    category: 'OWASP A04:2021-Insecure Design',
    severity: 'HIGH',
    cvssScore: 7.5,
    endpoint: '/api/auth/forgot-password',
    method: 'POST',
    description: 'Endpoint allows unlimited password reset emails to be requested, enabling email bombing and user enumeration.',
    remediation: 'Attach Redis token-bucket rate limiter limiting requests to 3 per IP per hour.',
    vulnerableSnippet: "app.post('/api/auth/forgot-password', async (req, res) => {\n  await sendResetEmail(req.body.email);\n  res.json({ success: true });\n});",
    secureSnippet: "const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3 });\napp.post('/api/auth/forgot-password', limiter, async (req, res) => {\n  await sendResetEmail(req.body.email);\n  res.json({ success: true });\n});",
    status: 'OPEN'
  }
];

const initialVisualDiffs: VisualDiffItem[] = [
  {
    id: 'DIFF-01',
    name: 'Pricing Page Annual Toggle',
    route: '/pricing',
    browser: 'Chrome 122',
    os: 'macOS Sonoma',
    baselineUrl: '/mockups/01_command_center.jpg',
    currentUrl: '/mockups/01_command_center.jpg',
    diffPercent: 0.04,
    hasLayoutShift: false,
    status: 'MATCH'
  },
  {
    id: 'DIFF-02',
    name: 'Checkout Drawer Mobile Layout',
    route: '/checkout',
    browser: 'Safari 17',
    os: 'iOS 17',
    baselineUrl: '/mockups/04_test_management.jpg',
    currentUrl: '/mockups/04_test_management.jpg',
    diffPercent: 4.8,
    hasLayoutShift: true,
    status: 'DIFF_DETECTED'
  }
];

const initialIntegrations: IntegrationConnector[] = [
  {
    id: 'INT-JIRA',
    name: 'Atlassian Jira',
    category: 'BUG_TRACKER',
    icon: 'jira',
    status: 'CONNECTED',
    description: 'Bidirectional bug sync, epic linking, and sprint velocity tracking.',
    syncInterval: 'Every 5 min',
    lastSyncAt: '2 mins ago'
  },
  {
    id: 'INT-GITHUB',
    name: 'GitHub Actions',
    category: 'CI_CD',
    icon: 'github',
    status: 'CONNECTED',
    description: 'Automatic test execution on pull request and deployment quality gates.',
    syncInterval: 'Realtime Webhook',
    lastSyncAt: '12 mins ago'
  },
  {
    id: 'INT-SLACK',
    name: 'Slack Alerts',
    category: 'COMMUNICATION',
    icon: 'slack',
    status: 'CONNECTED',
    description: 'Instant notifications in #qa-alerts on failed test runs and critical SLA breaches.',
    syncInterval: 'Instant',
    lastSyncAt: 'Just now'
  },
  {
    id: 'INT-TESTRAIL',
    name: 'TestRail Universal Sync',
    category: 'BUG_TRACKER',
    icon: 'testrail',
    status: 'CONFIG_REQUIRED',
    description: 'Import test cases, test suites, and milestones seamlessly from TestRail.',
    syncInterval: 'Manual Import',
  },
  {
    id: 'INT-POSTMAN',
    name: 'Postman Collection Bridge',
    category: 'CI_CD',
    icon: 'postman',
    status: 'CONNECTED',
    description: 'Import and export collections, environments, and mock server definitions.',
    syncInterval: 'On-Demand',
    lastSyncAt: '1 hour ago'
  }
];

export const useForgeStore = create<ForgeStoreState>((set, get) => ({
  activeWorkspace: 'Acme E-Commerce QA',
  activeEnvironment: 'Staging',
  setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),
  setActiveEnvironment: (env) => set({ activeEnvironment: env }),

  bugs: initialBugs,
  addBug: (bugData) => {
    const newBug: Bug = {
      ...bugData,
      id: 'BUG-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      slaBreachTime: '24h remaining',
      isBreached: false
    };
    set((state) => ({ bugs: [newBug, ...state.bugs] }));
  },
  updateBugStatus: (id, status) => {
    set((state) => ({
      bugs: state.bugs.map((b) => (b.id === id ? { ...b, status, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : b))
    }));
  },
  updateBugSeverity: (id, severity) => {
    set((state) => ({
      bugs: state.bugs.map((b) => (b.id === id ? { ...b, severity } : b))
    }));
  },
  deleteBug: (id) => {
    set((state) => ({
      bugs: state.bugs.filter((b) => b.id !== id)
    }));
  },

  testSuites: initialTestSuites,
  testCases: initialTestCases,
  testRuns: initialTestRuns,
  requirements: initialRequirements,
  activeRunId: null,
  setActiveRunId: (id) => set({ activeRunId: id }),
  updateTestCaseStatus: (id, status) => {
    set((state) => ({
      testCases: state.testCases.map((tc) => (tc.id === id ? { ...tc, status, lastRunAt: 'Just now' } : tc))
    }));
  },
  updateRunStep: (runId, testCaseId, status) => {
    set((state) => ({
      testRuns: state.testRuns.map((r) => {
        if (r.id !== runId) return r;
        const newResults = { ...r.stepResults, [testCaseId]: status };
        const passed = Object.values(newResults).filter((s) => s === 'PASSED').length;
        const failed = Object.values(newResults).filter((s) => s === 'FAILED').length;
        return { ...r, stepResults: newResults, passed, failed };
      })
    }));
  },
  addTestCase: (data) => {
    const newTc: TestCaseV2 = {
      ...data,
      id: 'TC-' + Math.floor(300 + Math.random() * 700),
      status: 'UNTESTED'
    };
    set((state) => ({ testCases: [newTc, ...state.testCases] }));
  },

  apiCollections: initialApiCollections,
  activeRequestId: 'REQ-API-01',
  activeResponse: {
    statusCode: 200,
    statusText: 'OK',
    responseTimeMs: 142,
    responseSizeBytes: 3420,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-cache',
      'x-forgeqa-latency': '142ms'
    },
    body: JSON.stringify({
      status: 'success',
      qualityScore: 87,
      healthGrade: 'Release Ready',
      activeRunCount: 2,
      openDefects: { critical: 2, high: 4, medium: 5, low: 3 },
      coveragePercent: 94.2
    }, null, 2),
    timestamp: new Date().toLocaleTimeString(),
    assertionResults: [
      { assertion: { id: 'AS-1', type: 'STATUS_CODE', target: 'status', expected: '200' }, passed: true, actual: '200' },
      { assertion: { id: 'AS-2', type: 'RESPONSE_TIME', target: 'responseTime', expected: '< 300ms' }, passed: true, actual: '142ms' },
      { assertion: { id: 'AS-3', type: 'BODY_CONTAINS', target: 'body', expected: 'qualityScore' }, passed: true, actual: 'Found' }
    ]
  },
  isSendingRequest: false,
  setActiveRequestId: (id) => set({ activeRequestId: id }),
  updateActiveRequest: (updates) => {
    set((state) => ({
      apiCollections: state.apiCollections.map((col) => ({
        ...col,
        requests: col.requests.map((r) => (r.id === state.activeRequestId ? { ...r, ...updates } : r))
      }))
    }));
  },
  sendActiveRequest: async () => {
    const state = get();
    const request = state.apiCollections.flatMap((collection) => collection.requests)
      .find((item) => item.id === state.activeRequestId);
    if (!request) return;
    set({ isSendingRequest: true });
    const started = performance.now();
    try {
      const variables = state.apiCollections.find((collection) => collection.id === request.collectionId)?.variables ?? {};
      const interpolate = (value: string) => value.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => variables[key.trim()] ?? '');
      const url = new URL(interpolate(request.url));
      for (const param of request.params.filter((item) => item.enabled && item.key)) url.searchParams.set(param.key, interpolate(param.value));
      const headers = Object.fromEntries(request.headers.filter((item) => item.enabled && item.key).map((item) => [interpolate(item.key), interpolate(item.value)]));
      if (request.authType === 'BEARER' && request.authConfig.token) headers.Authorization = `Bearer ${interpolate(request.authConfig.token)}`;
      if (request.authType === 'API_KEY' && request.authConfig.key) headers[request.authConfig.header || 'X-API-Key'] = interpolate(request.authConfig.key);
      if (request.authType === 'BASIC' && request.authConfig.username) headers.Authorization = `Basic ${btoa(`${interpolate(request.authConfig.username)}:${interpolate(request.authConfig.password || '')}`)}`;
      const response = await fetch(url, {
        method: request.method,
        headers,
        ...(request.method !== 'GET' && request.method !== 'HEAD' && request.bodyType !== 'NONE' && request.body
          ? { body: interpolate(request.body) } : {}),
      });
      const body = await response.text();
      const responseTimeMs = Math.round(performance.now() - started);
      const assertions = request.assertions.map((assertion) => {
        let actual = '';
        if (assertion.type === 'STATUS_CODE') actual = String(response.status);
        else if (assertion.type === 'RESPONSE_TIME') actual = `${responseTimeMs}ms`;
        else if (assertion.type === 'BODY_CONTAINS') actual = body.includes(assertion.expected) ? assertion.expected : 'not found';
        else if (assertion.type === 'JSON_PATH') {
          try {
            const parsed: unknown = JSON.parse(body);
            actual = assertion.target.replace(/^\$\.?/, '').split('.').filter(Boolean).reduce<unknown>((value, key) => value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined, parsed) as string ?? '';
          } catch { actual = ''; }
        }
        const passed = assertion.type === 'RESPONSE_TIME'
          ? responseTimeMs < (Number(assertion.expected.match(/\d+/)?.[0]) || 0)
          : actual === assertion.expected || (assertion.type === 'BODY_CONTAINS' && actual !== 'not found');
        return { assertion: { ...assertion, passed }, passed, actual };
      });
      const responseHeaders = Object.fromEntries(response.headers.entries());
      set({ activeResponse: {
        statusCode: response.status, statusText: response.statusText, responseTimeMs,
        responseSizeBytes: new Blob([body]).size, headers: responseHeaders, body,
        timestamp: new Date().toLocaleTimeString(), assertionResults: assertions,
      } });
    } catch (error) {
      set({ activeResponse: {
        statusCode: 0, statusText: 'Request failed', responseTimeMs: Math.round(performance.now() - started),
        responseSizeBytes: 0, headers: {}, body: error instanceof Error ? error.message : 'Request failed',
        timestamp: new Date().toLocaleTimeString(), assertionResults: [],
      } });
    } finally {
      set({ isSendingRequest: false });
    }
  },
  addApiRequest: (collectionId, reqData) => {
    const newReq: ApiRequest = {
      ...reqData,
      id: 'REQ-API-' + Math.floor(10 + Math.random() * 90),
      collectionId
    };
    set((state) => ({
      apiCollections: state.apiCollections.map((c) => (c.id === collectionId ? { ...c, requests: [...c.requests, newReq] } : c)),
      activeRequestId: newReq.id
    }));
  },

  scripts: initialScripts,
  activeScriptId: 'SCR-01',
  isRunningAutomation: false,
  terminalLogs: [
    'ForgeQA Cloud Runner v2.4.0 [linux-x64-headless]',
    'Initializing Playwright browser container (Chromium 122.0.6261.29)...',
    '-> Navigating to https://staging.forgeqa.in/pricing',
    '-> Click button:has-text("Subscribe to Pro")',
    '-> Fill card elements: 4000 0027 6000 3184',
    '-> Intercepting Stripe 3DS Challenge IFrame...',
    '-> Verified 3DS authorization status: SUCCESS',
    '✓ 1 test passed (3.12s)'
  ],
  setActiveScriptId: (id) => set({ activeScriptId: id }),
  updateScriptCode: (id, code) => {
    set((state) => ({
      scripts: state.scripts.map((s) => (s.id === id ? { ...s, code } : s))
    }));
  },
  runAutomationScript: async (_id) => {
    set({ isRunningAutomation: true, terminalLogs: ['[ForgeQA Runner] Starting script execution...'] });
    const logSteps = [
      '-> Compiling TypeScript specifications...',
      '-> Spawning isolated Chromium browser instance (1920x1080)...',
      '-> Executing test suite steps...',
      '-> Assertion: URL matches expected pattern -> PASSED',
      '-> Assertion: Plan badge contains "Pro Plan Active" -> PASSED',
      '✓ Test completed successfully with 0 errors in 2.84s.'
    ];
    for (const step of logSteps) {
      await new Promise((res) => setTimeout(res, 400));
      set((state) => ({ terminalLogs: [...state.terminalLogs, step] }));
    }
    set({ isRunningAutomation: false });
  },

  loadTestConfig: {
    id: 'LT-01',
    name: 'Checkout Peak Stress Test',
    targetUrl: 'https://staging.forgeqa.in/api/checkout',
    virtualUsers: 500,
    rampUpSeconds: 30,
    durationSeconds: 120,
    regions: ['US-East (N. Virginia)', 'EU-Central (Frankfurt)', 'AP-South (Mumbai)'],
    status: 'IDLE'
  },
  loadMetrics: [
    { timeSeconds: 0, virtualUsers: 50, rps: 80, p95LatencyMs: 110, errorRatePercent: 0 },
    { timeSeconds: 10, virtualUsers: 150, rps: 220, p95LatencyMs: 135, errorRatePercent: 0 },
    { timeSeconds: 20, virtualUsers: 300, rps: 390, p95LatencyMs: 180, errorRatePercent: 0.01 },
    { timeSeconds: 30, virtualUsers: 500, rps: 520, p95LatencyMs: 240, errorRatePercent: 0.02 },
    { timeSeconds: 40, virtualUsers: 500, rps: 515, p95LatencyMs: 245, errorRatePercent: 0.01 },
    { timeSeconds: 50, virtualUsers: 500, rps: 530, p95LatencyMs: 250, errorRatePercent: 0.03 }
  ],
  isLoadTestRunning: false,
  startLoadTest: () => {
    set({ isLoadTestRunning: true, loadTestConfig: { ...get().loadTestConfig, status: 'RUNNING' } });
  },
  stopLoadTest: () => {
    set({ isLoadTestRunning: false, loadTestConfig: { ...get().loadTestConfig, status: 'COMPLETED' } });
  },

  vulnerabilities: initialVulnerabilities,
  isSecurityScanRunning: false,
  securityScore: 78,
  runSecurityScan: async () => {
    set({ isSecurityScanRunning: true });
    try {
      const response = await api.post('/api/security/scan', {});
      const result = response.data as { securityScore?: number };
      set({ ...(typeof result.securityScore === 'number' ? { securityScore: result.securityScore } : {}) });
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      set({ isSecurityScanRunning: false });
    }
  },
  updateVulnerabilityStatus: (id, status) => {
    set((state) => ({
      vulnerabilities: state.vulnerabilities.map((v) => (v.id === id ? { ...v, status } : v))
    }));
  },

  visualDiffs: initialVisualDiffs,
  activeDiffId: 'DIFF-02',
  setActiveDiffId: (id) => set({ activeDiffId: id }),
  acceptBaseline: (id) => {
    set((state) => ({
      visualDiffs: state.visualDiffs.map((d) => (d.id === id ? { ...d, status: 'ACCEPTED', diffPercent: 0 } : d))
    }));
  },

  aiMessages: [
    {
      id: 'MSG-01',
      role: 'assistant',
      content: 'Hello! I am Forge Assistant, your dedicated AI testing copilot. I can generate comprehensive test suites, diagnose root causes from stack traces, create synthetic test data, and detect flaky tests.',
      timestamp: '10:00 AM'
    }
  ],
  isAiGenerating: false,
  sendAiMessage: async (prompt, contextModule = 'General QA') => {
    const userMsg: AiChatMessage = {
      id: 'MSG-' + Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    set((state) => ({ aiMessages: [...state.aiMessages, userMsg], isAiGenerating: true }));

    await new Promise((res) => setTimeout(res, 800));

    let reply = '';
    let codeBlocks: { language: string; code: string; title?: string }[] = [];

    const lower = prompt.toLowerCase();
    if (lower.includes('test case') || lower.includes('generate')) {
      reply = '### 🎯 Generated Test Suite for ' + contextModule + '\nHere are the prioritized test cases covering happy path, negative validation, and security edge cases:';
      codeBlocks = [
        {
          title: 'TC-501: Validate Idempotency on Duplicate Checkout Payment Submissions',
          language: 'gherkin',
          code: 'Feature: Payment Idempotency\n  Scenario: Rapid double-click on payment submit does not charge twice\n    Given user has cart with total of $149.00\n    And idempotency key "idemp_890a827" is attached to checkout payload\n    When user submits payment twice within 200ms\n    Then only 1 Stripe charge ID is created\n    And second request returns HTTP 200 with identical cached receipt'
        }
      ];
    } else if (lower.includes('root cause') || lower.includes('rca') || lower.includes('error') || lower.includes('bug')) {
      reply = '### 🔍 AI Root Cause Diagnostic (RCA)\n**Identified Issue:** Stripe Webhook Buffer Invalidation\n- **Probable Source:** Express body parser middleware consumed the raw stream before stripe.webhooks.constructEvent() computed the HMAC SHA256 checksum.\n- **Recommended Fix:** Extract raw request body buffer before parsing.';
      codeBlocks = [
        {
          title: 'server/billing/webhook.js - Fix Patch',
          language: 'typescript',
          code: "app.use('/api/billing/webhook', express.raw({ type: 'application/json' }), (req, res) => {\n  const sig = req.headers['stripe-signature'];\n  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);\n});"
        }
      ];
    } else if (lower.includes('data') || lower.includes('synthetic')) {
      reply = '### 🎲 Synthetic Test Data Generated\nHere is realistic QA test data with edge cases:';
      codeBlocks = [
        {
          title: 'Mock Customer Profile Dataset (JSON)',
          language: 'json',
          code: JSON.stringify([
            { id: "cust_01", name: "Björn O'Connor", email: "test.bjorn+qa@example.com", phone: "+91-9876543210", card: "4000002760003184", expected: "3DS_CHALLENGE" },
            { id: "cust_02", name: "Aarav Sharma", email: "aarav_qa@fintech.in", phone: "+91-9988776655", card: "4242424242424242", expected: "IMMEDIATE_SUCCESS" }
          ], null, 2)
        }
      ];
    } else {
      reply = 'I analyzed your prompt in the context of **' + contextModule + '**.\n\nForgeQA intelligence recommends verifying test coverage on high-risk checkout endpoints. Current platform health score is **87/100**, with 2 open critical defects requiring triage.';
    }

    const aiMsg: AiChatMessage = {
      id: 'MSG-' + (Date.now() + 1),
      role: 'assistant',
      content: reply,
      codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({ aiMessages: [...state.aiMessages, aiMsg], isAiGenerating: false }));
  },
  clearAiChat: () => set({ aiMessages: [] }),

  integrations: initialIntegrations,
  toggleIntegration: (id) => {
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id ? { ...i, status: i.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED' } : i
      )
    }));
  },

  notifications: [
    {
      id: 'NOTIF-01',
      title: 'Critical SLA Warning',
      message: 'BUG-1042 (Stripe signature verification) has 2h 15m remaining before SLA breach.',
      type: 'error',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'NOTIF-02',
      title: 'Nightly Regression Passed',
      message: 'Run #9021 completed with 94.7% pass rate across 96 tests.',
      type: 'success',
      timestamp: '3 hours ago',
      read: false
    },
    {
      id: 'NOTIF-03',
      title: 'New OWASP Vulnerability Detected',
      message: 'Reflected XSS detected on /api/search (CVSS 7.4).',
      type: 'warning',
      timestamp: '5 hours ago',
      read: true
    }
  ],
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    }));
  },
  clearAllNotifications: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  }
}));
