import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/action/category.action";
import { getImagesByCategoryId } from "@/action/image.action";
import MediaGrid from "@/app/(home)/portfolio/[pageId]/mediaGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Aperçu privé du reportage",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default async function ReportagePreview({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) notFound();

  const { pageId } = await params;
  const category = await getCategoryById(pageId);
  if (!category) notFound();
  const images = await getImagesByCategoryId(category.id, true);

  return (
    <>
      <header className="space-y-2">
        <Link
          href={`/admin/category/${encodeURIComponent(category.id)}`}
          className="text-sm underline underline-offset-4"
        >
          Retour à la modification
        </Link>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        <p className="text-sm text-muted-foreground">
          Aperçu privé · La visibilité du reportage n’est pas modifiée.
        </p>
      </header>
      <section aria-label="Aperçu du reportage" className="bg-white [&_.grid]:w-full">
        <MediaGrid category={category} images={images} />
      </section>
    </>
  );
}
