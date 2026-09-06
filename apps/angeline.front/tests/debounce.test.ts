import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import useDebounce from "@/hook/useDebonce";

afterEach(() => vi.useRealTimers());

it("saves only the last reorder and cancels pending work on unmount", () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  const { result, unmount } = renderHook(() => useDebounce(callback, 500));
  act(() => {
    result.current("first");
    result.current("last");
    vi.advanceTimersByTime(500);
  });
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith("last");
  act(() => result.current("after navigation"));
  unmount();
  act(() => vi.advanceTimersByTime(500));
  expect(callback).toHaveBeenCalledTimes(1);
});
