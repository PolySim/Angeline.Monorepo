import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/types"],
  images: {
    domains: [
      "api.angelinedesdevises.fr",
      "api-v2.angelinedesdevises.fr",
      "127.0.0.1",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
