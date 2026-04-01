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

// The path that Next.js rewrites to the real backend (see next.config.ts).
// All production API calls are routed through this proxy to avoid CORS issues.
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

/**
 * Resolves the base URL used for all API fetch calls.
 *
 * In production, NEXT_PUBLIC_API_BASE_URL is set to the real backend origin
 * (e.g. "https://api.sosyalhakrehberi.com"). Any full HTTPS origin is treated
 * as a production URL and routed through the Next.js proxy rewrite at
 * /api-proxy, which forwards the request to the backend server-side — avoiding
 * CORS issues and keeping credentials off the public internet.
 *
 * In development, NEXT_PUBLIC_API_BASE_URL is typically an HTTP localhost URL
 * (e.g. "http://localhost:8080") and is used directly without proxying.
 */
export function resolveApiBaseUrl(baseUrl = RAW_API_BASE_URL): string {
  if (!baseUrl) {
    throw new ApiClientError(
      "Backend bağlantısı yapılandırılmamış. NEXT_PUBLIC_API_BASE_URL ortam değişkenini tanımlayın.",
      500,
    );
  }

  // Route any full HTTPS origin through the Next.js proxy rewrite so that
  // browser requests never hit the backend directly (avoids CORS and 502s).
  // HTTP origins (e.g. localhost in development) are used as-is.
  if (/^https:\/\//i.test(baseUrl)) {
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
      const contentType = response.headers.get("content-type") ?? "";
      let errorBody: ApiErrorResponse | null = null;
      let fallbackMessage = "İstek işlenemedi. Lütfen daha sonra tekrar deneyin.";

      try {
        if (contentType.includes("application/json")) {
          errorBody = (await response.json()) as ApiErrorResponse;
        } else {
          await response.text();

          if (response.status === 404) {
            fallbackMessage =
              "Backend karar servisine ulaşılamadı. API base URL veya proxy yapılandırmasını kontrol edin.";
          }
        }
      } catch {
        errorBody = null;
      }

      throw new ApiClientError(
        errorBody?.message ?? fallbackMessage,
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
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      "Backend yanıtı alınamadı. CORS ayarlarını veya ağ bağlantısını kontrol edin.",
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
        "İstek işlenemedi. Lütfen daha sonra tekrar deneyin.",
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
      "Backend yanıtı alınamadı. CORS ayarlarını veya ağ bağlantısını kontrol edin.",
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
        "Gelir değerlendirmesi şu anda tamamlanamıyor. Lütfen daha sonra tekrar deneyin.",
        errorBody,
      );
    }

    return (await response.json()) as IncomeEvaluationResponse;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      "Backend yanıtı alınamadı. CORS ayarlarını veya ağ bağlantısını kontrol edin.",
      502,
    );
  }
}
