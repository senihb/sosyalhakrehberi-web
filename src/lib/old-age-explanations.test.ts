import test from "node:test";
import assert from "node:assert/strict";
import { buildOldAgeDecisionViewModel } from "./old-age-explanations.ts";

test("maps age-related not eligible reasons into user-facing copy", () => {
  const model = buildOldAgeDecisionViewModel({
    status: "NOT_ELIGIBLE",
    reasons: [
      {
        code: "AGE_REQUIREMENT_NOT_MET",
        message: "technical",
        severity: "ERROR",
      },
    ],
    missingFacts: [],
  });

  assert.equal(model.primaryReason?.title, "Yas kosulu sonucu etkiliyor");
});

test("maps spouse income missing facts into completion guidance", () => {
  const model = buildOldAgeDecisionViewModel({
    status: "NEEDS_INFO",
    reasons: [],
    missingFacts: [
      {
        key: "spouse_monthly_income",
        message: "missing",
      },
    ],
  });

  assert.equal(model.missingInformation[0]?.title, "Es gelir bilgisini tamamlayin");
  assert.equal(model.helperLinks[0]?.href, "/65-yas-ayligi-uygunluk-testi#form-start");
});

test("uses safe fallback text for unknown old-age reason codes", () => {
  const model = buildOldAgeDecisionViewModel({
    status: "ELIGIBLE",
    reasons: [
      {
        code: "UNMAPPED_REASON",
        message: "technical",
        severity: "INFO",
      },
    ],
    missingFacts: [],
  });

  assert.doesNotMatch(model.primaryReason?.body ?? "", /UNMAPPED_REASON/);
  assert.match(model.title, /uygun gorunuyorsunuz/i);
});
