"use client";

import { useCategoryById } from "@/queries/useCategory";
import { useImages } from "@/queries/useImage";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReorderImage from "./reorderImage";
import UpdateCategoryInformation from "./updateCategoryInformation";

export default function UpdateReportContainer() {
  const { isPending: isImagesPending } = useImages();
  const {
    data: category,
    isPending: isCategoryPending,
    isError,
    refetch,
  } = useCategoryById();

  if (isError)
    return (
      <div role="alert" className="space-y-3">
        <p>Impossible de charger ce reportage.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  if (!isCategoryPending && !category)
    return (
      <p>
        Ce reportage n’existe plus. Retrouvez les autres dans l’onglet
        Reportages.
      </p>
    );

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
