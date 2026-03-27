# Test Payloads

These payloads are for controlled staging smoke validation against the canonical eligibility endpoint.

## Important

- Replace placeholder values with staging-safe test values that the backend team has approved.
- Do not use real citizen PII.
- Do not change the request contract.
- Use only `POST /api/v1/eligibility-check`.

## Shared Shape

```json
{
  "benefit_code": "TR_HOME_CARE_ALLOWANCE",
  "facts": {},
  "context": {
    "jurisdiction": "TR",
    "request_id": "staging-smoke-001"
  }
}
```

## Candidate ELIGIBLE Payload

```json
{
  "benefit_code": "TR_HOME_CARE_ALLOWANCE",
  "facts": {
    "disability_rate": 90,
    "household_income": 12000,
    "household_size": 5,
    "is_turkish_citizen": true,
    "is_resident_in_tr": true
  },
  "context": {
    "jurisdiction": "TR",
    "request_id": "staging-eligible-001"
  }
}
```

## Candidate NOT_ELIGIBLE Payload

```json
{
  "benefit_code": "TR_HOME_CARE_ALLOWANCE",
  "facts": {
    "disability_rate": 20,
    "household_income": 90000,
    "household_size": 2,
    "is_turkish_citizen": true,
    "is_resident_in_tr": true
  },
  "context": {
    "jurisdiction": "TR",
    "request_id": "staging-not-eligible-001"
  }
}
```

## Candidate NEEDS_INFO Payload

```json
{
  "benefit_code": "TR_HOME_CARE_ALLOWANCE",
  "facts": {
    "disability_rate": 80,
    "household_income": null,
    "household_size": null,
    "is_turkish_citizen": true,
    "is_resident_in_tr": true
  },
  "context": {
    "jurisdiction": "TR",
    "request_id": "staging-needs-info-001"
  }
}
```

## Candidate Invalid Payload Check

Use the UI to force an invalid or incomplete submission in a controlled non-production check.

Expected validation goals:

- safe fallback copy
- no broken screen state
- no contract invention in the frontend

## Validation Notes

Record the real staging outcome for each payload in `docs/staging-smoke-report.md`.

