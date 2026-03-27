import test from "node:test";
import assert from "node:assert/strict";
import { buildOldAgePayload, initialOldAgeFormState } from "./old-age-form.ts";

test("builds the canonical old-age payload for a single applicant", () => {
  const payload = buildOldAgePayload(
    {
      ...initialOldAgeFormState,
      age: "67",
      hasSpouse: false,
      selfMonthlyIncome: "5000",
      hasSocialSecurity: false,
      receivesPension: false,
    },
    "old-age-single",
  );

  assert.equal(payload.benefit_code, "TR_OLD_AGE_PENSION");
  assert.deepEqual(payload.facts, {
    age: 67,
    has_spouse: false,
    self_monthly_income: 5000,
    has_social_security: false,
    receives_pension: false,
  });
});

test("includes spouse income only when the applicant has a spouse", () => {
  const payload = buildOldAgePayload(
    {
      ...initialOldAgeFormState,
      age: "70",
      hasSpouse: true,
      selfMonthlyIncome: "4000",
      spouseMonthlyIncome: "6000",
      hasSocialSecurity: false,
      receivesPension: false,
    },
    "old-age-spouse",
  );

  assert.equal(payload.facts.spouse_monthly_income, 6000);
});

test("omits unknown tri-state facts so backend can produce needs info safely", () => {
  const payload = buildOldAgePayload(
    {
      ...initialOldAgeFormState,
      age: "70",
      selfMonthlyIncome: "4000",
    },
    "old-age-needs-info",
  );

  assert.deepEqual(payload.facts, {
    age: 70,
    self_monthly_income: 4000,
  });
});

