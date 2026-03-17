# Environment Variable Map

This repository intentionally keeps the runtime surface small.

## Active Variable

### `NEXT_PUBLIC_API_BASE_URL`

Purpose:

- base URL for the SocialRightOS backend
- used by the typed frontend client in `src/lib/api.ts`

Examples:

- local: `http://127.0.0.1:8000`
- staging: `https://staging-api.example.com`
- production: `https://api.example.com`

Rules:

- do not include a trailing slash
- do not hardcode the backend URL in page components
- do not introduce additional frontend policy variables

## Environment Plan

### Local

- `.env.local`
- points to local backend or local tunnel

### Staging

- set in the staging host dashboard or deployment system
- must point to the staging backend

### Production

- set only after staging validation is complete
- must point to the production backend

## Backend Dependencies

The backend team or backend deployment must confirm:

- CORS origin for the staging frontend
- CORS origin for the production frontend
- canonical endpoint availability
- any required gateway, rate limit, or access constraints
