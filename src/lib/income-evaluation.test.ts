import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIncomeEvaluationPayload,
  formatCurrency,
  getIncomeStatusTitle,
  initialIncomeFormState,
} from "./income-evaluation.ts";

test("builds the backend income payload without frontend logic", () => {
  assert.deepEqual(
    buildIncomeEvaluationPayload({
      householdSize: "3",
      totalIncome: "15000",
    }),
    {
      household_size: 3,
      total_income: 15000,
    },
  );
});

test("keeps blank income inputs nullable", () => {
  assert.deepEqual(buildIncomeEvaluationPayload(initialIncomeFormState), {
    household_size: null,
    total_income: null,
  });
});

test("formats currency values for display only", () => {
  assert.equal(formatCurrency(12500), "12.500 TL");
  assert.equal(formatCurrency(null), null);
});

test("returns status titles without adding eligibility logic", () => {
  assert.equal(getIncomeStatusTitle("ELIGIBLE"), "Gelir değerlendirmesi olumlu görünüyor");
  assert.equal(
    getIncomeStatusTitle("NOT_ELIGIBLE"),
    "Gelir değerlendirmesi olumsuz görünüyor",
  );
  assert.equal(
    getIncomeStatusTitle("NEEDS_INFO"),
    "Gelir değerlendirmesi için ek bilgi gerekiyor",
  );
});
