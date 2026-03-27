import test from "node:test";
import assert from "node:assert/strict";
import { buildGssDecisionViewModel } from "./gss-explanations.ts";

test("maps active insurance reasons into user-facing GSS copy", () => {
  const model = buildGssDecisionViewModel({
    status: "NOT_ELIGIBLE",
    reasons: [
      {
        code: "ACTIVE_INSURANCE_PRESENT",
        message: "technical",
        severity: "ERROR",
      },
    ],
    missingFacts: [],
  });

  assert.equal(model.primaryReason?.title, "Aktif sigorta durumu sonucu etkiliyor");
  assert.match(model.summary, /olumsuz bir ön değerlendirme/i);
});

test("maps missing GSS facts into completion guidance", () => {
  const model = buildGssDecisionViewModel({
    status: "NEEDS_INFO",
    reasons: [],
    missingFacts: [
      {
        key: "has_social_security",
        message: "missing",
      },
    ],
  });

  assert.equal(model.missingInformation[0]?.title, "Sosyal güvence bilginizi netleştirin");
  assert.equal(model.helperLinks[0]?.href, "/gss-gelir-testi#form-start");
});

test("uses safe fallback text for unknown GSS reason codes", () => {
  const model = buildGssDecisionViewModel({
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
  assert.match(model.title, /uygun görünüyorsunuz/i);
});

