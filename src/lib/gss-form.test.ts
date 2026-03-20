import test from "node:test";
import assert from "node:assert/strict";
import { buildGssPayload, initialGssFormState } from "./gss-form.ts";

test("builds the canonical GSS payload for explicit yes and no answers", () => {
  const payload = buildGssPayload(
    {
      ...initialGssFormState,
      grossHouseholdIncome: "30000",
      householdSize: "3",
      hasSocialSecurity: false,
      hasActiveInsurance: true,
      isCoveredAsDependent: false,
    },
    "gss-explicit",
  );

  assert.equal(payload.benefit_code, "TR_GSS");
  assert.deepEqual(payload.facts, {
    gross_household_income: 30000,
    household_size: 3,
    has_social_security: false,
    has_active_insurance: true,
    is_covered_as_dependent: false,
  });
});

test("omits unknown tri-state facts so backend can produce needs info safely", () => {
  const payload = buildGssPayload(
    {
      ...initialGssFormState,
      grossHouseholdIncome: "30000",
      householdSize: "3",
    },
    "gss-needs-info",
  );

  assert.deepEqual(payload.facts, {
    gross_household_income: 30000,
    household_size: 3,
  });
});

test("keeps blank numeric inputs nullable without inventing extra facts", () => {
  const payload = buildGssPayload(
    {
      ...initialGssFormState,
      grossHouseholdIncome: "",
      householdSize: "",
      hasSocialSecurity: true,
    },
    "gss-nullable",
  );

  assert.deepEqual(payload.facts, {
    gross_household_income: null,
    household_size: null,
    has_social_security: true,
  });
});
