"use client";

import { Button } from "@/components/ui/button";
import { useHomepageSettings } from "@/queries/useHomepageSettings";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import HomepageForm from "./homepageForm";

export default function HomepageAdmin() {
  const { data: settings, isPending } = useHomepageSettings();

  return (
    <>
      <div className="w-11/12 max-w-6xl mx-auto mb-4">
        <Button className="w-fit" asChild>
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </Button>
      </div>
      <div className="flex flex-col flex-1 w-11/12 max-w-6xl mx-auto p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Page d’accueil</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Choisissez les informations visibles sous la photographie
            principale.
          </p>
        </div>
        {isPending || !settings ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2
              aria-label="Chargement"
              className="size-8 animate-spin text-primary"
            />
          </div>
        ) : (
          <HomepageForm settings={settings} />
        )}
      </div>
    </>
  );
}
