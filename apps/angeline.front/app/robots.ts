import { config } from "@/config/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/*",
        disallow: ["/admin/*", "api.*", "/signIn/*"],
      },
    ],
    sitemap: `${config.APP_URL}/sitemap.xml`,
  };
}
