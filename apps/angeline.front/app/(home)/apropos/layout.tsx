import { getBiography } from "@/action/information.action";
import { config } from "@/config/config";
import { Lang } from "@repo/types/entities";

export async function generateMetadata() {
  const biography = await getBiography();
  const biographyFr = biography?.find((info) => info.lang === Lang.FR);

  const description =
    biographyFr?.content && biographyFr.content.length > 160
      ? biographyFr.content.slice(0, 160) + "..."
      : "Découvrez le parcours d'Angeline Desdevises, photographe de guerre spécialisée dans les conflits du Moyen-Orient, particulièrement en Syrie et au Liban.";

  return {
    title: "À propos - Biographie",
    description,
    alternates: {
      canonical: `${config.APP_URL}/apropos`,
    },
    openGraph: {
      title:
        "À propos d'Angeline Desdevises - Photographe Conflits Moyen-Orient",
      description,
      url: `${config.APP_URL}/apropos`,
      type: "profile",
      images: [
        {
          url: `${config.APP_URL}/about.jpeg`,
          width: 568,
          height: 852,
          alt: "Portrait d'Angeline Desdevises",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "À propos d'Angeline Desdevises - Photographe Conflits Moyen-Orient",
      description,
      images: [`${config.APP_URL}/about.jpeg`],
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
