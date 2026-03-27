# Staging Readiness

This document defines the minimum path from the current repository state to a production-like staging environment.

## Objective

Before connecting the public domain or launching the site, the frontend should run against a real backend in a controlled staging environment.

The goal of staging is to validate:

- environment configuration
- backend connectivity
- CORS behavior
- canonical contract usage
- public route behavior
- basic deployment safety

## Current State

Already in place:

- contract-safe frontend foundation
- typed eligibility API client
- Home Care pillar page
- Home Care calculation page
- CI lint/build workflow
- sponsor-facing README
- basic repository governance files

Not yet validated end-to-end:

- real staging backend URL
- cross-origin behavior against backend
- deployment target and environment wiring
- production-like smoke test run

## P0 Checklist

These items should be completed before any launch decision.

### Backend and Environment

- confirm the staging backend base URL
- confirm the frontend should use `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SITE_URL`
- confirm `NEXT_PUBLIC_SITE_URL` is explicitly set for staging
- confirm backend staging allows the frontend staging origin via CORS
- confirm backend staging exposes `POST /api/v1/eligibility-check`

### Frontend Deployment

- choose the staging frontend host
- configure staging environment variables
- perform one clean deployment from `main`
- confirm staging sends `noindex` through robots behavior
- confirm staging does not expose a production sitemap
- confirm pages render correctly:
  - `/`
  - `/evde-bakim-maasi`
  - `/evde-bakim-maasi/hesaplama`

### Smoke Validation

- open the tool page in staging
- submit a valid Home Care request
- confirm a successful response renders correctly
- confirm a `NEEDS_INFO` response renders correctly
- confirm a backend/client error shows safe fallback copy
- confirm the footer/header trust layer renders correctly
- confirm canonical metadata points to the staging site URL

### Launch Gate

Do not connect or announce the public launch until:

- staging smoke test is clean
- env configuration is stable
- backend integration is verified
- copy on primary routes is approved

## Smoke Test Script

Use this exact minimum checklist after each staging deployment:

1. Load homepage and verify header, hero, CTA links, and canonical host.
2. Load `/evde-bakim-maasi` and verify checklist, FAQ, and tool CTA.
3. Load `/evde-bakim-maasi/hesaplama`.
4. Submit a valid payload and confirm:
   - result status renders
   - reasons render
   - metadata renders
   - CTA path matches the result state
5. Submit an intentionally incomplete payload and confirm:
   - `NEEDS_INFO` state renders
   - missing facts list appears
6. Confirm robots is `noindex` and sitemap is empty or absent in staging.
7. Temporarily unset the API URL in a non-production check and confirm safe error handling.

## Domain Note

Domain purchase can happen before staging is complete.

Public launch should not happen before staging is complete.

