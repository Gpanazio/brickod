import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCallSheet, DEFAULT_CALL_SHEET } from "./use-call-sheet";
import { safeLocalStorage } from "@/lib/safe-local-storage";

vi.mock("@/lib/safe-local-storage", () => {
  let store: Record<string, string> = {};
  return {
    safeLocalStorage: {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    },
  };
});

const STORAGE_KEY = "brick-call-sheet";

const storedSheet = {
  id: "stored-id",
  ...DEFAULT_CALL_SHEET,
  productionTitle: "Stored Title",
  shootingDate: "2024-01-01",
};

describe("useCallSheet initial load", () => {
  beforeEach(() => {
    safeLocalStorage.clear();
  });

  it("loads from localStorage without unsaved changes", async () => {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(storedSheet));
    const { result } = renderHook(() => useCallSheet());

    await waitFor(() =>
      expect(result.current.callSheet.productionTitle).toBe("Stored Title")
    );
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it("marks unsaved changes after updates", async () => {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(storedSheet));
    const { result } = renderHook(() => useCallSheet());

    await waitFor(() =>
      expect(result.current.callSheet.productionTitle).toBe("Stored Title")
    );

    act(() => {
      result.current.updateField("productionTitle", "New Title");
    });

    expect(result.current.hasUnsavedChanges).toBe(true);
  });
});
