"use client";

import { useCategoryById } from "@/queries/useCategory";
import { useImages } from "@/queries/useImage";
import { Loader2 } from "lucide-react";
import ReorderImage from "./reorderImage";
import UpdateCategoryInformation from "./updateCategoryInformation";

export default function UpdateReportContainer() {
  const { isPending: isImagesPending } = useImages();
  const { isPending: isCategoryPending } = useCategoryById();

  return (
    <>
      {isImagesPending || isCategoryPending ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <UpdateCategoryInformation />
          <ReorderImage />
        </>
      )}
    </>
  );
}
