import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCallSheet } from "./use-call-sheet";

const STORAGE_KEY = "brick-call-sheet";

const storedSheet = {
  id: "stored-id",
  productionTitle: "Stored Title",
  shootingDate: "2024-01-01",
  producer: "",
  director: "",
  client: "",
  scriptUrl: "",
  scriptName: "",
  attachments: [],
  startTime: "",
  lunchBreakTime: "",
  endTime: "",
  locations: [],
  scenes: [],
  contacts: [],
  crewCallTimes: [],
  castCallTimes: [],
  generalNotes: "",
};

describe("useCallSheet initial load", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads from localStorage without unsaved changes", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSheet));
    const { result } = renderHook(() => useCallSheet());

    await waitFor(() =>
      expect(result.current.callSheet.productionTitle).toBe("Stored Title")
    );
    expect(result.current.hasUnsavedChanges).toBe(false);
  });

  it("marks unsaved changes after updates", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSheet));
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
