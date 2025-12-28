import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-v2.angelinedesdevises.fr",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
    minimumCacheTTL: 86400 * 30,
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
