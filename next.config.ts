import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://api.sosyalhakrehberi.com/:path*",
      },
    ];
  },
};

export default nextConfig;
