import assert from "node:assert/strict";
import test from "node:test";
import { trackIncomeEvaluationEvent } from "./income-evaluation-analytics.ts";

test("income analytics tracker is a safe no-op on the server", () => {
  assert.doesNotThrow(() => {
    trackIncomeEvaluationEvent("income_test_started");
    trackIncomeEvaluationEvent("income_test_completed");
    trackIncomeEvaluationEvent("income_test_result_ELIGIBLE");
    trackIncomeEvaluationEvent("income_test_result_NOT_ELIGIBLE");
    trackIncomeEvaluationEvent("conversion_cta_clicked", {
      intent: "consultation",
    });
    trackIncomeEvaluationEvent("consultation_requested", {
      has_name: true,
      has_contact: false,
    });
  });
});

