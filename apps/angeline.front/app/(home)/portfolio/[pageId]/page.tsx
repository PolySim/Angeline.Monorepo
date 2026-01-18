import { getCategoriesActive, getCategoryById } from "@/action/category.action";
import { getImagesByCategoryId } from "@/action/image.action";
import { config } from "@/config/config";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import MediaGrid from "./mediaGrid";

type Props = {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const pages = await getCategoriesActive();
  return pages.map((page) => ({ pageId: page.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId } = await params;
  const information = await getCategoryById(pageId);
  const images = await getImagesByCategoryId(pageId);

  const title = information.name || "Report";
  const description =
    information.name && information.name.length > 300
      ? information.name.slice(0, 300)
      : information.name || "Reportage photo";

  const openGraphImages =
    images.length > 0
      ? images.slice(0, 4).map((img) => ({
          url: `${config.IMAGE_URL}/image/${img.id}`,
          alt: img.description || title,
        }))
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${config.APP_URL}/portfolio/${pageId}`,
      images: openGraphImages,
    },
    alternates: {
      canonical: `${config.APP_URL}/portfolio/${pageId}`,
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { pageId } = await params;
  const category = await getCategoryById(pageId);

  return (
    <main className="flex flex-col flex-1">
      <h1 className="sr-only">{category.name || "Portfolio"}</h1>
      <Suspense
        fallback={
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="animate-spin text-primary size-10" />
          </div>
        }
      >
        <MediaGrid />
      </Suspense>
    </main>
  );
}
