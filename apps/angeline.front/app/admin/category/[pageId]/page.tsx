import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import AddImage from "./addImage";
import DownloadCategoryButton from "./downloadCategoryButton";
import UpdateReportContainer from "./updateReportContainer";

export default function CategoryPage() {
  return (
    <>
      <div className="w-11/12 max-w-6xl mx-auto mb-4 flex gap-4">
        <Button className="w-fit" asChild>
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </Button>
        <AddImage />
        <DownloadCategoryButton />
      </div>
      <div className="flex flex-col flex-1 w-screen max-w-6xl mx-auto p-4 rounded-lg shadow-sm border border-gray-200">
        <Suspense
          fallback={
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          }
        >
          <UpdateReportContainer />
        </Suspense>
      </div>
    </>
  );
}
