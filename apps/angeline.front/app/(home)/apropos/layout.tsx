import { getBiography } from "@/action/information.action";
import { Lang } from "@repo/types/entities";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);

  const description =
    biographyFr?.content && biographyFr.content.length > 160
      ? biographyFr.content.slice(0, 160) + "..."
      : "Découvrez le parcours d'Angeline Desdevises, photographe de guerre spécialisée dans les conflits du Moyen-Orient, particulièrement en Syrie et au Liban.";

  return {
    title: "À propos - Biographie",
    description,
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
