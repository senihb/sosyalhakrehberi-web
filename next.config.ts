import type { NextConfig } from "next";

function normalizeOrigin(value?: string): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/\/+$/, "");

  if (!/^https?:\/\//.test(normalized)) {
    return null;
  }

  return normalized;
}

const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const proxyTarget =
  normalizeOrigin(process.env.API_PROXY_TARGET) ??
  normalizeOrigin(publicApiBaseUrl);

// The proxy rewrites are active whenever NEXT_PUBLIC_API_BASE_URL is a full
// HTTP(S) origin (i.e. a production API URL). In that case the frontend code
// routes all API calls through /api-proxy, and Next.js forwards them to the
// real backend via this rewrite rule — avoiding CORS issues entirely.
const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    if (!proxyTarget) {
      return [];
    }

    // Enable the proxy when the public URL is a full origin (production mode).
    // The api.ts resolveApiBaseUrl() function maps any https:// origin to
    // /api-proxy, so we only need a valid proxyTarget to activate the rewrite.
    const isProxyMode =
      publicApiBaseUrl !== "/api-proxy" &&
      normalizeOrigin(publicApiBaseUrl) !== null;

    if (!isProxyMode) {
      return [];
    }

    return [
      {
        source: "/api-proxy/:path*",
        destination: `${proxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
