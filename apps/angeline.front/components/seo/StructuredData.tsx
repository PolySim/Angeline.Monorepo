/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/config/config";

interface StructuredDataProps {
  type: "person" | "portfolio" | "organization";
  data?: any;
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
    image: `${config.APP_URL}/about.jpeg`,
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

  const getPortfolioSchema = () => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: data?.name || "Portfolio Photographique",
    description: data?.description || "Série photographique documentaire",
    creator: {
      "@type": "Person",
      name: "Angeline Desdevises",
    },
    url: `${config.APP_URL}/portfolio/${data?.id}`,
    image:
      data?.images?.map((img: any) => ({
        "@type": "ImageObject",
        url: `${config.IMAGE_URL}/${img.url}`,
        description: img.alt || "Photographie documentaire",
      })) || [],
    genre: "Photographie documentaire",
    inLanguage: "fr",
  });

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
        __html: JSON.stringify(getSchema()),
      }}
    />
  );
}
