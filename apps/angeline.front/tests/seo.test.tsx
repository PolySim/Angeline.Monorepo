import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import StructuredData from "@/components/seo/StructuredData";
import {
  createPageMetadata,
  getPortfolioIdFromParam,
  pageDescription,
  portfolioPath,
  truncateText,
} from "@/lib/seo";

describe("SEO", () => {
  it("keeps a stable ID in accented portfolio slugs", () => {
    const path = portfolioPath({
      id: "123-456",
      name: "Kobané, dix ans après",
    });
    expect(path).toBe("/portfolio/kobane-dix-ans-apres--123-456");
    expect(getPortfolioIdFromParam(path.split("/").pop()!)).toBe("123-456");
    expect(getPortfolioIdFromParam("123-456")).toBe("123-456");
  });

  it("bounds descriptions including the ellipsis and fallbacks", () => {
    expect(truncateText("Bonjour\n  le monde")).toBe("Bonjour le monde");
    expect(truncateText("a".repeat(200))).toHaveLength(160);
    expect(pageDescription("", "mot ".repeat(100)).length).toBeLessThanOrEqual(
      160,
    );
    expect(pageDescription("   ")).not.toBe("");
  });

  it("uses the page content for canonical, Open Graph and Twitter", () => {
    const images = [{ url: "https://example.test/photo.jpg", alt: "Légende" }];
    const metadata = createPageMetadata({
      title: "Reportage",
      description: "Texte",
      path: "/portfolio/test--123",
      images,
    });
    expect(metadata.alternates?.canonical).toBe(
      "https://angelinedesdevises.fr/portfolio/test--123",
    );
    expect(metadata.openGraph).toMatchObject({
      title: "Reportage",
      description: "Texte",
      images,
    });
    expect(metadata.twitter).toMatchObject({
      title: "Reportage",
      description: "Texte",
      images,
    });
  });

  it("uses the edited biography without invented location or business claims", () => {
    const html = renderToStaticMarkup(
      <StructuredData type="person" description="Biographie validée" />,
    );
    expect(html).toContain("Biographie validée");
    expect(html).not.toContain("Rennes");
    expect(html).not.toContain("ProfessionalService");
  });

  it("escapes script tags from editorial content", () => {
    const html = renderToStaticMarkup(
      <StructuredData
        type="portfolio"
        data={{ id: "123", name: "</script><script>alert(1)</script>" }}
      />,
    );
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).toContain("\\u003c/script>");
  });
});
