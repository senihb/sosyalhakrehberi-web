# Staging Deploy Runbook

This runbook translates the staging readiness documents into an execution sequence for the first managed frontend deployment.

## Goal

Deploy the public frontend to a staging host, connect it to a real backend, and validate the Home Care MVP without exposing production launch signals.

## Recommended Host Shape

Use a managed Next.js host with:

- preview deployments
- environment variable management
- easy rollback support
- custom domain support for a later production cutover

A Vercel-style workflow is the default assumption for this runbook, but the checklist also applies to equivalent hosts.

## Required Inputs

Collect these values before creating the staging deployment:

- staging frontend host choice
- staging backend base URL
- staging frontend URL
- confirmed CORS allowlist entry for the staging frontend URL

## Staging Environment Variables

Set these in the staging deployment target:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`

Expected staging shape:

- `NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com`
- `NEXT_PUBLIC_SITE_URL=https://staging.sosyalhakrehberi.com`

## Deployment Steps

1. Import the repository into the managed host.
2. Point the project at the `main` branch.
3. Set the staging environment variables.
4. Trigger a clean deployment.
5. Confirm the deployment URL resolves correctly.
6. Verify the backend accepts requests from the staging origin.

## Smoke Validation

Run this immediately after the first successful deployment:

1. Load `/` and verify the page renders without layout regressions.
2. Load `/evde-bakim-maasi` and verify the CTA links work.
3. Load `/evde-bakim-maasi/hesaplama`.
4. Submit a valid payload and verify a rendered decision state.
5. Submit an incomplete payload and verify `NEEDS_INFO` behavior.
6. Inspect the page source or metadata tools and confirm:
   - canonical host is the staging URL
   - robots is `noindex`
   - sitemap does not expose production URLs
7. Verify safe fallback copy when backend configuration is intentionally removed in a non-production check.

## Exit Criteria

Staging is considered ready only when:

- deployment is reproducible from `main`
- environment values are stable
- backend CORS is confirmed
- smoke validation passes
- no production canonical or sitemap signal leaks from staging

## Domain Timing

Buying or reserving the public domain can happen now.

Routing the public domain to this frontend should wait until staging validation is complete.
