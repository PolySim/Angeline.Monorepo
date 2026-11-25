import { beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Preview, { dynamic, metadata } from "@/app/admin/category/[pageId]/preview/page";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), category: vi.fn(), images: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("@/action/category.action", () => ({ getCategoryById: mocks.category }));
vi.mock("@/action/image.action", () => ({ getImagesByCategoryId: mocks.images }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("not found"); } }));
vi.mock("@/app/(home)/portfolio/[pageId]/mediaGrid", () => ({ default: () => <div>Galerie</div> }));

const props = { params: Promise.resolve({ pageId: "draft" }) };
beforeEach(() => vi.resetAllMocks());

it("requires a session before loading any draft data", async () => {
  mocks.auth.mockResolvedValue({ userId: null });
  await expect(Preview(props)).rejects.toThrow("not found");
  expect(mocks.category).not.toHaveBeenCalled();
  expect(mocks.images).not.toHaveBeenCalled();
});

it("renders an unpublished report with the shared gallery without indexing or static generation", async () => {
  mocks.auth.mockResolvedValue({ userId: "editor" });
  mocks.category.mockResolvedValue({ id: "draft", name: "Brouillon", disabled: true });
  mocks.images.mockResolvedValue([]);
  const html = renderToStaticMarkup(await Preview(props));
  expect(html).toContain("Brouillon");
  expect(html).toContain("Galerie");
  expect(mocks.images).toHaveBeenCalledWith("draft", true);
  expect(dynamic).toBe("force-dynamic");
  expect(metadata.robots).toEqual({ index: false, follow: false });
});
