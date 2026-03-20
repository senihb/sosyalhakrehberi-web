import type { EligibilityCheckRequest } from "@/lib/types";

export type TriStateAttestation = true | false | null;

export type GssFormState = {
  grossHouseholdIncome: string;
  householdSize: string;
  hasSocialSecurity: TriStateAttestation;
  hasActiveInsurance: TriStateAttestation;
  isCoveredAsDependent: TriStateAttestation;
};

export const initialGssFormState: GssFormState = {
  grossHouseholdIncome: "",
  householdSize: "",
  hasSocialSecurity: null,
  hasActiveInsurance: null,
  isCoveredAsDependent: null,
};

function toNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildGssPayload(
  form: GssFormState,
  requestId: string,
): EligibilityCheckRequest {
  const facts: EligibilityCheckRequest["facts"] = {
    gross_household_income: toNumber(form.grossHouseholdIncome),
    household_size: toNumber(form.householdSize),
  };

  if (form.hasSocialSecurity !== null) {
    facts.has_social_security = form.hasSocialSecurity;
  }

  if (form.hasActiveInsurance !== null) {
    facts.has_active_insurance = form.hasActiveInsurance;
  }

  if (form.isCoveredAsDependent !== null) {
    facts.is_covered_as_dependent = form.isCoveredAsDependent;
  }

  return {
    benefit_code: "TR_GSS",
    facts,
    context: {
      jurisdiction: "TR",
      request_id: requestId,
    },
  };
}
