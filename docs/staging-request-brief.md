# Staging Request Brief

Use this message template when requesting the first real staging setup from backend or platform owners.

## Copy-Paste Request

```text
We are now in rollout mode, not feature mode.
The next milestone is a successful first staging deployment with a clean smoke report.

Frontend repository:
- C:\sosyalhakrehberi-web

Frontend scope:
- public routes: /, /evde-bakim-maasi, /evde-bakim-maasi/hesaplama
- canonical tool dependency: POST /api/v1/eligibility-check
- Home Care only MVP
- no frontend-owned policy logic

We need the following confirmed for staging:
1. Staging backend base URL
2. CORS allowlist entry for the staging frontend origin
3. Confirmation that POST /api/v1/eligibility-check is reachable in staging
4. Confirmation of any gateway or access requirement, if applicable

Expected frontend staging environment:
- NEXT_PUBLIC_SITE_URL=<staging frontend URL>
- NEXT_PUBLIC_API_BASE_URL=<staging backend URL>

Rollout rules:
- staging must not point to the production domain
- staging must not use localhost
- staging must return noindex behavior
- staging must not expose a production sitemap

The first smoke run will validate:
- ELIGIBLE
- NOT_ELIGIBLE
- NEEDS_INFO
- one error path
- canonical host
- robots
- sitemap

Please reply with:
- staging backend URL
- allowed frontend origin(s)
- any required access step
- owner for staging support during the first smoke run
```

## Internal Frontend Checklist

Before sending the request:

- confirm the staging frontend host choice
- confirm the intended staging frontend URL
- keep `docs/test-payloads.md` ready
- keep `docs/staging-smoke-report.md` ready
- keep `docs/launch-blockers.md` ready

## Related Docs

- `docs/staging-handoff-brief.md`
- `docs/staging-deploy-runbook.md`
- `docs/rollout-roadmap.md`
