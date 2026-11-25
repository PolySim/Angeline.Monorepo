import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { Category, Image } from "@repo/types/entities";
import { afterEach, describe, expect, it, vi } from "vitest";
import MediaGrid from "@/app/(home)/portfolio/[pageId]/mediaGrid";

vi.mock("@/config/config", () => ({
  config: { IMAGE_URL: "http://127.0.0.1:9000" },
}));

const category: Category = {
  id: "reportage",
  name: "Reportage",
  article: "Texte éditorial du reportage",
  ordered: 4,
  disabled: false,
};
const images: Image[] = ["Première", "Deuxième"].map((name, ordered) => ({
  id: `photo-${ordered}`,
  name,
  description: name,
  category: category.id,
  ordered,
  path: "",
}));

const optimized = /\/_next\/image\?url=/;
const original = "http://127.0.0.1:9000/image/photo-0";
const variant = `${original}/variant/v1`;

afterEach(cleanup);

describe("Public gallery", () => {
  it("keeps a loaded direct variant without falling back", () => {
    const { container } = render(<MediaGrid category={category} images={images} />);
    const image = screen.getByRole("img", { name: "Première" });
    fireEvent.load(image);
    expect(image.getAttribute("src")).toBe(`${variant}/640`);
    expect(image.classList.contains("opacity-0")).toBe(false);
    expect(container.querySelector(`img[src="${original}/blur"]`)).toBeNull();
  });

  it("shows the grid placeholder until the single original fallback loads", async () => {
    const { container } = render(<MediaGrid category={category} images={images} />);
    const image = () => screen.getByRole("img", { name: "Première" });
    expect(image().getAttribute("src")).toBe(`${variant}/640`);
    expect(image().getAttribute("srcset")).toBe(
      [384, 640, 1080, 1600].map((width) => `${variant}/${width} ${width}w`).join(", "),
    );
    expect(image().getAttribute("sizes")).toContain("50vw");
    expect(image().getAttribute("loading")).toBe("lazy");
    expect(container.querySelector(`img[src="${original}/blur"]`)).not.toBeNull();

    fireEvent.error(image());
    expect(image().getAttribute("src")).toMatch(optimized);
    expect(image().getAttribute("srcset")).toMatch(optimized);
    fireEvent.error(image());
    expect(image().getAttribute("src")).toBe(original);
    expect(image().hasAttribute("srcset")).toBe(false);
    expect(image().getAttribute("loading")).toBe("lazy");
    fireEvent.load(image());

    await waitFor(() => {
      expect(container.querySelector(`img[src="${original}/blur"]`)).toBeNull();
      expect(image().classList.contains("opacity-0")).toBe(false);
    });
  });

  it("removes a failed blur and replaces a failed original without retrying", () => {
    const { container } = render(<MediaGrid category={category} images={images} />);
    const image = () => screen.getByRole("img", { name: "Première" });
    fireEvent.error(container.querySelector(`img[src="${original}/blur"]`)!);
    expect(container.querySelector(`img[src="${original}/blur"]`)).toBeNull();
    expect(image().getAttribute("src")).toBe(`${variant}/640`);
    fireEvent.error(image());
    expect(image().getAttribute("src")).toMatch(optimized);
    fireEvent.error(image());
    expect(image().getAttribute("src")).toBe(original);
    fireEvent.error(image());
    expect(screen.queryByText(/photographie indisponible/i)).toBeNull();
    expect(container.querySelector('span[aria-hidden="true"].bg-neutral-100')).not.toBeNull();
    expect(container.querySelector(`img[alt="Première"]`)).toBeNull();
  });

  it("opens at the selected slide, keeps controls in the modal, and restores focus", async () => {
    render(<MediaGrid category={category} images={images} />);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(320);
    const trigger = screen.getByRole("button", { name: "Agrandir : Deuxième" });
    expect(trigger.tagName).toBe("BUTTON");
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: category.name });
    const controls = within(dialog);
    const close = controls.getByRole("button", { name: "Fermer la galerie" });
    expect(document.activeElement).toBe(close);
    const photo = controls.getByRole("img", { name: "Première" });
    const track = photo.closest(".snap-x") as HTMLElement;
    expect(track.scrollLeft).toBe(640); // The article is inserted between the two photos.
    expect(photo.getAttribute("src")).toBe(`${variant}/640`);
    expect(photo.getAttribute("sizes")).toBe("100vw");
    expect(photo.getAttribute("loading")).toBe("lazy");
    fireEvent.error(photo);
    const optimizedPhoto = controls.getByRole("img", { name: "Première" });
    expect(optimizedPhoto.getAttribute("src")).toMatch(optimized);
    fireEvent.error(optimizedPhoto);
    const fallback = controls.getByRole("img", { name: "Première" });
    expect(fallback.getAttribute("src")).toBe(original);
    fireEvent.error(fallback);
    expect(controls.queryByRole("img", { name: "Première" })).toBeNull();
    expect(controls.queryByText(/photographie indisponible/i)).toBeNull();

    fireEvent.keyDown(close, { key: "ArrowLeft" });
    expect(track.scrollLeft).toBe(320);
    fireEvent.click(controls.getByRole("button", { name: "Diapositive suivante" }));
    expect(track.scrollLeft).toBe(640);
    fireEvent.keyDown(close, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(fireEvent.keyDown(trigger, { key: "ArrowLeft" })).toBe(true);
  });

  it("renders no gallery triggers for an empty report", () => {
    render(<MediaGrid category={category} images={[]} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
