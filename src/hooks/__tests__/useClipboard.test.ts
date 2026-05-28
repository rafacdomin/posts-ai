import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "../useClipboard";

describe("useClipboard hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock navigator.clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should initialize with null copiedType", () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copiedType).toBeNull();
  });

  it("should set copiedType when copy is successful", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("test text", "caption");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
    expect(result.current.copiedType).toBe("caption");
  });

  it("should reset copiedType to null after 2 seconds", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("test text", "caption");
    });

    expect(result.current.copiedType).toBe("caption");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copiedType).toBeNull();
  });
});
