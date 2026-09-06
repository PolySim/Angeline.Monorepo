import { beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioPage, {
  generateMetadata,
} from "@/app/(home)/portfolio/[pageId]/page";
import sitemap from "@/app/sitemap";

const api = vi.hoisted(() => ({
  getCategoryById: vi.fn(),
  getCategoriesActive: vi.fn(),
  getImagesByCategoryId: vi.fn(),
}));
vi.mock("@/action/category.action", () => api);
vi.mock("@/action/image.action", () => api);
vi.mock("@/app/(home)/portfolio/[pageId]/mediaGrid", () => ({
  default: () => null,
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  permanentRedirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
vi.mock("@/config/config", () => ({
  config: {
    APP_URL: "https://angelinedesdevises.fr",
    IMAGE_URL: "https://images.example.test",
  },
}));

const category = {
  id: "123",
  name: "Kobané",
  article: "Texte éditorial",
  disabled: false,
  ordered: 4,
};
const props = (pageId: string) => ({
  params: Promise.resolve({ pageId }),
  searchParams: Promise.resolve({}),
});

beforeEach(() => {
  vi.clearAllMocks();
  api.getCategoryById.mockResolvedValue(category);
  api.getCategoriesActive.mockResolvedValue([category]);
  api.getImagesByCategoryId.mockResolvedValue([
    { id: "photo", name: "Photo", description: "Légende" },
  ]);
});

describe("Public portfolio routes", () => {
  it("permanently redirects legacy IDs and stale slugs to the current URL", async () => {
    await expect(PortfolioPage(props("123"))).rejects.toThrow(
      "REDIRECT:/portfolio/kobane--123",
    );
    await expect(generateMetadata(props("ancien-titre--123"))).rejects.toThrow(
      "REDIRECT:/portfolio/kobane--123",
    );
  });

  it("does not render or index missing and hidden reportages", async () => {
    api.getCategoryById.mockResolvedValue(null);
    await expect(PortfolioPage(props("missing"))).rejects.toThrow("NOT_FOUND");
    api.getCategoryById.mockResolvedValue({ ...category, disabled: true });
    await expect(PortfolioPage(props("kobane--123"))).rejects.toThrow(
      "NOT_FOUND",
    );
    await expect(generateMetadata(props("kobane--123"))).rejects.toThrow(
      "NOT_FOUND",
    );
    expect(api.getImagesByCategoryId).not.toHaveBeenCalled();
  });

  it("keeps API errors distinct from missing content", async () => {
    api.getCategoryById.mockRejectedValue(new Error("Service unavailable"));
    await expect(PortfolioPage(props("kobane--123"))).rejects.toThrow(
      "Service unavailable",
    );
  });

  it("uses the reportage's own text and image in social previews", async () => {
    const metadata = await generateMetadata(props("kobane--123"));
    expect(metadata.description).toBe("Texte éditorial");
    expect(metadata.twitter).toMatchObject({
      title: "Kobané",
      images: [
        { url: "https://images.example.test/image/photo", alt: "Légende" },
      ],
    });
  });

  it("includes photographs and excludes hidden reportages from the sitemap", async () => {
    api.getCategoriesActive.mockResolvedValue([
      category,
      { ...category, id: "hidden", disabled: true },
    ]);
    const entries = await sitemap();
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://angelinedesdevises.fr/portfolio/kobane--123",
        images: ["https://images.example.test/image/photo"],
      }),
    );
    expect(entries.some((entry) => entry.url.includes("hidden"))).toBe(false);
    expect(entries.some((entry) => entry.url.includes("/admin"))).toBe(false);
  });
});
