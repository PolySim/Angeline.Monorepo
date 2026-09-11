"use client";

import { useImages, useReorderImages } from "@/queries/useImage";
import { useMemo } from "react";
import { AdminEmpty, SaveStatus } from "../../adminUi";
import { useAdminOrder } from "../../useAdminOrder";
import ImageContainer from "./imageContainer";

export default function ReorderImage() {
  const { data: images } = useImages();
  const items = useMemo(
    () => [...(images || [])].sort((a, b) => a.ordered - b.ordered),
    [images],
  );
  const { mutateAsync } = useReorderImages();
  const { parent, values, move, pending, error, saved } = useAdminOrder(
    items,
    (values) => mutateAsync(values.map((image) => image.id)),
  );
  return (
    <div className="space-y-4">
      <SaveStatus pending={pending} error={error} saved={saved} />
      {!values.length && (
        <AdminEmpty title="Ce reportage n’a pas encore d’images">
          Ajoutez vos premières photographies avec le sélecteur ci-dessus. Vous
          pourrez ensuite modifier leurs descriptions et leur ordre.
        </AdminEmpty>
      )}
      <div
        ref={parent}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy={pending}
        aria-label="Images dans l’ordre d’affichage"
      >
        {values.map((image, index) => (
          <ImageContainer
            key={image.id}
            image={image}
            position={index}
            count={values.length}
            onMove={(direction) => move(index, direction)}
            ordering={pending}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          L’ordre précédent a été restauré. Réessayez le déplacement.
        </p>
      )}
    </div>
  );
}
