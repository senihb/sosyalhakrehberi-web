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

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    if (publicApiBaseUrl !== "/api-proxy" || !proxyTarget) {
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
