# Home Care Live Smoke Checklist

This document records the frontend-side live smoke pass for the current Home Care public flow.

Use it after merged production-facing changes and before opening any new Home Care semantics work.

## Preconditions

- `main` is current locally
- latest merged frontend changes are deployed
- backend canonical contract is unchanged
- backend live smoke checklist is merged in `SocialRightOS`

## Live Smoke

- root domain: pass/fail
- api health: pass/fail
- www redirect: pass/fail
- income gate: pass/fail
- tri-state flow: pass/fail
- guided result states: pass/fail
- trust/content links: pass/fail
- canonical API usage: pass/fail

## Frontend Verification Notes

### Root Domain

- Check `https://sosyalhakrehberi.com`
- Confirm the page responds with `200 OK`
- Confirm the root page exposes canonical metadata for the production hostname

### API Health

- Check `https://api.sosyalhakrehberi.com/api/system/health`
- Expect `200 OK`
- Expect JSON body with `status: ok`

### WWW Redirect

- Check `https://www.sosyalhakrehberi.com`
- Expect redirect to `https://sosyalhakrehberi.com/`

### Income Gate

- Open `https://sosyalhakrehberi.com/evde-bakim-maasi/hesaplama`
- Enter household income and household size
- Start the assessment
- Confirm the soft income gate appears
- Confirm `Yine de devam et` still allows the backend-backed assessment flow

### Tri-State Flow

- Confirm citizenship and residency fields show:
  - `Evet`
  - `Hayýr`
  - `Bilmiyorum`
- Confirm the calculator still renders without frontend-owned eligibility logic

### Guided Result States

- Confirm live bundle and deployed UI contain the guided result surface for:
  - `ELIGIBLE`
  - `NOT_ELIGIBLE`
  - `NEEDS_INFO`
- Confirm raw technical reason codes are not shown in the default user view

### Trust and Content Links

- Confirm trust guidance renders on the result screen
- Confirm the main Home Care guide links to:
  - `/evde-bakim-maasi/sartlar`
  - `/evde-bakim-maasi/gelir-ve-hane-bilgisi`

### Canonical API Usage

- Confirm the frontend continues to use:
  - `POST /api/v1/eligibility-check`
- Confirm no frontend threshold or eligibility semantics were introduced

## Current Recorded Outcome

Latest recorded outcome for the merged Home Care public flow:

- root domain: pass
- api health: pass
- www redirect: pass
- income gate: pass
- tri-state flow: pass
- guided result states: pass
- trust/content links: pass
- canonical API usage: pass

## Follow-Up Items

- Optional housekeeping: resolve the Node `MODULE_TYPELESS_PACKAGE_JSON` warning without changing runtime behavior
- Keep Home Care in stabilization hold unless a concrete bug or an explicit product/legal decision reopens semantics work
