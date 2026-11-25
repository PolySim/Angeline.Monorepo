import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { completeChunkUpload } from "@/action/image.action";

const { fetchMock, revalidateTag } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ getToken: async () => "test-token" }),
}));
vi.mock("next/cache", () => ({ revalidateTag }));
vi.mock("@/config/config", () => ({ config: { API_URL: "http://127.0.0.1:9000" } }));

beforeEach(() => {
  fetchMock.mockReset();
  revalidateTag.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const input = { fileHash: "test-hash", categoryId: "test-category" };

it("preserves a confirmed upload even when cache revalidation fails", async () => {
  const data = { id: "test-image" };
  fetchMock.mockResolvedValue(Response.json(data, { status: 201 }));
  revalidateTag.mockImplementation(() => { throw new Error("cache unavailable"); });
  expect(await completeChunkUpload(input)).toEqual({ success: true, data });
  expect(fetchMock).toHaveBeenCalledOnce();
  expect(revalidateTag).toHaveBeenCalledWith("images-test-category");
});

it("distinguishes a rejected import from an unknown finalization outcome", async () => {
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 400 }));
  fetchMock.mockRejectedValueOnce(new Error("connection lost"));
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 502 }));
  expect(await completeChunkUpload(input)).toEqual({ success: false, uncertain: false });
  expect(await completeChunkUpload(input)).toEqual({ success: false, uncertain: true });
  expect(await completeChunkUpload(input)).toEqual({ success: false, uncertain: true });
  expect(revalidateTag).not.toHaveBeenCalled();
});
