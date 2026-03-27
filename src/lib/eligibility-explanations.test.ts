import test from "node:test";
import assert from "node:assert/strict";
import { buildDecisionViewModel } from "./eligibility-explanations.ts";

test("maps known not eligible reason codes into Turkish user-facing explanations", () => {
  const viewModel = buildDecisionViewModel({
    status: "NOT_ELIGIBLE",
    reasons: [
      {
        code: "RESIDENCY_REQUIRED",
        message: "technical message",
        severity: "ERROR",
      },
    ],
    missingFacts: [],
  });

  assert.equal(viewModel.primaryReason?.title, "İkamet şartı");
  assert.match(viewModel.summary, /uygunluk yönünde sonuç üretmedi/i);
  assert.equal(viewModel.primaryReason?.body.includes("RESIDENCY_REQUIRED"), false);
});

test("maps missing facts into user guidance for needs info states", () => {
  const viewModel = buildDecisionViewModel({
    status: "NEEDS_INFO",
    reasons: [],
    missingFacts: [
      {
        key: "is_turkish_citizen",
        message: "is_turkish_citizen is missing",
      },
    ],
  });

  assert.equal(viewModel.title, "Daha fazla bilgi gerekli");
  assert.equal(viewModel.missingInformation[0]?.title, "Vatandaşlık bilgisini netleştirin");
  assert.match(viewModel.nextStepBody, /eksik görünen bilgileri tamamlayın/i);
  assert.equal(viewModel.checklistTitle, "Bilgileri tamamlayın");
  assert.equal(viewModel.helperLinks[0]?.href, "/evde-bakim-maasi/hesaplama#form-start");
});

test("uses safe fallback copy for unknown reason codes without leaking technical identifiers", () => {
  const viewModel = buildDecisionViewModel({
    status: "ELIGIBLE",
    reasons: [
      {
        code: "UNMAPPED_ENGINE_REASON",
        message: "engine detail",
        severity: "INFO",
      },
    ],
    missingFacts: [],
  });

  assert.equal(viewModel.primaryReason?.title, "Mevcut bilgiler olumlu görünüyor");
  assert.equal(viewModel.primaryReason?.body.includes("UNMAPPED_ENGINE_REASON"), false);
  assert.equal(viewModel.primaryReason?.body.includes("engine detail"), false);
});

test("never throws and still returns a usable model when reasons and missing facts are empty", () => {
  const viewModel = buildDecisionViewModel({
    status: "NEEDS_INFO",
    reasons: [],
    missingFacts: [],
  });

  assert.equal(viewModel.primaryReason?.title, "Karar için daha fazla bilgi gerekiyor");
  assert.deepEqual(viewModel.secondaryReasons, []);
  assert.deepEqual(viewModel.missingInformation, []);
  assert.equal(viewModel.helperLinks.length > 0, true);
});

test("returns status-specific guided links and checklist items for eligible states", () => {
  const viewModel = buildDecisionViewModel({
    status: "ELIGIBLE",
    reasons: [],
    missingFacts: [],
  });

  assert.equal(viewModel.checklistTitle, "Başvuru öncesi hazırlık");
  assert.equal(viewModel.checklistItems.length, 3);
  assert.equal(viewModel.helperLinks[0]?.href, "/evde-bakim-maasi");
});

