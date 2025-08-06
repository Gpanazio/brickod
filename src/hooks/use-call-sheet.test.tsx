import { renderHook, act, waitFor } from '@testing-library/react';
import { useCallSheet } from './use-call-sheet';

describe('useCallSheet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updates fields', () => {
    const { result } = renderHook(() => useCallSheet());
    act(() => {
      result.current.updateField('productionTitle', 'My Film');
    });
    expect(result.current.callSheet.productionTitle).toBe('My Film');
    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('saves and loads from storage', async () => {
    const { result } = renderHook(() => useCallSheet());
    act(() => {
      result.current.updateField('productionTitle', 'Stored Title');
    });
    act(() => {
      result.current.saveCallSheet();
    });

    const { result: result2 } = renderHook(() => useCallSheet());
    await waitFor(() => {
      expect(result2.current.callSheet.productionTitle).toBe('Stored Title');
    });
  });
});
