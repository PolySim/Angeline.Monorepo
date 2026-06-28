import type { Metadata } from "next";
import { getCategoriesActive, getCategoryById } from "@/action/category.action";
import { getImagesByCategoryId } from "@/action/image.action";
import StructuredData from "@/components/seo/StructuredData";
import { config } from "@/config/config";
import {
  absoluteUrl,
  getPortfolioIdFromParam,
  pageDescription,
  portfolioPath,
} from "@/lib/seo";
import MediaGrid from "./mediaGrid";

type Props = {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const pages = await getCategoriesActive();
  return pages.map((page) => ({
    pageId: portfolioPath(page).split("/").pop() || page.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId: pageParam } = await params;
  const pageId = getPortfolioIdFromParam(pageParam);
  const information = await getCategoryById(pageId);
  const images = await getImagesByCategoryId(pageId);

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
          width: 1200,
          height: 800,
        }))
      : [
          {
            url: absoluteUrl("/home.jpg"),
            alt: "Portfolio Angeline Desdevises",
            width: 1920,
            height: 1080,
          },
        ];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(portfolioPath(information)),
      type: "article",
      images: openGraphImages,
    },
    alternates: {
      canonical: absoluteUrl(portfolioPath(information)),
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { pageId: pageParam } = await params;
  const pageId = getPortfolioIdFromParam(pageParam);
  const category = await getCategoryById(pageId);
  const images = await getImagesByCategoryId(pageId);

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
