import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Category } from "@repo/types/entities";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import MenuDesktop from "@/components/header/menuDesktop";
import MenuMobile from "@/components/header/menuMobile";

vi.mock("@/action/category.action", () => ({ getCategoriesActive: vi.fn() }));
vi.mock("@/hook/useAppParams", () => ({ useAppParams: () => ({ pageId: "" }) }));

const categories: Category[] = [
  { id: "reportage-id", name: "Le Rojava", ordered: 4, disabled: false },
];

afterEach(cleanup);

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

  it("discloses mobile links and returns focus to the burger on Escape", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MenuMobile categories={categories} />
      </QueryClientProvider>,
    );
    const burger = screen.getByRole("button", { name: "Ouvrir le menu" });
    expect(burger.tagName).toBe("BUTTON");
    expect(burger.getAttribute("aria-expanded")).toBe("false");
    const panel = document.getElementById(burger.getAttribute("aria-controls")!);
    expect(panel?.hasAttribute("inert")).toBe(true);

    burger.focus();
    fireEvent.click(burger);
    expect(document.activeElement).toBe(burger);
    expect(screen.getByRole("button", { name: "Fermer le menu" })).toBe(burger);
    expect(burger.getAttribute("aria-expanded")).toBe("true");
    const nav = screen.getByRole("navigation", { name: "Navigation principale" });
    expect(nav).toBe(panel);
    expect(nav.hasAttribute("inert")).toBe(false);
    const reportages = within(nav).getByRole("button", { name: "Reportages" });
    fireEvent.click(reportages);
    const reportage = within(nav).getByRole("link", { name: "Le Rojava" });
    expect(reportage.getAttribute("href")).toBe("/portfolio/le-rojava--reportage-id");
    reportage.focus();
    // Radix's force-mounted desktop navigation may have already handled it.
    const escape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    escape.preventDefault();
    fireEvent(reportage, escape);

    expect(document.activeElement).toBe(burger);
    expect(burger.getAttribute("aria-expanded")).toBe("false");
    expect(nav.hasAttribute("inert")).toBe(true);
  });
});
