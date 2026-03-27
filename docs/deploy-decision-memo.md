# Deploy Decision Memo

## Purpose

Choose a controlled path for staging and later production deployment without expanding scope or moving business logic into the frontend.

## Recommended Decision

Use a managed frontend host for the Next.js app and keep the Laravel backend deployed separately.

Recommended operating model:

- frontend deployment: Vercel or equivalent managed Next.js host
- backend deployment: existing socialrightlabs deployment track
- integration point: `NEXT_PUBLIC_API_BASE_URL`

## Why This Is The Right Next Step

- the frontend is already App Router based and CI is in place
- the repo is now strong enough for a sponsor-facing staging environment
- the remaining launch blocker is environment and backend integration, not product direction

## What We Need To Decide

### 1. Staging frontend host

Decision needed:

- which host will serve the staging frontend

Recommendation:

- choose the simplest host with fast preview support and environment variable management

### 2. Staging backend URL

Decision needed:

- exact staging backend base URL

Recommendation:

- define one stable staging backend URL before any domain binding work

### 3. Public domain timing

Decision needed:

- whether to buy/configure the domain now or after staging approval

Recommendation:

- buy the domain whenever commercially useful
- defer public launch routing until staging validation is complete

## Non-Goals For This Phase

- advanced analytics stack
- auth system
- multi-benefit support
- dashboard workflows
- frontend-side policy logic

## Exit Criteria

This memo is complete when:

- a staging frontend host is selected
- a staging backend URL is confirmed
- the env variable mapping is approved
- staging smoke validation is scheduled

