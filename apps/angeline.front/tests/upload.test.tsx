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
  const first = new File(["one"], "one.jpg", { type: "image/jpeg" });
  const second = new File(["two"], "two.jpg", { type: "image/jpeg" });
  fireEvent.change(input, { target: { files: [first, second, first] } });
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

  fireEvent.change(input, { target: { files: [first, second] } });
  expect(upload).toHaveBeenCalledTimes(2);
  let finishRetry!: (value: { success: boolean }) => void;
  upload.mockImplementationOnce(() => new Promise((resolve) => { finishRetry = resolve; }));
  const retry = screen.getByRole("button", { name: "Réessayer les fichiers en échec" });
  fireEvent.click(retry);
  fireEvent.click(retry);
  expect(input.disabled).toBe(true);
  expect(upload).toHaveBeenCalledTimes(3);
  expect(upload.mock.calls[2][0]).toBe(second);
  await act(async () => finishRetry({ success: true }));
  expect(screen.getByRole("status").textContent).toContain("2 / 2 images ajoutées");
  expect(screen.queryByRole("button", { name: /réessayer/i })).toBeNull();
});

it("does not retry a finalization whose result was lost", async () => {
  upload.mockResolvedValueOnce({ success: false, uncertain: true });
  render(<AddImage />);
  const input = screen.getByLabelText("Ajouter des images");
  const file = new File(["one"], "uncertain.jpg");
  fireEvent.change(input, { target: { files: [file] } });
  const list = await screen.findByRole("list", { name: "Fichiers à vérifier" });
  expect(list.textContent).toContain(file.name);
  expect(screen.queryByRole("button", { name: /réessayer/i })).toBeNull();
  fireEvent.change(input, { target: { files: [file] } });
  expect(upload).toHaveBeenCalledTimes(1);
});
