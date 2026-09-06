import type { MetadataRoute } from "next";
import { getCategoriesActive } from "@/action/category.action";
import { getImagesByCategoryId } from "@/action/image.action";
import { config } from "@/config/config";
import { portfolioPath } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getCategoriesActive();
  const reportages = await Promise.all(
    pages
      .filter((page) => !page.disabled)
      .map(async (page) => {
        const images = await getImagesByCategoryId(page.id);
        return {
          url: `${config.APP_URL}${portfolioPath(page)}`,
          images: images
            .slice(0, 1000)
            .map((image) => `${config.IMAGE_URL}/image/${image.id}`),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        };
      }),
  );
  return [
    {
      url: `${config.APP_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...reportages,
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
