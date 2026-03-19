import test from "node:test";
import assert from "node:assert/strict";
import {
  buildIncomeGateModel,
  getIncomeGateSnapshot,
  hasAcknowledgedIncomeGate,
  shouldPromptIncomeGate,
  type IncomeGateSnapshot,
} from "./income-gate.ts";

test("builds a guidance-only income gate model when income and household size are provided", () => {
  const model = buildIncomeGateModel({
    householdIncome: "12000",
    householdSize: "4",
  });

  assert.deepEqual(model, {
    householdIncome: 12000,
    householdSize: 4,
    perPersonIncome: 3000,
  });
});

test("does not build an income gate model when required inputs are blank", () => {
  const model = buildIncomeGateModel({
    householdIncome: "",
    householdSize: "4",
  });

  assert.equal(model, null);
});

test("prompts only until the current income snapshot has been acknowledged", () => {
  const acknowledgedSnapshot: IncomeGateSnapshot = {
    householdIncome: "12000",
    householdSize: "4",
  };

  assert.equal(
    shouldPromptIncomeGate(
      {
        householdIncome: "12000",
        householdSize: "4",
      },
      null,
    ),
    true,
  );

  assert.equal(
    shouldPromptIncomeGate(
      {
        householdIncome: "12000",
        householdSize: "4",
      },
      acknowledgedSnapshot,
    ),
    false,
  );
});

test("requires a fresh acknowledgement when household values change", () => {
  const acknowledgedSnapshot = getIncomeGateSnapshot({
    householdIncome: "12000",
    householdSize: "4",
  });

  assert.equal(
    hasAcknowledgedIncomeGate(acknowledgedSnapshot, {
      householdIncome: "12000",
      householdSize: "5",
    }),
    false,
  );
});
