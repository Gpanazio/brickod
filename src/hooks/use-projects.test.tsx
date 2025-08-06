import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProjects } from './use-projects';
import { vi, type Mock } from 'vitest';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

vi.mock('@/lib/api', () => ({
  apiRequest: vi.fn(),
  API_BASE: ''
}));

import { apiRequest } from '@/lib/api';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
}

describe('useProjects', () => {
  beforeEach(() => {
    localStorage.clear();
    (apiRequest as Mock).mockReset();
  });

  it('adds project to localStorage when server unavailable', async () => {
    (apiRequest as Mock).mockRejectedValue(new Error('offline'));
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useProjects(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => {
      result.current.addProject('Local Project');
    });
    await waitFor(() => {
      expect(result.current.projects[0].name).toBe('Local Project');
    });
    const stored = JSON.parse(localStorage.getItem('brick-projects') || '[]');
    expect(stored[0].name).toBe('Local Project');
  });
});
