import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import UpdateReportContainer from "@/app/admin/category/[pageId]/updateReportContainer";
import { portfolioPath } from "@/lib/seo";

const { categoryQuery } = vi.hoisted(() => ({ categoryQuery: vi.fn() }));
vi.mock("@/queries/useCategory", () => ({ useCategoryById: categoryQuery }));
vi.mock("@/queries/useImage", () => ({ useImages: () => ({ data: [] }) }));
vi.mock("@/app/admin/category/[pageId]/addImage", () => ({ default: () => null }));
vi.mock("@/app/admin/category/[pageId]/downloadCategoryButton", () => ({ default: () => null }));
vi.mock("@/app/admin/category/[pageId]/reorderImage", () => ({ default: () => null }));
vi.mock("@/app/admin/category/[pageId]/updateCategoryInformation", () => ({ default: () => null }));

afterEach(cleanup);

const report = { id: "test-id", name: "Un reportage", ordered: 0, disabled: false };
const linkName = "Voir le reportage publié";

it("only links to the canonical public route for a published report", () => {
  categoryQuery.mockReturnValue({ isPending: true });
  const { rerender } = render(<UpdateReportContainer />);
  expect(screen.queryByRole("link", { name: linkName })).toBeNull();

  categoryQuery.mockReturnValue({ data: { ...report, disabled: true } });
  rerender(<UpdateReportContainer />);
  expect(screen.queryByRole("link", { name: linkName })).toBeNull();

  categoryQuery.mockReturnValue({ data: report });
  rerender(<UpdateReportContainer />);
  expect(screen.getByRole("link", { name: linkName }).getAttribute("href")).toBe(portfolioPath(report));

  categoryQuery.mockReturnValue({ isError: true, data: report });
  rerender(<UpdateReportContainer />);
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(screen.queryByRole("link", { name: linkName })).toBeNull();
});
