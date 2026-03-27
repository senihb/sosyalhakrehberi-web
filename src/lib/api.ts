import {
  type ApiErrorResponse,
  type EligibilityCheckRequest,
  type EligibilityCheckResponse,
  type IncomeEvaluationRequest,
  type IncomeEvaluationResponse,
  type LeadCreateRequest,
  type LeadCreateResponse,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export class ApiClientError extends Error {
  status: number;
  correlationId?: string;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    status = 500,
    options?: {
      correlationId?: string;
      details?: Record<string, string[]>;
    },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.correlationId = options?.correlationId;
    this.details = options?.details;
  }
}

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new ApiClientError(
      "Backend bağlantısı yapılandırılmamış. NEXT_PUBLIC_API_BASE_URL ortam değişkenini tanımlayın.",
      500,
    );
  }

  return API_BASE_URL;
}

export async function checkEligibility(
  payload: EligibilityCheckRequest,
): Promise<EligibilityCheckResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/eligibility-check`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorBody: ApiErrorResponse | null = null;

    try {
      errorBody = (await response.json()) as ApiErrorResponse;
    } catch {
      errorBody = null;
    }

    throw new ApiClientError(
      errorBody?.message ?? "İstek işlenemedi. Lütfen daha sonra tekrar deneyin.",
      response.status,
      {
        correlationId:
          errorBody?.correlation_id ??
          response.headers.get("X-Correlation-ID") ??
          undefined,
        details: errorBody?.errors,
      },
    );
  }

  return (await response.json()) as EligibilityCheckResponse;
}

export async function evaluateIncome(
  payload: IncomeEvaluationRequest,
): Promise<IncomeEvaluationResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/evaluate/income`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorBody: ApiErrorResponse | null = null;

    try {
      errorBody = (await response.json()) as ApiErrorResponse;
    } catch {
      errorBody = null;
    }

    throw new ApiClientError(
      errorBody?.message ?? "İstek işlenemedi. Lütfen daha sonra tekrar deneyin.",
      response.status,
      {
        correlationId:
          errorBody?.correlation_id ??
          response.headers.get("X-Correlation-ID") ??
          undefined,
        details: errorBody?.errors,
      },
    );
  }

  return (await response.json()) as IncomeEvaluationResponse;
}

export async function createLead(
  payload: LeadCreateRequest,
): Promise<LeadCreateResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/lead`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorBody: ApiErrorResponse | null = null;

    try {
      errorBody = (await response.json()) as ApiErrorResponse;
    } catch {
      errorBody = null;
    }

    throw new ApiClientError(
      errorBody?.message ?? "İstek işlenemedi. Lütfen daha sonra tekrar deneyin.",
      response.status,
      {
        correlationId:
          errorBody?.correlation_id ??
          response.headers.get("X-Correlation-ID") ??
          undefined,
        details: errorBody?.errors,
      },
    );
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return (await response.json()) as LeadCreateResponse;
  } catch {
    return null;
  }
}

