# ForgeQA — Safe Expansion Implementation Plan
> **Rule #1: Never touch working code. Only add. Never break.**

This document is the **engineering execution guide** for adding new modules to ForgeQA
without disturbing the existing build, routes, components, or database schema.

---

## Table of Contents
1. [Existing Build — What Must Never Change](#1-existing-build--what-must-never-change)
2. [Core Strategy — Additive-Only Architecture](#2-core-strategy--additive-only-architecture)
3. [Folder Structure — Where New Code Lives](#3-folder-structure--where-new-code-lives)
4. [Backend — Safe API Expansion Rules](#4-backend--safe-api-expansion-rules)
5. [Frontend — Safe Route & Nav Expansion Rules](#5-frontend--safe-route--nav-expansion-rules)
6. [Database — New Collections Only](#6-database--new-collections-only)
7. [Feature Flags — Every New Feature is Togglable](#7-feature-flags--every-new-feature-is-togglable)
8. [Phase 1 — Bug Tracker Module (First Safe Addition)](#8-phase-1--bug-tracker-module-first-safe-addition)
9. [Phase 2 — API Testing Module](#9-phase-2--api-testing-module)
10. [Phase 3 — Test Run Execution Module](#10-phase-3--test-run-execution-module)
11. [Phase 4 — Performance Testing Module](#11-phase-4--performance-testing-module)
12. [Phase 5 — Security & Cross-Browser Testing](#12-phase-5--security--cross-browser-testing)
13. [Deployment & CI Rules](#13-deployment--ci-rules)
14. [Risk Matrix & Rollback Plan](#14-risk-matrix--rollback-plan)

---

## 1. Existing Build — What Must Never Change

These are the **protected files and folders**. They must never be modified
during new module development (except for the two specific safe-append points
defined in Section 5).

### Protected Frontend Files

| File | What It Does | Risk if Modified |
|---|---|---|
| `src/App.tsx` | All routes & auth logic | Break all navigation |
| `src/store/useAppStore.ts` | Global state | Break entire app state |
| `src/index.css` | Design tokens & all styles | Break all styling |
| `src/pages/GeneratorPage.tsx` | AI test case generator | Break core feature |
| `src/pages/PrdGeneratorPage.tsx` | PRD generator | Break core feature |
| `src/pages/KnowledgeBase.tsx` | Knowledge base | Break core feature |
| `src/pages/RegressionPage.tsx` | Regression monitor | Break core feature |
| `src/pages/TestScripts.tsx` | Script manager | Break core feature |
| `src/pages/DashboardPage.tsx` | Main dashboard | Break core feature |
| `src/pages/SettingsPage.tsx` | All settings | Break settings |
| `src/pages/AuthPage.tsx` | Login/auth | Break auth |
| `src/pages/BillingPage.tsx` | Billing | Break payments |
| `src/components/NavBar.tsx` | Top navigation | Break nav |
| `src/components/Sidebar.tsx` | Sidebar nav | Break nav |

### Protected Backend Files

| File / Folder | What It Does | Risk if Modified |
|---|---|---|
| `server/api.js` | All 2000+ lines of existing API | Break all existing endpoints |
| `server/auth/` | JWT authentication | Break all auth |
| `server/billing/` | Stripe billing | Break payments |
| `server/ai/` | AI generation (Gemini, OpenAI) | Break AI features |
| `server/knowledge/` | Knowledge base engine | Break knowledge |
| `server/regression/` | Regression runs | Break regression |
| `server/test-scripts/` | Script generation | Break scripts |
| `server/prd/` | PRD generation | Break PRD |
| `server/db.js` | MongoDB connection | Break database |
| `server/index.js` | Server entry point | Break server start |

> **RULE: If a file is in this table, open it only to READ. Never to edit during new feature work.**

---

## 2. Core Strategy — Additive-Only Architecture

The expansion strategy has three principles:

### Principle 1: New Modules = New Folders
Every new feature lives in its own isolated folder. It has no imports FROM existing
page files. Existing code does NOT import from new modules either.

```
New Frontend module:   src/modules/[module-name]/
New Backend module:    server/modules/[module-name]/
```

### Principle 2: New API Routes = New Route File + Single Mount
New backend routes are written in a separate file and mounted in `server/index.js`
at a NEW path prefix (`/api/v2/...`). The file `server/api.js` is **never touched**.

```
server/index.js (SAFE APPEND ONLY — 2 lines max)
  app.use('/api/v2/bugs',       (await import('./modules/bugs/routes.js')).default);
  app.use('/api/v2/api-client', (await import('./modules/api-client/routes.js')).default);
```

### Principle 3: Feature Flags Guard Everything
Every new module is behind a feature flag. If anything goes wrong, flip the flag
to `false` and redeploy. Zero rollback risk.

---

## 3. Folder Structure — Where New Code Lives

### Frontend New Structure
```
src/
├── modules/                          <-- NEW: All new feature modules live here
│   ├── bugs/
│   │   ├── BugTrackerPage.tsx        <-- Main page component
│   │   ├── components/               <-- Bug-specific components only
│   │   │   ├── BugForm.tsx
│   │   │   ├── BugTable.tsx
│   │   │   ├── BugDetailDrawer.tsx
│   │   │   └── BugStatusBadge.tsx
│   │   ├── hooks/
│   │   │   └── useBugs.ts
│   │   ├── store/
│   │   │   └── useBugStore.ts        <-- Isolated Zustand store, NOT in useAppStore
│   │   └── types.ts
│   ├── api-client/
│   │   ├── ApiClientPage.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── test-runs/
│   │   ├── TestRunsPage.tsx
│   │   ├── components/
│   │   └── types.ts
│   ├── performance/
│   │   ├── PerformancePage.tsx
│   │   ├── components/
│   │   └── types.ts
│   └── security/
│       ├── SecurityPage.tsx
│       ├── components/
│       └── types.ts
│
├── pages/         <-- EXISTING: Do not add new files here
├── components/    <-- EXISTING: Do not add new files here (except shared UI)
├── store/         <-- EXISTING: Do not modify useAppStore.ts
└── App.tsx        <-- EXISTING: Safe-append only (see Section 5)
```

### Backend New Structure
```
server/
├── modules/                          <-- NEW: All new backend modules live here
│   ├── bugs/
│   │   ├── routes.js                 <-- Express router, exported as default
│   │   ├── controller.js             <-- Business logic
│   │   ├── model.js                  <-- MongoDB collection queries
│   │   └── schema.js                 <-- Validation schemas (Joi/Zod)
│   ├── api-client/
│   │   ├── routes.js
│   │   ├── controller.js
│   │   └── proxy.js                  <-- Secure HTTP proxy forwarder
│   ├── test-runs/
│   │   ├── routes.js
│   │   ├── controller.js
│   │   └── executor.js
│   ├── performance/
│   │   ├── routes.js
│   │   ├── controller.js
│   │   └── k6-runner.js
│   └── security/
│       ├── routes.js
│       ├── controller.js
│       └── scanner.js
│
├── api.js         <-- EXISTING: Never modified
├── auth/          <-- EXISTING: Never modified
├── billing/       <-- EXISTING: Never modified
└── index.js       <-- EXISTING: Safe-append only (see Section 4)
```

---

## 4. Backend — Safe API Expansion Rules

### The Only Safe Change to `server/index.js`

At the bottom of `server/index.js`, AFTER the existing `app.use('/api', apiRouter)` line,
append new module mounts. This is the **only permitted change** to any existing file.

```javascript
// === EXISTING (do not touch above this line) ===
app.use('/api', apiRouter);   // <-- this already exists

// === NEW MODULES — append below, never above ===
// Each import is dynamic so if the module fails to load, the main app still starts
try {
  const bugsRouter = (await import('./modules/bugs/routes.js')).default;
  app.use('/api/v2/bugs', bugsRouter);
} catch (e) {
  console.warn('[ForgeQA] Bug tracker module not loaded:', e.message);
}

try {
  const apiClientRouter = (await import('./modules/api-client/routes.js')).default;
  app.use('/api/v2/api-client', apiClientRouter);
} catch (e) {
  console.warn('[ForgeQA] API client module not loaded:', e.message);
}
```

> The `try/catch` around each import ensures that if any new module has a bug,
> the entire existing server continues to run normally.

### New Route File Template

Every new module's `routes.js` must follow this pattern:

```javascript
// server/modules/bugs/routes.js
import { Router } from 'express';
import { authenticateToken } from '../../auth/index.js';  // reuse existing auth
import { FEATURE_FLAGS } from '../shared/featureFlags.js';
import * as controller from './controller.js';

const router = Router();

// Guard entire module with feature flag
router.use((req, res, next) => {
  if (!FEATURE_FLAGS.BUG_TRACKER) {
    return res.status(404).json({ error: 'Module not available' });
  }
  next();
});

// All routes use existing authenticateToken middleware
router.get('/',             authenticateToken, controller.listBugs);
router.post('/',            authenticateToken, controller.createBug);
router.get('/:id',          authenticateToken, controller.getBug);
router.patch('/:id',        authenticateToken, controller.updateBug);
router.delete('/:id',       authenticateToken, controller.deleteBug);

export default router;
```

### Reusing Existing Utilities (Safe — Read Only)

New modules CAN import from existing server utilities as read-only consumers:

```javascript
// OK: Import shared utilities by importing from them (reading only)
import { authenticateToken } from '../../auth/index.js';   // reuse JWT auth
import { getDb } from '../../db.js';                        // reuse DB connection
import { consume } from '../../billing/entitlements.js';   // reuse billing limits
```

New modules must NEVER modify these files — only call their exported functions.

---

## 5. Frontend — Safe Route & Nav Expansion Rules

### Safe Append Point 1: `src/App.tsx`

The ONLY permitted change to `App.tsx` is appending new lazy-loaded routes
INSIDE the existing `<Routes>` block, after all existing `<Route>` entries,
before the catch-all `<Route path="*">`. New imports go at the top.

```tsx
// ADD at top of App.tsx with existing imports:
import { lazy, Suspense } from 'react';
const BugTrackerPage = lazy(() => import('../modules/bugs/BugTrackerPage'));
const ApiClientPage  = lazy(() => import('../modules/api-client/ApiClientPage'));

// ADD inside <Routes> block, BEFORE the <Route path="*"> catch-all:
<Route path="/bugs"       element={<Suspense fallback={<PageLoader />}><BugTrackerPage /></Suspense>} />
<Route path="/api-client" element={<Suspense fallback={<PageLoader />}><ApiClientPage /></Suspense>} />
```

Using `lazy()` ensures new modules are code-split. A bug in a new module
does NOT crash the existing app — it only fails the lazy import for that route.

### Safe Append Point 2: `src/components/Sidebar.tsx`

Add a new section to the sidebar for new modules. The existing `NAV_ITEMS_BUILD`
and `NAV_ITEMS_MONITOR` arrays are **never modified**. A new array is added after them:

```tsx
// ADD after NAV_ITEMS_MONITOR, before NAV_ITEMS_SYSTEM in Sidebar.tsx:

const NAV_ITEMS_NEW_MODULES: NavItem[] = [
  {
    key: 'bugs',
    label: 'Bug Tracker',
    path: '/bugs',
    icon: <BugIcon size={20} />,
    color: 'rose',
    badge: 'NEW',                    // optional badge
  },
  {
    key: 'api-client',
    label: 'API Testing',
    path: '/api-client',
    icon: <ApiIcon size={20} />,
    color: 'cyan',
    badge: 'NEW',
  },
];
```

Then render the new section in the Sidebar JSX by adding ONE new `<section>` block
after the existing monitor section — no changes to existing rendered sections.

### Module Page Template

Every new module page must be fully self-contained:

```tsx
// src/modules/bugs/BugTrackerPage.tsx
// NO imports from ../pages/* or ../components/* (except shared UI primitives)
// This page stands alone — if deleted, nothing else breaks

import React from 'react';
import { useBugStore } from './store/useBugStore';   // own store
import { BugTable } from './components/BugTable';   // own components
import { BugForm } from './components/BugForm';     // own components

export function BugTrackerPage() {
  // ... implementation
}
```

---

## 6. Database — New Collections Only

The existing MongoDB collections must **never have new fields added or
schema changed**. New modules use entirely new collections.

### Existing Collections (Protected — Read Only from New Modules)

| Collection | Owner Module | New Modules May... |
|---|---|---|
| `users` | auth | Read `_id`, `email`, `name` only |
| `subscriptions` | billing | Read subscription status for gating |
| `usage_balances` | billing | Call `consume()` via entitlements.js |
| `test_cases` | generator | Read only, never write |
| `suites` | generator | Read only, never write |
| `knowledge_docs` | knowledge | Read only, never write |
| `regression_runs` | regression | Read only, never write |

### New Collections for New Modules

| Collection | Owned By | Key Fields |
|---|---|---|
| `bugs` | Bug Tracker | `_id`, `owner_id`, `title`, `description`, `severity`, `priority`, `status`, `steps`, `environment`, `attachments`, `assigned_to`, `created_at`, `updated_at` |
| `api_collections` | API Client | `_id`, `owner_id`, `name`, `requests[]`, `environments{}`, `created_at` |
| `api_requests` | API Client | `_id`, `collection_id`, `method`, `url`, `headers`, `body`, `assertions[]` |
| `api_run_results` | API Client | `_id`, `owner_id`, `collection_id`, `results[]`, `run_at` |
| `test_runs` | Test Execution | `_id`, `owner_id`, `suite_id`, `status`, `results[]`, `started_at`, `ended_at` |
| `perf_runs` | Performance | `_id`, `owner_id`, `config{}`, `metrics[]`, `status`, `created_at` |
| `security_scans` | Security | `_id`, `owner_id`, `target_url`, `findings[]`, `status`, `created_at` |
| `notifications` | Shared | `_id`, `user_id`, `type`, `title`, `body`, `read`, `created_at` |

### Collection Creation Rule

New collections are created lazily — they don't need a migration.
MongoDB creates them on first insert. Each module's `model.js` handles
its own collection access:

```javascript
// server/modules/bugs/model.js
import { getDb } from '../../db.js';   // reuse existing connection

const col = () => getDb().collection('bugs');  // lazy, created on first use

export async function createBug(data) {
  const result = await col().insertOne({
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}
```

---

## 7. Feature Flags — Every New Feature is Togglable

A single shared feature flag file controls all new modules.
Setting any flag to `false` instantly disables that module on both
frontend and backend without any code change.

### `server/modules/shared/featureFlags.js` (NEW FILE)

```javascript
// server/modules/shared/featureFlags.js
// Set any flag to false to completely disable a module
// NO restart needed when combined with env var approach

export const FEATURE_FLAGS = {
  BUG_TRACKER:         process.env.FF_BUG_TRACKER         !== 'false',  // on by default
  API_CLIENT:          process.env.FF_API_CLIENT           === 'true',   // off by default
  TEST_RUNS:           process.env.FF_TEST_RUNS            === 'true',
  PERFORMANCE_TESTING: process.env.FF_PERFORMANCE_TESTING  === 'true',
  SECURITY_TESTING:    process.env.FF_SECURITY_TESTING     === 'true',
};
```

### `src/modules/shared/featureFlags.ts` (NEW FILE)

```typescript
// src/modules/shared/featureFlags.ts
// Frontend mirrors backend flags — fetched once on app load
// Defaults match backend defaults so the UI never shows a broken module

export const FEATURE_FLAGS = {
  BUG_TRACKER:         true,   // first module to launch
  API_CLIENT:          false,
  TEST_RUNS:           false,
  PERFORMANCE_TESTING: false,
  SECURITY_TESTING:    false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
```

### Usage in New Components

```tsx
// src/modules/bugs/BugTrackerPage.tsx
import { FEATURE_FLAGS } from '../shared/featureFlags';

export function BugTrackerPage() {
  if (!FEATURE_FLAGS.BUG_TRACKER) {
    return <ComingSoonPage module="Bug Tracker" />;
  }
  // ... real content
}
```

---

## 8. Phase 1 — Bug Tracker Module (First Safe Addition)

**Timeline:** Weeks 1–3  
**Risk:** Zero — purely additive, no existing file modified (except 2 safe-append points)

### Files to CREATE (not modify)

```
server/modules/
└── bugs/
    ├── routes.js          -- Express router for /api/v2/bugs
    ├── controller.js      -- listBugs, createBug, updateBug, deleteBug, getBug
    ├── model.js           -- MongoDB CRUD for 'bugs' collection
    └── schema.js          -- Joi validation: bug shape, status enum

server/modules/shared/
└── featureFlags.js        -- Feature flag registry

src/modules/
└── bugs/
    ├── BugTrackerPage.tsx          -- Main page (board + table view)
    ├── types.ts                    -- Bug, BugStatus, BugSeverity types
    ├── store/
    │   └── useBugStore.ts          -- Zustand store for bug state
    ├── hooks/
    │   └── useBugs.ts              -- API calls, SWR/React Query pattern
    └── components/
        ├── BugBoard.tsx            -- Kanban-style board view
        ├── BugTable.tsx            -- Table view with filters/sort
        ├── BugForm.tsx             -- Create/edit bug drawer/modal
        ├── BugDetailDrawer.tsx     -- Full bug detail side panel
        ├── BugStatusBadge.tsx      -- Colored status pill
        ├── BugSeverityBadge.tsx    -- Severity indicator
        └── EnvironmentCapture.tsx  -- Auto-capture browser/OS info

src/modules/shared/
└── featureFlags.ts        -- Frontend feature flag mirror
```

### Files to SAFELY APPEND (2 lines each, no logic change)

```
server/index.js    -- +3 lines: try/catch dynamic import of bugs router
src/App.tsx        -- +2 lines: lazy import + Route for /bugs
src/components/Sidebar.tsx  -- +1 new NAV_ITEMS_NEW_MODULES array + 1 new rendered section
```

### Bug Tracker Data Model

```typescript
// src/modules/bugs/types.ts
export type BugStatus   = 'new' | 'open' | 'in_progress' | 'fixed' | 'closed' | 'wont_fix';
export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BugPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Bug {
  _id: string;
  owner_id: string;              // from JWT, same as existing pattern
  title: string;
  description: string;
  steps_to_reproduce: string[];
  expected_result: string;
  actual_result: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  environment: {
    browser?: string;
    os?: string;
    screen_resolution?: string;
    user_agent?: string;
    app_version?: string;
    url?: string;
  };
  assigned_to?: string;          // user_id
  attachments: string[];         // file URLs
  tags: string[];
  linked_test_case_id?: string;  // reference to existing test_cases collection
  created_at: string;
  updated_at: string;
}
```

### API Endpoints for Bug Tracker

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v2/bugs` | List bugs (filter by status, severity, assignee) |
| `POST` | `/api/v2/bugs` | Create new bug |
| `GET` | `/api/v2/bugs/:id` | Get single bug with full details |
| `PATCH` | `/api/v2/bugs/:id` | Update bug fields |
| `DELETE` | `/api/v2/bugs/:id` | Delete bug |
| `POST` | `/api/v2/bugs/:id/attachments` | Upload attachment |
| `GET` | `/api/v2/bugs/stats` | Bug counts by status/severity for dashboard |

### Billing Gate for Bug Tracker

```javascript
// server/modules/bugs/controller.js
import { consume, can } from '../../billing/entitlements.js';  // reuse existing

export async function createBug(req, res) {
  const owner_id = req.user.id;

  // Check plan allows bug tracking (free plan: limited, pro: full)
  const { ok } = await consume(owner_id, 'bugs_created', 1, req.body.idempotency_key);
  if (!ok) {
    return res.status(429).json({ error: 'Bug limit reached for your plan. Upgrade to log more bugs.' });
  }
  // ... create bug
}
```

---

## 9. Phase 2 — API Testing Module

**Timeline:** Weeks 4–7  
**Risk:** Low — new module, no existing code touched

### Key Components to Build

```
src/modules/api-client/
├── ApiClientPage.tsx           -- Split pane: collections tree | request editor | response
├── components/
│   ├── CollectionSidebar.tsx   -- Tree: collections → folders → requests
│   ├── RequestEditor.tsx       -- Method, URL, headers, body, auth tabs
│   ├── ResponseViewer.tsx      -- Status, headers, body (JSON/raw/preview)
│   ├── EnvironmentSelector.tsx -- Switch dev/staging/prod
│   ├── AssertionBuilder.tsx    -- Visual assertion row builder
│   └── MockServerPanel.tsx     -- Configure mock routes
```

### Proxy Architecture (Critical for Security)

API requests from the browser cannot hit arbitrary URLs directly (CORS).
All requests go through a secure server-side proxy:

```
Browser → POST /api/v2/api-client/proxy → server validates request → forwards to target URL → returns response
```

```javascript
// server/modules/api-client/proxy.js
export async function forwardRequest(req, res) {
  const { method, url, headers, body } = req.body;

  // Security: block internal network ranges
  const blocked = isPrivateNetwork(url);
  if (blocked) {
    return res.status(403).json({ error: 'Requests to private networks are blocked' });
  }

  const response = await fetch(url, { method, headers, body });
  // Return full response: status, headers, body, timing
}
```

### Postman Import (Migration Tool)

```typescript
// src/modules/api-client/utils/importPostman.ts
// Parse Postman Collection v2.1 JSON → ForgeQA api_collection format
// This is a pure utility — no dependency on any existing ForgeQA module
export function importPostmanCollection(json: PostmanCollection): ApiCollection { ... }
```

---

## 10. Phase 3 — Test Run Execution Module

**Timeline:** Weeks 8–10  
**Risk:** Low-Medium — reads from existing `test_cases` collection but does NOT write to it

### Key Principle
The Test Runs module **reads** test cases from the existing `test_cases` collection
(created by the existing Generator module) but **never writes back to it**.
All run results go into the new `test_runs` collection.

```typescript
// Reads from existing (safe):
const testCases = await getDb().collection('test_cases').find({ suite_id }).toArray();

// Writes to new (safe):
await getDb().collection('test_runs').insertOne({ suite_id, results, ... });
```

### Components

```
src/modules/test-runs/
├── TestRunsPage.tsx            -- List of test runs
├── components/
│   ├── RunLauncher.tsx         -- Select suite → assign testers → launch
│   ├── LiveExecutionView.tsx   -- Real-time pass/fail/skip tracking
│   ├── EvidenceCapture.tsx     -- Attach screenshot/note per test step
│   ├── ExploratorySession.tsx  -- Time-boxed exploratory testing mode
│   └── RunSummaryReport.tsx    -- Auto-generated run summary
```

---

## 11. Phase 4 — Performance Testing Module

**Timeline:** Weeks 11–14  
**Risk:** Low — fully isolated, uses background job queue

### Architecture

```
Browser (config form) 
  → POST /api/v2/performance/runs  
    → enqueue job in Bull/BullMQ  
      → k6 worker process executes test  
        → streams metrics via WebSocket  
          → stores results in perf_runs collection
```

### New Infrastructure Required

```
server/modules/performance/
├── routes.js
├── controller.js
├── k6-runner.js        -- Spawns k6 as child process, streams stdout
├── metrics-parser.js   -- Parses k6 JSON output into ForgeQA format
└── websocket.js        -- WebSocket handler for live metrics streaming
```

> **Note:** k6 binary must be installed on the server.
> On Railway: add `k6` to the Dockerfile / nixpacks config — does NOT touch existing app.

---

## 12. Phase 5 — Security & Cross-Browser Testing

**Timeline:** Weeks 15–20  
**Risk:** Medium — requires external service integrations

### Security Testing

```
server/modules/security/
├── routes.js
├── controller.js
├── scanner.js           -- Wraps OWASP ZAP REST API / Nuclei CLI
└── report-builder.js    -- Formats findings into structured report
```

**Consent Gate:** Before any scan, the user must confirm they own/have
permission to test the target domain. This is logged to the audit collection.

```javascript
// server/modules/security/controller.js
export async function startScan(req, res) {
  const { target_url, consent_confirmed } = req.body;
  if (!consent_confirmed) {
    return res.status(400).json({ error: 'You must confirm you own this domain before scanning.' });
  }
  await logAudit(req.user.id, 'security_scan_started', { target_url });
  // ... proceed with scan
}
```

### Cross-Browser Testing

Integration with BrowserStack or LambdaTest via their REST APIs.
No SDK needed — pure API calls from a new isolated module.

```
server/modules/cross-browser/
├── routes.js
├── controller.js
└── providers/
    ├── browserstack.js     -- BrowserStack REST API adapter
    └── lambdatest.js       -- LambdaTest REST API adapter
```

---

## 13. Deployment & CI Rules

### Railway (Backend) — Unchanged

The existing `railway.json` and deployment config are not modified.
New modules are just additional folders that get included in the same deploy.
The `try/catch` pattern in `server/index.js` ensures failed module loads
don't crash the server.

### Vercel (Frontend) — Unchanged

The existing `vercel.json` is not modified.
New module pages are lazy-loaded (code-split by Vite) — they don't
increase the initial bundle size.

### Environment Variables — Additive Only

New env vars are added to `.env.example` with clear comments.
No existing env var is modified or removed.

```bash
# === NEW MODULE FLAGS (all optional, safe defaults shown) ===
FF_BUG_TRACKER=true           # Enable Bug Tracker module (default: true)
FF_API_CLIENT=false           # Enable API Testing module (default: false)
FF_TEST_RUNS=false            # Enable Test Run Execution (default: false)
FF_PERFORMANCE_TESTING=false  # Enable Performance Testing (default: false)
FF_SECURITY_TESTING=false     # Enable Security Testing (default: false)
```

### Branch Strategy

```
main              ← Production (existing, protected)
  ↑
feature/module-bugs       ← Bug Tracker development
feature/module-api-client ← API Client development
feature/module-test-runs  ← Test Runs development
```

Each module is developed on its own branch. It can be merged and deployed
independently because it's fully additive.

### CI Checks Before Any Merge

```bash
# Must all pass before merging any new module
npm run typecheck          # TypeScript — existing + new
npm run lint               # ESLint — existing + new
npm run test               # Vitest — existing tests must still pass
npm run build              # Vite build — must compile without errors
```

> **CRITICAL:** The existing Vitest test suite must continue to pass 100%
> after every new module addition. New modules must add their own tests.

---

## 14. Risk Matrix & Rollback Plan

| Risk | Likelihood | Impact | Mitigation | Rollback |
|---|---|---|---|---|
| New module crashes existing app | Very Low | High | `try/catch` on all dynamic imports | Set `FF_X=false` + redeploy |
| New route conflicts with existing `/api` | None | High | All new routes use `/api/v2/` prefix | N/A — no conflict possible |
| New DB collection corrupts existing data | None | Critical | New modules only INSERT to new collections | N/A — separate collections |
| Type error in new module breaks build | Low | Medium | TypeScript strict mode + CI check | Revert branch |
| New Sidebar nav breaks layout | Very Low | Medium | New section is JSX appended, no existing JSX touched | Revert 5 lines in Sidebar.tsx |
| Performance regression from new lazy imports | Very Low | Low | Code splitting — new pages not loaded until visited | Remove lazy import |
| New npm package breaks existing | Low | Medium | New packages pinned to exact version | `npm ci` reverts to lock file |

### Emergency Rollback Procedure

If ANY new module causes a production issue:

**Step 1 (30 seconds):** Set feature flag env var to `false` on Railway → redeploy
```bash
FF_BUG_TRACKER=false   # disables the module instantly
```

**Step 2 (if needed):** Revert the 3 safe-append changes in git and deploy
```bash
git revert <commit-hash>   # reverts only the new code, existing code untouched
```

**Step 3 (never needed):** Database — new collections are ignored by existing code,
so no DB rollback is ever needed for new module additions.

---

## Summary — Safe Change Checklist

Before writing any new code, verify with this checklist:

- [ ] New code goes into `src/modules/[name]/` or `server/modules/[name]/`
- [ ] No existing page file in `src/pages/` is modified
- [ ] No existing component in `src/components/` is modified
- [ ] `server/api.js` is NOT touched — zero edits
- [ ] `server/auth/`, `server/billing/`, `server/ai/` are NOT touched
- [ ] `src/store/useAppStore.ts` is NOT touched — new module has its own store
- [ ] New module is behind a feature flag
- [ ] New API routes use `/api/v2/[module]` prefix, never `/api/`
- [ ] New DB collections use new names — no fields added to existing collections
- [ ] `src/App.tsx` — only lazy import + one `<Route>` appended
- [ ] `Sidebar.tsx` — only new `NAV_ITEMS_NEW_MODULES` array + new rendered section
- [ ] `server/index.js` — only `try/catch` dynamic import appended
- [ ] All existing Vitest tests still pass after the addition
- [ ] New env vars added to `.env.example` with safe defaults
- [ ] Feature flag set to `false` by default until module is ready for users

---

*Document Version: 1.0 | Created: October 2026 | Owner: ForgeQA Engineering Team*
*This plan supersedes any instruction that would modify existing production files.*
