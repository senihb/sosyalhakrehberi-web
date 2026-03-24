# sosyalhakrehberi-web

Public-facing Next.js frontend for the SocialRightOS system.

This repository is the SEO, tool, and trust layer for the Home Care MVP. It is designed to present clear public guidance, route users into a lightweight eligibility flow, and consume backend decisions without owning policy semantics.

## Product Position

- `SocialRightOS` is the backend decision engine.
- `sosyalhakrehberi-web` is the public growth frontend.
- The frontend is responsible for content, UX, metadata, and conversion flow.
- The backend is responsible for eligibility logic, thresholds, derived facts, and canonical decision semantics.

## Current MVP Scope

This repository is intentionally narrow.

- single domain strategy
- single benefit MVP
- only `TR_HOME_CARE_ALLOWANCE`
- no auth
- no dashboard
- no mobile app
- no frontend-owned eligibility logic

The primary user-facing routes are:

- `/`
- `/evde-bakim-maasi`
- `/evde-bakim-maasi/hesaplama`

## Architecture Boundary

The frontend must adapt to the backend contract, not the other way around.

Rules:

- do not invent backend request fields
- do not invent backend response fields
- do not compute thresholds in the frontend
- do not reinterpret backend `status`, `reasons`, `missing_facts`, or `metadata`
- do not turn preliminary guidance into official entitlement language

Canonical backend endpoint:

- `POST /api/v1/eligibility-check`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Local Development

1. Install dependencies:

```bash
npm ci
```

2. Create a local env file from the example:

```bash
copy .env.example .env.local
```

3. Set the backend base URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

4. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

Run the local checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

GitHub Actions also runs reproducible lint and build checks on pull requests and tracked branches.

## Repository Goals

This repo should communicate the following clearly:

- trust-first public UX
- clean Turkish copy
- strong Home Care pillar content
- backend-safe calculation flow
- sponsor- and partner-ready engineering discipline

## What This Repo Is Not

This repo is not:

- the source of truth for policy logic
- a case management tool
- a CRM
- a benefit dashboard
- a substitute for official institutional review

## Environment Variables

Current frontend environment requirements:

- `NEXT_PUBLIC_API_BASE_URL`: base URL for the SocialRightOS backend
- `NEXT_PUBLIC_SITE_URL`: canonical site URL for metadata and robots behavior

See `.env.example`.

## Deployment Readiness

Deployment planning documents:

- `docs/rollout-roadmap.md`
- `docs/staging-readiness.md`
- `docs/env-map.md`
- `docs/deploy-decision-memo.md`
- `docs/staging-deploy-runbook.md`
- `docs/staging-handoff-brief.md`
- `docs/staging-request-brief.md`
- `docs/launch-blockers.md`
- `docs/staging-smoke-report.md`
- `docs/test-payloads.md`
- `docs/home-care-live-smoke-checklist.md`

Production runtime is explicitly defined with `nixpacks.toml` and `railpack.json` so platform builds can:

- install with `npm ci`
- build with `npm run build`
- start the app without the extra `npm start` wrapper warning

## Status

Current state of the repository:

- Home Care public flow rollout is complete
- contract-safe frontend client is in place
- guided result, income gate, trust layer, and content cluster are in place
- live smoke and indexing smoke have passed
- the current Home Care track is in stabilization hold unless a concrete bug or explicit product/legal decision reopens it

## License

This repository is proprietary and distributed under an `All Rights Reserved` notice.
See [LICENSE](LICENSE).
