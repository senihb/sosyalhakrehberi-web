import type {
  LeadCreateRequest,
  IncomeEvaluationRequest,
  IncomeEvaluationResponse,
} from "@/lib/types";

export type IncomeFormState = {
  householdSize: string;
  totalIncome: string;
};

export type IncomeLeadFormState = {
  name: string;
  contact: string;
};

export const initialIncomeFormState: IncomeFormState = {
  householdSize: "",
  totalIncome: "",
};

export const initialIncomeLeadFormState: IncomeLeadFormState = {
  name: "",
  contact: "",
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

export function buildIncomeLeadPayload(
  form: IncomeLeadFormState,
  resultStatus: IncomeEvaluationResponse["status"],
): LeadCreateRequest {
  const payload: LeadCreateRequest = {
    source: "income_test",
    result_status: resultStatus,
  };

  if (form.name.trim()) {
    payload.name = form.name.trim();
  }

  if (form.contact.trim()) {
    payload.contact = form.contact.trim();
  }

  return payload;
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

export function getIncomeStatusTitle(
  status: IncomeEvaluationResponse["status"],
): string {
  if (status === "ELIGIBLE") {
    return "Gelir değerlendirmesi olumlu görünüyor";
  }

  if (status === "NOT_ELIGIBLE") {
    return "Gelir değerlendirmesi olumsuz görünüyor";
  }

  return "Gelir değerlendirmesi için ek bilgi gerekiyor";
}

