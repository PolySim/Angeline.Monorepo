"use client";

import { Button } from "@/components/ui/button";
import { useBiography } from "@/queries/useInformation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import AboutForm from "./aboutForm";

export default function About() {
  const { isPending, isError, refetch } = useBiography();

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
      <div className="flex flex-col flex-1 w-11/12 max-w-6xl mx-auto p-6 rounded-lg bg-white border border-gray-200">
        <h1 className="text-2xl font-bold mb-2">Biographie</h1>
        <p className="text-sm text-gray-600 mb-6">
          Chaque langue s’enregistre séparément sur la page À propos.
        </p>
        {isError ? (
          <div role="alert">
            <p>Impossible de charger la biographie.</p>
            <Button variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </div>
        ) : isPending ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        ) : (
          <AboutForm />
        )}
      </div>
    </>
  );
}
