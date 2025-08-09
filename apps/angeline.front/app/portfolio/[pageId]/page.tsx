import { getCategoryById } from "@/action/category.action";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import MediaGrid from "./mediaGrid";

type Props = {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
      }
    : {
        title: information.name || "Report",
      };
}

export default function PortfolioPage() {
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
