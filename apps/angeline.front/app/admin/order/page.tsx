"use client";

import { useCategories } from "@/queries/useCategory";
import { AdminError, AdminLoading, AdminPageHeader } from "../adminUi";
import OrderForm from "./orderForm";

export default function Order() {
  const { isPending, isError, refetch } = useCategories();
  return (
    <>
      <AdminPageHeader
        title="Ordre d’affichage"
        description="Déplacez les reportages à l’aide des poignées ou des flèches, puis enregistrez le nouvel ordre d’affichage."
      />
      {isPending ? (
        <AdminLoading label="Chargement de l’ordre des reportages…" />
      ) : isError ? (
        <AdminError retry={() => void refetch()} />
      ) : (
        <OrderForm />
      )}
    </>
  );
}
