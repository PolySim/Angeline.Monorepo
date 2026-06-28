import type { Category, Image } from "@repo/types/entities";
import { config } from "@/config/config";
import { absoluteUrl, pageDescription, portfolioPath } from "@/lib/seo";

interface StructuredDataProps {
  type: "person" | "portfolio" | "organization";
  data?: Partial<Category> & {
    images?: Image[];
  };
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getPersonSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Angeline Desdevises",
    jobTitle: "Photographe de Guerre et Conflits",
    description:
      "Photographe documentaire spécialisée dans les conflits du Moyen-Orient, particulièrement en Syrie et au Liban. Photojournaliste basée à Rennes.",
    url: config.APP_URL,
    image: absoluteUrl("/portrait.jpg"),
    sameAs: [
      "https://www.instagram.com/angeline_desdevises/",
      "https://www.linkedin.com/in/ang%C3%A9line-desdevises-942436199/?originalSubdomain=fr",
      "https://www.facebook.com/angeline.desdevises",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rennes",
      addressRegion: "Bretagne",
      addressCountry: "FR",
    },
    email: "angeline.desdevises@gmail.com",
    knowsAbout: [
      "Photographie documentaire",
      "Photojournalisme",
      "Photographie de guerre",
      "Conflits du Moyen-Orient",
      "Reportage en Syrie",
      "Documentation des conflits au Liban",
      "Photographie d'actualité",
      "War photography",
      "Conflict photography",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Photographe de Guerre et Documentaire",
      occupationLocation: {
        "@type": "City",
        name: "Rennes",
      },
      workLocation: [
        {
          "@type": "Country",
          name: "Syrie",
        },
        {
          "@type": "Country",
          name: "Liban",
        },
        {
          "@type": "Place",
          name: "Moyen-Orient",
        },
      ],
    },
  });

  const getPortfolioSchema = () => {
    const url = absoluteUrl(portfolioPath(data?.id ? data : undefined));

    return [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: data?.name || "Portfolio Photographique",
        description: pageDescription(
          data?.article,
          "Série photographique documentaire par Angeline Desdevises",
        ),
        creator: {
          "@type": "Person",
          name: "Angeline Desdevises",
          url: config.APP_URL,
        },
        mainEntityOfPage: url,
        url,
        image:
          data?.images?.map((img) => ({
            "@type": "ImageObject",
            url: `${config.IMAGE_URL}/image/${img.id}`,
            name: img.name,
            caption: img.description || img.name,
            description:
              img.description ||
              "Photographie documentaire Angeline Desdevises",
          })) || [],
        genre: "Photographie documentaire",
        inLanguage: "fr",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: config.APP_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: data?.name || "Portfolio",
            item: url,
          },
        ],
      },
    ];
  };

  const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Angeline Desdevises - War Photography",
    description:
      "Photojournalisme et documentation des conflits au Moyen-Orient par Angeline Desdevises, spécialisée en Syrie et au Liban.",
    url: config.APP_URL,
    logo: `${config.APP_URL}/android-chrome-384x384.png`,
    image: `${config.APP_URL}/home.jpg`,
    founder: {
      "@type": "Person",
      name: "Angeline Desdevises",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rennes",
      addressRegion: "Bretagne",
      addressCountry: "FR",
    },
    email: "angeline.desdevises@gmail.com",
    serviceType: [
      "Photographie documentaire",
      "Photojournalisme",
      "Photographie de guerre",
      "Reportage de conflit",
      "Documentation des crises humanitaires",
      "War photography",
      "Conflict photography",
    ],
    areaServed: [
      {
        "@type": "Country",
        name: "France",
      },
      {
        "@type": "Country",
        name: "Syrie",
      },
      {
        "@type": "Country",
        name: "Liban",
      },
      {
        "@type": "Place",
        name: "Moyen-Orient",
      },
    ],
  });

  const getSchema = () => {
    switch (type) {
      case "person":
        return getPersonSchema();
      case "portfolio":
        return getPortfolioSchema();
      case "organization":
        return getOrganizationSchema();
      default:
        return getPersonSchema();
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema()).replace(/</g, "\\u003c"),
      }}
    />
  );
}
