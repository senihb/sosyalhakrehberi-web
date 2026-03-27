import type { EligibilityCheckRequest } from "@/lib/types";

export type TriStateAttestation = true | false | null;

export type OldAgeFormState = {
  age: string;
  hasSpouse: TriStateAttestation;
  selfMonthlyIncome: string;
  spouseMonthlyIncome: string;
  hasSocialSecurity: TriStateAttestation;
  receivesPension: TriStateAttestation;
};

export const initialOldAgeFormState: OldAgeFormState = {
  age: "",
  hasSpouse: null,
  selfMonthlyIncome: "",
  spouseMonthlyIncome: "",
  hasSocialSecurity: null,
  receivesPension: null,
};

function toNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildOldAgePayload(
  form: OldAgeFormState,
  requestId: string,
): EligibilityCheckRequest {
  const facts: EligibilityCheckRequest["facts"] = {
    age: toNumber(form.age),
    self_monthly_income: toNumber(form.selfMonthlyIncome),
  };

  if (form.hasSpouse !== null) {
    facts.has_spouse = form.hasSpouse;
  }

  if (form.hasSpouse === true) {
    facts.spouse_monthly_income = toNumber(form.spouseMonthlyIncome);
  }

  if (form.hasSocialSecurity !== null) {
    facts.has_social_security = form.hasSocialSecurity;
  }

  if (form.receivesPension !== null) {
    facts.receives_pension = form.receivesPension;
  }

  return {
    benefit_code: "TR_OLD_AGE_PENSION",
    facts,
    context: {
      jurisdiction: "TR",
      request_id: requestId,
    },
  };
}

