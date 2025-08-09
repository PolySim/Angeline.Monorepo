"use client";

import { Button } from "@/components/ui/button";
import { useBiography } from "@/queries/useInformation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import AboutForm from "./aboutForm";

export default function About() {
  const { isPending } = useBiography();

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
        {isPending ? (
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
