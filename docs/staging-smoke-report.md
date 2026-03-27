# Staging Smoke Report

## Run Info

- Date:
- Reviewer:
- Frontend URL:
- Backend URL:
- Build Reference:

## Environment

- `NEXT_PUBLIC_SITE_URL` correct: Pass / Fail
- `NEXT_PUBLIC_API_BASE_URL` correct: Pass / Fail
- staging CORS confirmed: Pass / Fail
- SSL active: Pass / Fail
- `robots` noindex: Pass / Fail
- sitemap production-safe: Pass / Fail

## Static And SEO

- `/`: Pass / Fail
- `/evde-bakim-maasi`: Pass / Fail
- `/evde-bakim-maasi/hesaplama`: Pass / Fail
- page title: Pass / Fail
- meta description: Pass / Fail
- canonical host: Pass / Fail
- OG preview: Pass / Fail
- favicon: Pass / Fail

## Tool Flow

- form load: Pass / Fail
- submit flow: Pass / Fail
- loading state: Pass / Fail
- `ELIGIBLE` render: Pass / Fail
- `NOT_ELIGIBLE` render: Pass / Fail
- `NEEDS_INFO` render: Pass / Fail
- `missing_facts` render: Pass / Fail
- trust/disclaimer visible: Pass / Fail
- no unnecessary PII: Pass / Fail

## Error Paths

- backend unavailable fallback: Pass / Fail
- invalid payload fallback: Pass / Fail
- timeout or network fail fallback: Pass / Fail
- empty or unexpected response fallback: Pass / Fail

## Integration

- request goes to staging backend: Pass / Fail
- no localhost calls: Pass / Fail
- only `POST /api/v1/eligibility-check` used for tool decision flow: Pass / Fail

## Notes

- 

## Final Outcome

- Smoke status: Pass / Fail
- Launch recommendation: Hold / Proceed to next review

