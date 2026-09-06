import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { writeFileSync } from "node:fs";
import Admin from "@/app/admin/page";
import AdminShell from "@/app/admin/adminShell";
import Listing from "@/app/admin/listing";
import CreateCategory from "@/app/admin/createCategory";
import HomepageForm from "@/app/admin/homepage/homepageForm";

const mocks = vi.hoisted(() => ({
  getCategories: vi.fn(),
  deleteCategory: vi.fn(),
  toggleCategoryVisibility: vi.fn(),
  createCategory: vi.fn(),
  updateHomepageSettings: vi.fn(),
}));

vi.mock("@/action/category.action", () => mocks);
vi.mock("@/action/homepageSettings.action", () => ({
  getHomepageSettings: vi.fn(),
  updateHomepageSettings: mocks.updateHomepageSettings,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => "/admin",
}));
vi.mock("@clerk/nextjs", () => ({
  SignOutButton: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const categories = [
  { id: "1", name: "Portraits", ordered: 1, disabled: false },
  { id: "2", name: "Kobané", ordered: 4, disabled: false },
  { id: "3", name: "Liban", ordered: 5, disabled: true },
];

function mount(children: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  );
}

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.getCategories.mockResolvedValue(categories);
});

describe("Administration", () => {
  it("marks the active section and exposes site preview and content navigation", async () => {
    mount(
      <AdminShell>
        <Admin />
      </AdminShell>,
    );
    await screen.findByRole("link", { name: "Kobané" });
    expect(
      screen
        .getByRole("link", { name: "Reportages" })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen.getByRole("link", { name: /Voir le site/ }).getAttribute("target"),
    ).toBe("_blank");
    if (process.env.ADMIN_PREVIEW_HTML) {
      writeFileSync(
        process.env.ADMIN_PREVIEW_HTML,
        document.documentElement.outerHTML,
      );
    }
  });

  it("filters reportages by name and visibility", async () => {
    mount(<Listing />);
    await screen.findByRole("link", { name: "Kobané" });
    fireEvent.change(screen.getByLabelText("Rechercher un reportage"), {
      target: { value: "kOb" },
    });
    expect(screen.queryByRole("link", { name: "Liban" })).toBeNull();
    expect(screen.getByRole("link", { name: "Kobané" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Visibilité"), {
      target: { value: "hidden" },
    });
    expect(screen.getByText("Aucun résultat")).toBeTruthy();
    fireEvent.click(screen.getByText("Effacer les filtres"));
    expect(screen.getByRole("link", { name: "Liban" })).toBeTruthy();
  });

  it("shows a retry action rather than an empty list on API failure", async () => {
    mocks.getCategories.mockRejectedValue(new Error("Offline"));
    mount(<Listing />);
    expect(await screen.findByRole("alert")).toBeTruthy();
    mocks.getCategories.mockResolvedValue(categories);
    fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(await screen.findByRole("link", { name: "Kobané" })).toBeTruthy();
  });

  it("does not hide a reportage when the visibility update fails", async () => {
    mocks.toggleCategoryVisibility.mockResolvedValue({ success: false });
    mount(<Listing />);
    await screen.findByRole("link", { name: "Kobané" });
    fireEvent.click(screen.getByLabelText("Masquer le reportage du site"));
    await waitFor(() =>
      expect(mocks.toggleCategoryVisibility).toHaveBeenCalledWith("2"),
    );
    expect(screen.getByLabelText("Masquer le reportage du site")).toBeTruthy();
  });

  it("keeps the confirmation open and the row intact on failed deletion", async () => {
    mocks.deleteCategory.mockResolvedValue({ success: false });
    mount(<Listing />);
    await screen.findByRole("link", { name: "Kobané" });
    fireEvent.click(screen.getByLabelText("Supprimer Kobané"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByText("Supprimer définitivement"));
    await waitFor(() => expect(mocks.deleteCategory).toHaveBeenCalledWith("2"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Kobané", hidden: true }),
    ).toBeTruthy();
  });

  it("validates creation before calling the API", async () => {
    mount(<CreateCategory />);
    fireEvent.click(screen.getByText("Créer un reportage"));
    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Créer" }));
    expect(
      await screen.findByText("Saisissez un nom pour le reportage."),
    ).toBeTruthy();
    expect(mocks.createCategory).not.toHaveBeenCalled();
  });

  it("keeps edits on failure and resets the baseline only after a successful save", async () => {
    const settings = {
      id: "homepage",
      visible: false,
      title: "Titre initial",
      content: "Texte initial",
    };
    mocks.updateHomepageSettings.mockResolvedValue({ success: false });
    mount(<HomepageForm settings={settings} />);
    fireEvent.change(screen.getByLabelText("Titre"), {
      target: { value: "Titre modifié" },
    });
    fireEvent.click(screen.getByText("Enregistrer"));
    await waitFor(() =>
      expect(mocks.updateHomepageSettings).toHaveBeenCalledTimes(1),
    );
    expect((screen.getByLabelText("Titre") as HTMLInputElement).value).toBe(
      "Titre modifié",
    );
    mocks.updateHomepageSettings.mockResolvedValue({
      success: true,
      data: { ...settings, title: "Titre modifié" },
    });
    await waitFor(() =>
      expect(
        (screen.getByText("Enregistrer") as HTMLButtonElement).disabled,
      ).toBe(false),
    );
    fireEvent.click(screen.getByText("Enregistrer"));
    await waitFor(() =>
      expect(
        (screen.getByText("Enregistrer") as HTMLButtonElement).disabled,
      ).toBe(true),
    );
    await waitFor(() =>
      expect(mocks.updateHomepageSettings).toHaveBeenCalledTimes(2),
    );
  });
});
