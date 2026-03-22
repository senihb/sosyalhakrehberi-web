import type {
  IncomeEvaluationRequest,
  IncomeEvaluationResponse,
} from "@/lib/types";

export type IncomeFormState = {
  householdSize: string;
  totalIncome: string;
};

export const initialIncomeFormState: IncomeFormState = {
  householdSize: "",
  totalIncome: "",
};

function toNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildIncomeEvaluationPayload(
  form: IncomeFormState,
): IncomeEvaluationRequest {
  return {
    household_size: toNumber(form.householdSize),
    total_income: toNumber(form.totalIncome),
  };
}

export function formatCurrency(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} TL`;
}

export function getIncomeStatusTitle(status: IncomeEvaluationResponse["status"]): string {
  if (status === "ELIGIBLE") {
    return "Gelir değerlendirmesi olumlu görünüyor";
  }

  if (status === "NOT_ELIGIBLE") {
    return "Gelir değerlendirmesi olumsuz görünüyor";
  }

  return "Gelir değerlendirmesi için ek bilgi gerekiyor";
}
