import type { EligibilityCheckRequest } from "@/lib/types";

export type TriStateAttestation = true | false | null;

export type EligibilityFormState = {
  disabilityRate: string;
  householdIncome: string;
  householdSize: string;
  isTurkishCitizen: TriStateAttestation;
  isResidentInTr: TriStateAttestation;
  hasValidForeignerIdentityNumber: TriStateAttestation;
  hasValidResidencePermit: TriStateAttestation;
  isFullyDependent: TriStateAttestation;
  careNeedConfirmedByBoard: TriStateAttestation;
  caregiverSameResidence: TriStateAttestation;
  hasAdditionalIncomeOrAssets: TriStateAttestation;
};

export const initialEligibilityFormState: EligibilityFormState = {
  disabilityRate: "",
  householdIncome: "",
  householdSize: "",
  isTurkishCitizen: null,
  isResidentInTr: null,
  hasValidForeignerIdentityNumber: null,
  hasValidResidencePermit: null,
  isFullyDependent: null,
  careNeedConfirmedByBoard: null,
  caregiverSameResidence: null,
  hasAdditionalIncomeOrAssets: null,
};

function toNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toCareDependencyStatus(
  value: TriStateAttestation,
): "full_dependency" | "partial_dependency" | null {
  if (value === true) {
    return "full_dependency";
  }

  if (value === false) {
    return "partial_dependency";
  }

  return null;
}

export function buildEligibilityPayload(
  form: EligibilityFormState,
  requestId: string,
): EligibilityCheckRequest {
  const disabilityRate = toNumber(form.disabilityRate);
  const facts: EligibilityCheckRequest["facts"] = {
    care_recipient_disability_rate: disabilityRate,
    household_total_income: toNumber(form.householdIncome),
    household_size: toNumber(form.householdSize),
  };

  // The current live backend still expects this fact even though the UI no longer
  // asks it separately. A provided report rate means the report fact is present.
  if (disabilityRate !== null) {
    facts.has_valid_health_report = true;
  }

  if (form.isTurkishCitizen !== null) {
    facts.is_turkish_citizen = form.isTurkishCitizen;
  }

  if (form.isResidentInTr !== null) {
    facts.is_resident_in_tr = form.isResidentInTr;
  }

  if (form.isTurkishCitizen === false) {
    if (form.hasValidForeignerIdentityNumber !== null) {
      facts.has_valid_foreigner_identity_number =
        form.hasValidForeignerIdentityNumber;
    }

    if (form.hasValidResidencePermit !== null) {
      facts.has_valid_residence_permit = form.hasValidResidencePermit;
    }
  }

  const careDependencyStatus = toCareDependencyStatus(form.isFullyDependent);
  if (careDependencyStatus !== null) {
    facts.care_dependency_status = careDependencyStatus;
  }

  if (form.careNeedConfirmedByBoard !== null) {
    facts.care_need_confirmed_by_board = form.careNeedConfirmedByBoard;
  }

  if (form.caregiverSameResidence !== null) {
    facts.caregiver_same_residence = form.caregiverSameResidence;
  }

  if (form.hasAdditionalIncomeOrAssets !== null) {
    facts.has_additional_income_or_assets = form.hasAdditionalIncomeOrAssets;
  }

  return {
    benefit_code: "TR_HOME_CARE_ALLOWANCE",
    facts,
    context: {
      jurisdiction: "TR",
      request_id: requestId,
    },
  };
}

