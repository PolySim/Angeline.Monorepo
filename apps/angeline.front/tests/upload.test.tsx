import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import AddImage from "@/app/admin/category/[pageId]/addImage";

const upload = vi.hoisted(() => vi.fn());
vi.mock("@/queries/useImage", () => ({
  useCreateImageByChunks: () => ({ mutateAsync: upload }),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("uploads sequentially and keeps the picker disabled until the batch finishes", async () => {
  let finishFirst!: (value: { success: boolean }) => void;
  upload.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishFirst = resolve;
      }),
  );
  upload.mockResolvedValueOnce({ success: false });
  render(<AddImage />);
  const input = screen.getByLabelText("Ajouter des images") as HTMLInputElement;
  fireEvent.change(input, {
    target: {
      files: [
        new File(["one"], "one.jpg", { type: "image/jpeg" }),
        new File(["two"], "two.jpg", { type: "image/jpeg" }),
      ],
    },
  });
  expect(input.disabled).toBe(true);
  expect(upload).toHaveBeenCalledTimes(1);
  await act(async () => finishFirst({ success: true }));
  await waitFor(() => expect(input.disabled).toBe(false));
  expect(upload).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("status").textContent).toContain(
    "1 / 2 images ajoutées",
  );
  expect(screen.getByRole("status").textContent).toContain("Réessayez");
  expect(
    screen.getByRole("list", { name: "Fichiers à réessayer" }).textContent,
  ).toContain("two.jpg");
});
