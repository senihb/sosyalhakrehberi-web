import assert from "node:assert/strict";
import test from "node:test";
import {
  adaptEligibleBenefits,
  adaptGuidanceSteps,
  adaptPrimaryBenefit,
  adaptReasonMessages,
  adaptRiskMessages,
  adaptRuleTraceMessages,
  getConfidenceBadgeLabel,
} from "./income-result-view.ts";

test("sorts eligible benefits by priority descending for rendering", () => {
  const benefits = adaptEligibleBenefits([
    { name: "A", priority: 1 },
    { name: "B", priority: 3 },
    { name: "C", priority: 2 },
  ]);

  assert.deepEqual(benefits.map((benefit) => benefit.name), ["B", "C", "A"]);
});

test("returns the first benefit after priority sort as primary", () => {
  assert.equal(
    adaptPrimaryBenefit([
      { name: "A", priority: 1 },
      { name: "B", priority: 5 },
    ])?.name,
    "B",
  );
});

test("maps reason messages without rewriting them", () => {
  assert.deepEqual(
    adaptReasonMessages([
      { code: "X", message: "Gelir koşulu sağlanmadı", severity: "ERROR" },
      { code: "Y", message: "Ek belge istenebilir", severity: "WARNING" },
    ]),
    ["Gelir koşulu sağlanmadı", "Ek belge istenebilir"],
  );
});

test("maps rule trace messages only when message exists", () => {
  assert.deepEqual(
    adaptRuleTraceMessages({
      residency_check: { passed: true, message: "İkamet koşulu geçti" },
      income_check: { passed: false, message: "Gelir koşulu sağlanmadı" },
      ignored: true,
    }),
    [
      { message: "İkamet koşulu geçti", passed: true },
      { message: "Gelir koşulu sağlanmadı", passed: false },
    ],
  );
});

test("extracts only ERROR severity reasons for risk block", () => {
  assert.deepEqual(
    adaptRiskMessages([
      { code: "WARN", message: "Ek belge istenebilir", severity: "WARNING" },
      { code: "ERR", message: "Gelir eşiği aşılmış", severity: "ERROR" },
    ]),
    ["Gelir eşiği aşılmış"],
  );
});

test("builds guidance steps from ui_hints and next_step_details in order", () => {
  assert.deepEqual(
    adaptGuidanceSteps(
      { next_steps: ["Belgeleri hazırla", "Başvuruyu takip et"] },
      [
        { priority: 2, next_step_details: { description: "İlk başvuruyu tamamla" } },
        { priority: 1, next_step_details: { description: "Belgeleri teslim et" } },
      ],
    ),
    [
      "Belgeleri hazırla",
      "Başvuruyu takip et",
      "İlk başvuruyu tamamla",
      "Belgeleri teslim et",
    ],
  );
});

test("maps confidence values into user-facing badge labels", () => {
  assert.equal(getConfidenceBadgeLabel("high"), "Yüksek güven");
  assert.equal(getConfidenceBadgeLabel("medium"), "Orta güven");
  assert.equal(getConfidenceBadgeLabel("low"), "Düşük güven");
});

