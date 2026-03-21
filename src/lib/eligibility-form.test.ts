import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEligibilityPayload,
  type CareDependencyStatus,
  initialEligibilityFormState,
  type EligibilityFormState,
} from "./eligibility-form.ts";

function makeFormState(
  overrides: Partial<EligibilityFormState> = {},
): EligibilityFormState {
  return {
    ...initialEligibilityFormState,
    disabilityRate: "80",
    householdIncome: "10000",
    householdSize: "4",
    careDependencyStatus: "full_dependency",
    ...overrides,
  };
}

test("maps yes attestations to true without changing the canonical request shape", () => {
  const payload = buildEligibilityPayload(
    makeFormState({
      isTurkishCitizen: true,
      isResidentInTr: true,
      careNeedConfirmedByBoard: true,
      caregiverSameResidence: true,
      hasAdditionalIncomeOrAssets: false,
    }),
    "req-yes",
  );

  assert.deepEqual(payload, {
    benefit_code: "TR_HOME_CARE_ALLOWANCE",
    facts: {
      care_recipient_disability_rate: 80,
      household_total_income: 10000,
      household_size: 4,
      is_turkish_citizen: true,
      is_resident_in_tr: true,
      care_dependency_status: "full_dependency",
      care_need_confirmed_by_board: true,
      caregiver_same_residence: true,
      has_additional_income_or_assets: false,
    },
    context: {
      jurisdiction: "TR",
      request_id: "req-yes",
    },
  });
});

test("maps no attestations to false", () => {
  const payload = buildEligibilityPayload(
    makeFormState({
      isTurkishCitizen: false,
      isResidentInTr: false,
      hasValidForeignerIdentityNumber: false,
      hasValidResidencePermit: false,
    }),
    "req-no",
  );

  assert.equal(payload.facts.is_turkish_citizen, false);
  assert.equal(payload.facts.is_resident_in_tr, false);
  assert.equal(payload.facts.has_valid_foreigner_identity_number, false);
  assert.equal(payload.facts.has_valid_residence_permit, false);
});

test("omits unknown attestations so backend can treat them as missing facts", () => {
  const payload = buildEligibilityPayload(
    makeFormState({
      isTurkishCitizen: null,
      isResidentInTr: null,
    }),
    "req-unknown",
  );

  assert.equal("is_turkish_citizen" in payload.facts, false);
  assert.equal("is_resident_in_tr" in payload.facts, false);
  assert.equal("has_valid_foreigner_identity_number" in payload.facts, false);
  assert.equal("has_valid_residence_permit" in payload.facts, false);
});

test("keeps explicit false attestations while blank numeric fields remain nullable", () => {
  const payload = buildEligibilityPayload(
    makeFormState({
      disabilityRate: "",
      householdIncome: "",
      householdSize: "",
      isTurkishCitizen: false,
      isResidentInTr: true,
      careDependencyStatus: null,
    }),
    "req-blank",
  );

  assert.deepEqual(payload.facts, {
    care_recipient_disability_rate: null,
    household_total_income: null,
    household_size: null,
    is_turkish_citizen: false,
    is_resident_in_tr: true,
  });
});

test("omits foreigner-only facts when the applicant is marked as a Turkish citizen", () => {
  const payload = buildEligibilityPayload(
    makeFormState({
      isTurkishCitizen: true,
      hasValidForeignerIdentityNumber: true,
      hasValidResidencePermit: true,
    }),
    "req-citizen",
  );

  assert.equal("has_valid_foreigner_identity_number" in payload.facts, false);
  assert.equal("has_valid_residence_permit" in payload.facts, false);
});

test("sends the non-citizen path and care dependency fields when provided", () => {
  const payload = buildEligibilityPayload(
    makeFormState({
      isTurkishCitizen: false,
      hasValidForeignerIdentityNumber: true,
      hasValidResidencePermit: true,
      careDependencyStatus: "partial_dependency" satisfies CareDependencyStatus,
      careNeedConfirmedByBoard: false,
      caregiverSameResidence: true,
      hasAdditionalIncomeOrAssets: true,
    }),
    "req-foreign",
  );

  assert.deepEqual(payload.facts, {
    care_recipient_disability_rate: 80,
    household_total_income: 10000,
    household_size: 4,
    is_turkish_citizen: false,
    has_valid_foreigner_identity_number: true,
    has_valid_residence_permit: true,
    care_dependency_status: "partial_dependency",
    care_need_confirmed_by_board: false,
    caregiver_same_residence: true,
    has_additional_income_or_assets: true,
  });
});
