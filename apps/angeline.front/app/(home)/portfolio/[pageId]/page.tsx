import { getCategoriesActive, getCategoryById } from "@/action/category.action";
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
  return information.name
    ? {
        title: information.name || "Report",
        description:
          information.name.length > 300
            ? information.name.slice(0, 300)
            : information.name,
        alternates: {
          canonical: `${config.APP_URL}/portfolio/${pageId}`,
        },
      }
    : {
        title: information.name || "Report",
        alternates: {
          canonical: `${config.APP_URL}/portfolio/${pageId}`,
        },
      };
}

export default async function PortfolioPage() {
  return (
    <main className="flex flex-col flex-1">
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
