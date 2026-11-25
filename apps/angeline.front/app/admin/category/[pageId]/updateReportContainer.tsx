"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { portfolioPath } from "@/lib/seo";
import { useCategoryById } from "@/queries/useCategory";
import { useImages } from "@/queries/useImage";
import { AdminError, AdminLoading, AdminPageHeader } from "../../adminUi";
import ReorderImage from "./reorderImage";
import UpdateCategoryInformation from "./updateCategoryInformation";
import AddImage from "./addImage";
import DownloadCategoryButton from "./downloadCategoryButton";

export default function UpdateReportContainer() {
  const category = useCategoryById();
  const images = useImages();
  return (
    <>
      <AdminPageHeader
        title={category.data?.name || "Modifier le reportage"}
        description="Complétez les informations du reportage et organisez ses images."
        action={
          category.data && !category.isError ? (
            <Button asChild variant="outline">
              <Link
                href={category.data.disabled
                  ? `/admin/category/${encodeURIComponent(category.data.id)}/preview`
                  : portfolioPath(category.data)}
                prefetch={false}
              >
                {category.data.disabled ? "Aperçu privé" : "Voir le reportage publié"}
              </Link>
            </Button>
          ) : undefined
        }
        back
      />
      {category.isPending ? (
        <AdminLoading label="Chargement du reportage…" />
      ) : category.isError ? (
        <AdminError
          retry={() => void category.refetch()}
          message="Impossible de charger ce reportage."
        />
      ) : (
        <div className="space-y-8">
          <section className="rounded-xl border bg-white p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold">
              Informations du reportage
            </h2>
            <UpdateCategoryInformation key={category.data.id} />
          </section>
          <section aria-labelledby="images-heading" className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="images-heading" className="text-lg font-semibold">
                  Images{images.data ? ` (${images.data.length})` : ""}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Déplacez les images avec les poignées ou les flèches. L’ordre
                  est enregistré automatiquement.
                </p>
              </div>
              {!!images.data?.length && <DownloadCategoryButton />}
            </div>
            <AddImage key={category.data.id} />
            {images.isPending ? (
              <AdminLoading label="Chargement des images…" />
            ) : images.isError ? (
              <AdminError
                retry={() => void images.refetch()}
                message="Impossible de charger les images."
              />
            ) : (
              <ReorderImage />
            )}
          </section>
        </div>
      )}
    </>
  );
}
