import type { MetadataRoute } from "next";
import { getCategoriesActive } from "@/action/category.action";
import { config } from "@/config/config";
import { portfolioPath } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getCategoriesActive();
  return [
    {
      url: `${config.APP_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pages.map((page) => ({
      url: `${config.APP_URL}${portfolioPath(page)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${config.APP_URL}/apropos`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${config.APP_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
