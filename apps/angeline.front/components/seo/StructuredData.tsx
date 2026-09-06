import type { Category, Image } from "@repo/types/entities";
import { config } from "@/config/config";
import { absoluteUrl, pageDescription, portfolioPath } from "@/lib/seo";

interface StructuredDataProps {
  type: "person" | "portfolio" | "website";
  description?: string;
  data?: Partial<Category> & { images?: Image[] };
}

export default function StructuredData({
  type,
  data,
  description,
}: StructuredDataProps) {
  const personId = absoluteUrl("/#person");
  const websiteId = absoluteUrl("/#website");
  const url = absoluteUrl(portfolioPath(data));
  const schema =
    type === "person"
      ? {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": personId,
          name: "Angeline Desdevises",
          jobTitle: "Photographe",
          description: pageDescription(description),
          url: config.APP_URL,
          image: absoluteUrl("/portrait.jpg"),
          sameAs: [
            "https://www.instagram.com/angeline_desdevises/",
            "https://www.linkedin.com/in/ang%C3%A9line-desdevises-942436199/?originalSubdomain=fr",
            "https://www.facebook.com/angeline.desdevises",
          ],
          email: "angeline.desdevises@gmail.com",
        }
      : type === "website"
        ? {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": websiteId,
            name: "Angeline Desdevises",
            url: config.APP_URL,
            inLanguage: "fr",
            creator: { "@id": personId },
          }
        : [
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "@id": `${url}#collection`,
              name: data?.name,
              description: pageDescription(data?.article),
              url,
              isPartOf: { "@id": websiteId },
              creator: { "@id": personId },
              inLanguage: "fr",
              mainEntity: {
                "@type": "ItemList",
                itemListElement: (data?.images || []).map((image, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "ImageObject",
                    contentUrl: `${config.IMAGE_URL}/image/${image.id}`,
                    name: image.description || image.name,
                    caption: image.description || undefined,
                    creator: { "@id": personId },
                    copyrightHolder: { "@id": personId },
                  },
                })),
              },
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
                  name: data?.name,
                  item: url,
                },
              ],
            },
          ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
