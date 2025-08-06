import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("@/lib/api", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/lib/api";
import { useProjects } from "./use-projects";

type Mock = ReturnType<typeof vi.fn>;

const STORAGE_KEY = "brick-projects";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const baseProject = {
  id: "1",
  name: "Test Project",
  description: "",
  client: "",
  status: "ativo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("useProjects deleteProject", () => {
  beforeEach(() => {
    localStorage.clear();
    (apiRequest as Mock).mockReset();
  });

  it("removes project from state and localStorage", async () => {
    let serverProjects = [baseProject];
    (apiRequest as Mock).mockImplementation(async (url: string, opts?: RequestInit) => {
      if (opts?.method === "DELETE") {
        const id = url.split("/").pop();
        serverProjects = serverProjects.filter(p => p.id !== id);
        return undefined;
      }
      if (opts?.method === "POST") {
        const body = JSON.parse(String(opts.body));
        serverProjects.push(body);
        return body;
      }
      return serverProjects;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify([baseProject]));
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProjects(), { wrapper });

    await waitFor(() => expect(result.current.projects.length).toBe(1));

    act(() => {
      result.current.deleteProject(baseProject.id);
    });

    await waitFor(() => expect(result.current.projects.length).toBe(0));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });

  it("cleans local state even if server delete fails", async () => {
    let serverProjects = [baseProject];
    (apiRequest as Mock).mockImplementation(async (url: string, opts?: RequestInit) => {
      if (opts?.method === "DELETE") {
        const id = url.split("/").pop();
        serverProjects = serverProjects.filter(p => p.id !== id);
        throw new Error("fail");
      }
      if (opts?.method === "POST") {
        const body = JSON.parse(String(opts.body));
        serverProjects.push(body);
        return body;
      }
      return serverProjects;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify([baseProject]));
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProjects(), { wrapper });

    await waitFor(() => expect(result.current.projects.length).toBe(1));

    act(() => {
      result.current.deleteProject(baseProject.id);
    });

    await waitFor(() => expect(result.current.projects.length).toBe(0));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("[]");
  });
});

