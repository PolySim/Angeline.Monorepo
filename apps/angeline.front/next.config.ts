import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/types"],
  images: {
    domains: [
      "api.angelinedesdevises.fr",
      "127.0.0.1",
      "141.94.205.91",
      "141.94.205.91:5066",
      "localhost",
    ],
  },
};

export default nextConfig;
