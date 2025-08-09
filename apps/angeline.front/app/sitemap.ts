import { getCategoriesActive } from "@/action/category.action";
import { config } from "@/config/config";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getCategoriesActive();
  return [
    {
      url: `${config.APP_URL}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...pages.map((page) => ({
      url: `${config.APP_URL}/portfolio/${page.id}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
    {
      url: `${config.APP_URL}/apropos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${config.APP_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
