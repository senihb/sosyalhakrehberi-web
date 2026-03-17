# Rollout Roadmap

## Current Mode

The project is now in rollout mode, not feature mode.

This means the next milestone is not more frontend completeness. The next milestone is a successful first staging deployment with a clean smoke report and a documented blocker decision.

Guiding rule:

- merge is not release readiness
- staging pass is the release candidate gate

## Current Goal

Prove that the Home Care MVP works correctly in a production-like staging environment while preserving the backend boundary and trust-first product behavior.

## Operating Principles

- do not start new feature work before staging validation is complete
- do not move policy logic into the frontend under deployment pressure
- do not treat merge completion as launch readiness
- record evidence instead of relying on memory
- use blocker-based launch decisions, not subjective momentum

## Ownership

A single staging owner should coordinate:

- staging frontend URL
- staging backend URL
- environment variable values
- backend CORS allowlist request
- smoke execution
- blocker capture
- final launch recommendation

## P0: Rollout Gate

These items must be completed first.

### Deployment Truth

- select the staging frontend host
- confirm the staging frontend URL
- confirm the staging backend URL
- confirm whether any gateway or API key requirement exists
- confirm backend CORS allowlist for the staging frontend origin
- set `NEXT_PUBLIC_SITE_URL`
- set `NEXT_PUBLIC_API_BASE_URL`

### First Staging Deploy

- deploy from `main`
- confirm SSL is active
- confirm the app resolves at the staging URL
- confirm the tool sends requests to the staging backend

### First Smoke Run

- complete the smoke checklist
- run at least one `ELIGIBLE` case
- run at least one `NOT_ELIGIBLE` case
- run at least one `NEEDS_INFO` case
- run at least one error-path check
- record the results in the smoke report
- record blockers in the blocker template if needed

## P1: Launch Polish After Staging Pass

Only after P0 is complete:

- OG image and social preview polish
- favicon and manifest review
- simple analytics or CTA measurement
- final CTA review

## P2: Post-Launch Follow-Up

- branch cleanup
- small copy polish
- additional content expansion
- future benefit evaluation only after Home Care MVP evidence is stable

## Launch Gate

The public launch decision should be based on three questions:

1. Does the tool work correctly against the real backend?
2. Are search and trust signals correct in staging?
3. Are there any unresolved critical blockers?

Launch can proceed only if the answers are:

- yes
- yes
- no

## Explicit Non-Goals Right Now

- new benefit support
- major UI redesign
- animation or style sprint
- analytics stack expansion
- frontend policy logic
- unrelated refactors

## Recommended Next Action

Move directly to the first staging deployment using:

- `docs/staging-deploy-runbook.md`
- `docs/staging-smoke-report.md`
- `docs/launch-blockers.md`
- `docs/test-payloads.md`
