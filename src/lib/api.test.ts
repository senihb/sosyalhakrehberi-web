import assert from "node:assert/strict";
import test from "node:test";
import type { ApiErrorResponse } from "./api";

const originalFetch = globalThis.fetch;
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080";

async function loadApiModule() {
  return import("./api.ts");
}

test("createLead surfaces backend validation payloads", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        message: "The request payload is invalid.",
        error: "validation_error",
        status: 422,
        correlation_id: "corr-123",
        errors: {
          source: ["The source field is required."],
        },
      } satisfies ApiErrorResponse),
      {
        status: 422,
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-ID": "corr-123",
        },
      },
    ) as typeof fetch;

  const { ApiClientError, createLead } = await loadApiModule();

  await assert.rejects(
    createLead({
      source: "income_test",
      result_status: "ELIGIBLE",
    }),
    (error: unknown) => {
      assert.ok(error instanceof ApiClientError);
      assert.equal(error.status, 422);
      assert.equal(error.message, "The request payload is invalid.");
      assert.equal(error.correlationId, "corr-123");
      assert.deepEqual(error.details, {
        source: ["The source field is required."],
      });
      return true;
    },
  );
});

test("createLead falls back to a network error message when the backend cannot be reached", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };

  const { ApiClientError, createLead } = await loadApiModule();

  await assert.rejects(
    createLead({
      source: "income_test",
      result_status: "ELIGIBLE",
    }),
    (error: unknown) => {
      assert.ok(error instanceof ApiClientError);
      assert.equal(error.status, 502);
      assert.equal(
        error.message,
        "Backend yanıtı alınamadı. CORS ayarlarını veya ağ bağlantısını kontrol edin.",
      );
      return true;
    },
  );
});

test("resolveApiBaseUrl proxies the production backend through Vercel same-origin path", async () => {
  const { resolveApiBaseUrl } = await loadApiModule();
  assert.equal(resolveApiBaseUrl("https://api.sosyalhakrehberi.com"), "/api-proxy");
  assert.equal(resolveApiBaseUrl("http://localhost:8080"), "http://localhost:8080");
});

test.after(() => {
  globalThis.fetch = originalFetch;
  if (originalApiBaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  }
});
