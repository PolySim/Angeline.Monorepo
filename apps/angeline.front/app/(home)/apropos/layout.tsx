import { Lang } from "@repo/types/entities";
import type { Metadata } from "next";
import { getBiography } from "@/action/information.action";
import { absoluteUrl, createPageMetadata, pageDescription } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);

  const description = pageDescription(
    biographyFr?.content,
    "Découvrez le parcours d'Angeline Desdevises, photographe de guerre spécialisée dans les conflits du Moyen-Orient, particulièrement en Syrie et au Liban.",
  );

  return createPageMetadata({
    title: "À propos - Biographie",
    description,
    path: "/apropos",
    type: "profile",
    images: [
      {
        url: absoluteUrl("/portrait.jpg"),
        alt: "Portrait d'Angeline Desdevises",
      },
    ],
  });
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
