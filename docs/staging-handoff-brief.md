# Staging Handoff Brief

Use this brief when coordinating the first staging deployment across frontend, backend, and platform owners.

## Objective

Launch the first controlled staging environment for the Home Care MVP without introducing policy logic into the frontend or leaking production SEO signals.

## Frontend Scope

Repository:

- `C:\sosyalhakrehberi-web`

Supported user routes:

- `/`
- `/evde-bakim-maasi`
- `/evde-bakim-maasi/hesaplama`

Canonical backend dependency:

- `POST /api/v1/eligibility-check`

## Required Inputs

These values must be confirmed before the first smoke run:

- staging frontend host
- staging frontend URL
- staging backend base URL
- backend CORS allowlist for the staging frontend origin
- reviewer or staging owner

## Frontend Environment Values

Expected staging values:

```text
NEXT_PUBLIC_SITE_URL=https://staging.sosyalhakrehberi.com
NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com
```

Rules:

- `NEXT_PUBLIC_SITE_URL` must not point to the production domain in staging
- `NEXT_PUBLIC_API_BASE_URL` must not point to localhost
- production values must not be reused in preview or staging environments

## Backend Requests

The backend side should confirm:

- the exact staging backend URL
- CORS allowlist includes the staging frontend origin
- the canonical endpoint is reachable:
  - `POST /api/v1/eligibility-check`
- no additional frontend-only contract fields are required

## Smoke Expectations

The first staging pass should prove:

- the tool loads correctly
- one `ELIGIBLE` case renders
- one `NOT_ELIGIBLE` case renders
- one `NEEDS_INFO` case renders
- one error-path fallback renders safely
- robots is `noindex`
- sitemap does not expose production URLs
- canonical host points to the staging URL

## Evidence To Capture

Record these after the smoke run:

- staging URL
- backend URL
- test date
- reviewer
- smoke result
- blocker list
- final recommendation: hold or proceed

Reference documents:

- `docs/staging-deploy-runbook.md`
- `docs/staging-smoke-report.md`
- `docs/launch-blockers.md`
- `docs/test-payloads.md`
- `docs/rollout-roadmap.md`

## Decision Rule

Do not treat merge completion as launch readiness.

Treat staging pass plus a clean blocker review as the real release candidate gate.

