"use client";

import { useHomepageSettings } from "@/queries/useHomepageSettings";
import { AdminError, AdminLoading, AdminPageHeader } from "../adminUi";
import HomepageForm from "./homepageForm";

export default function HomepageAdmin() {
  const { data: settings, isPending, isError, refetch } = useHomepageSettings();
  return <><AdminPageHeader title="Page d’accueil" description="Choisissez les informations visibles sous la photographie principale." />
    {isError ? <AdminError message="Impossible de charger les réglages. Vos contenus n’ont pas été modifiés." retry={() => void refetch()} /> : isPending || !settings ? <AdminLoading label="Chargement des réglages de l’accueil…" /> : <section className="rounded-xl border bg-white p-5 sm:p-6"><HomepageForm settings={settings} /></section>}
  </>;
}
