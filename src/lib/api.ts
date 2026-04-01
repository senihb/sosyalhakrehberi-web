import {
  type ApiErrorResponse,
  type EligibilityCheckRequest,
  type EligibilityCheckResponse,
  type IncomeEvaluationRequest,
  type IncomeEvaluationResponse,
  type LeadCreateRequest,
  type LeadCreateResponse,
} from "./types.ts";

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
const PRODUCTION_API_ORIGIN = "https://api.sosyalhakrehberi.com";
const PROXY_API_BASE_URL = "/api-proxy";

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

async function readErrorResponse(response: Response): Promise<ApiErrorResponse | null> {
  try {
    const rawBody = await response.text();
    if (!rawBody.trim()) {
      return null;
    }

    try {
      return JSON.parse(rawBody) as ApiErrorResponse;
    } catch {
      return {
        message: rawBody.slice(0, 500),
        error: "backend_error",
        status: response.status,
        correlation_id: response.headers.get("X-Correlation-ID") ?? "",
      };
    }
  } catch {
    return null;
  }
}

function toClientError(
  response: Response | null,
  fallbackMessage: string,
  errorBody: ApiErrorResponse | null,
): ApiClientError {
  return new ApiClientError(errorBody?.message ?? fallbackMessage, response?.status ?? 500, {
    correlationId:
      errorBody?.correlation_id ??
      response?.headers.get("X-Correlation-ID") ??
      undefined,
    details: errorBody?.errors,
  });
}

export function resolveApiBaseUrl(baseUrl = RAW_API_BASE_URL): string {
  if (!baseUrl) {
    throw new ApiClientError(
      "Backend baglantisi yapilandirilmamis. NEXT_PUBLIC_API_BASE_URL ortam degiskenini tanimlayin.",
      500,
    );
  }

  if (baseUrl === PRODUCTION_API_ORIGIN) {
    return PROXY_API_BASE_URL;
  }

  return baseUrl;
}

function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export async function checkEligibility(
  payload: EligibilityCheckRequest,
): Promise<EligibilityCheckResponse> {
  try {
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
      const errorBody = await readErrorResponse(response);
      throw toClientError(
        response,
        "Istek islenemedi. Lutfen daha sonra tekrar deneyin.",
        errorBody,
      );
    }

    return (await response.json()) as EligibilityCheckResponse;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      "Backend yaniti alinamadi. CORS ayarlarini veya ag baglantisini kontrol edin.",
      502,
    );
  }
}

export async function evaluateIncome(
  payload: IncomeEvaluationRequest,
): Promise<IncomeEvaluationResponse> {
  try {
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
      const errorBody = await readErrorResponse(response);
      throw toClientError(
        response,
        "Istek islenemedi. Lutfen daha sonra tekrar deneyin.",
        errorBody,
      );
    }

    return (await response.json()) as IncomeEvaluationResponse;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      "Backend yaniti alinamadi. CORS ayarlarini veya ag baglantisini kontrol edin.",
      502,
    );
  }
}

export async function createLead(
  payload: LeadCreateRequest,
): Promise<LeadCreateResponse | null> {
  try {
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
      const errorBody = await readErrorResponse(response);
      throw toClientError(
        response,
        "Istek islenemedi. Lutfen daha sonra tekrar deneyin.",
        errorBody,
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
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      "Backend yaniti alinamadi. CORS ayarlarini veya ag baglantisini kontrol edin.",
      502,
    );
  }
}
