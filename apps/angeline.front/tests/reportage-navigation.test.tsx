import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Category } from "@repo/types/entities";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import MenuDesktop from "@/components/header/menuDesktop";
import MenuMobile from "@/components/header/menuMobile";

vi.mock("@/action/category.action", () => ({ getCategoriesActive: vi.fn() }));
vi.mock("@/hook/useAppParams", () => ({ useAppParams: () => ({ pageId: "" }) }));

const categories: Category[] = [
  { id: "reportage-id", name: "Le Rojava", ordered: 4, disabled: false },
];

describe("Reportage navigation in the initial HTML", () => {
  it.each([
    ["desktop", MenuDesktop, "navigation-menu-content"],
    ["mobile", MenuMobile, "accordion-content"],
  ] as const)("includes the real link in the closed %s menu", (_, Menu, slot) => {
    const html = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>
        <Menu categories={categories} />
      </QueryClientProvider>,
    );
    const root = document.createElement("div");
    root.innerHTML = html;
    const panel = root.querySelector(`[data-slot="${slot}"]`);

    expect(panel?.getAttribute("data-state")).toBe("closed");
    expect(panel?.hasAttribute("inert")).toBe(true);
    expect(panel?.closest("button")).toBeNull();
    expect(panel?.querySelector('a[href="/portfolio/le-rojava--reportage-id"]')?.textContent).toBe("Le Rojava");
  });
});
