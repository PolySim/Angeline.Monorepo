"use client";

import { useBiography } from "@/queries/useInformation";
import { AdminError, AdminLoading, AdminPageHeader } from "../adminUi";
import AboutForm from "./aboutForm";

export default function About() {
  const { isPending, isError, refetch } = useBiography();
  return (
    <>
      <AdminPageHeader
        title="Biographie"
        description="Modifiez les textes de la page À propos, en français et en anglais. Chaque version s’enregistre séparément."
      />
      {isPending ? (
        <AdminLoading label="Chargement des biographies…" />
      ) : isError ? (
        <AdminError retry={() => void refetch()} />
      ) : (
        <AboutForm />
      )}
    </>
  );
}
