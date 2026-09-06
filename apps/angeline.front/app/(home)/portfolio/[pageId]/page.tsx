import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { getCategoriesActive, getCategoryById } from "@/action/category.action";
import { getImagesByCategoryId } from "@/action/image.action";
import StructuredData from "@/components/seo/StructuredData";
import { config } from "@/config/config";
import {
  absoluteUrl,
  createPageMetadata,
  getPortfolioIdFromParam,
  pageDescription,
  portfolioPath,
} from "@/lib/seo";
import MediaGrid from "./mediaGrid";

type Props = {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getPublicCategory = cache(async (pageParam: string) => {
  const category = await getCategoryById(getPortfolioIdFromParam(pageParam));
  if (!category || category.disabled) notFound();
  if (`/portfolio/${pageParam}` !== portfolioPath(category)) {
    permanentRedirect(portfolioPath(category));
  }
  return category;
});

export async function generateStaticParams() {
  const pages = await getCategoriesActive();
  return pages.map((page) => ({
    pageId: portfolioPath(page).split("/").pop() || page.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId: pageParam } = await params;
  const information = await getPublicCategory(pageParam);
  const images = await getImagesByCategoryId(information.id);

  const title = information.name || "Report";
  const description = pageDescription(
    information.article,
    `${title} - reportage photographique documentaire par Angeline Desdevises.`,
  );

  const openGraphImages =
    images.length > 0
      ? images.slice(0, 4).map((img) => ({
          url: `${config.IMAGE_URL}/image/${img.id}`,
          alt: img.description || title,
        }))
      : [
          {
            url: absoluteUrl("/home.jpg"),
            alt: "Portfolio Angeline Desdevises",
          },
        ];

  return createPageMetadata({
    title,
    description,
    path: portfolioPath(information),
    type: "article",
    images: openGraphImages,
  });
}

export default async function PortfolioPage({ params }: Props) {
  const { pageId: pageParam } = await params;
  const category = await getPublicCategory(pageParam);
  const images = await getImagesByCategoryId(category.id);

  return (
    <main className="flex flex-col flex-1">
      <StructuredData
        type="portfolio"
        data={{
          ...category,
          images,
        }}
      />
      <h1 className="sr-only">{category.name || "Portfolio"}</h1>
      <MediaGrid category={category} images={images} />
    </main>
  );
}
