import type { EligibilityFormState } from "@/lib/eligibility-form";

export type IncomeGateSnapshot = {
  householdIncome: string;
  householdSize: string;
};

export type IncomeGateModel = {
  householdIncome: number;
  householdSize: number;
  perPersonIncome: number;
};

function toPositiveNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function getIncomeGateSnapshot(
  form: Pick<EligibilityFormState, "householdIncome" | "householdSize">,
): IncomeGateSnapshot {
  return {
    householdIncome: form.householdIncome.trim(),
    householdSize: form.householdSize.trim(),
  };
}

export function hasAcknowledgedIncomeGate(
  acknowledgedSnapshot: IncomeGateSnapshot | null,
  form: Pick<EligibilityFormState, "householdIncome" | "householdSize">,
): boolean {
  if (!acknowledgedSnapshot) {
    return false;
  }

  const currentSnapshot = getIncomeGateSnapshot(form);

  return (
    acknowledgedSnapshot.householdIncome === currentSnapshot.householdIncome &&
    acknowledgedSnapshot.householdSize === currentSnapshot.householdSize
  );
}

export function buildIncomeGateModel(
  form: Pick<EligibilityFormState, "householdIncome" | "householdSize">,
): IncomeGateModel | null {
  const householdIncome = toPositiveNumber(form.householdIncome);
  const householdSize = toPositiveNumber(form.householdSize);

  if (!householdIncome || !householdSize) {
    return null;
  }

  return {
    householdIncome,
    householdSize,
    perPersonIncome: householdIncome / householdSize,
  };
}

export function shouldPromptIncomeGate(
  form: Pick<EligibilityFormState, "householdIncome" | "householdSize">,
  acknowledgedSnapshot: IncomeGateSnapshot | null,
): boolean {
  const model = buildIncomeGateModel(form);

  if (!model) {
    return false;
  }

  return !hasAcknowledgedIncomeGate(acknowledgedSnapshot, form);
}
