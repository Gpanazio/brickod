import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CallSheet } from "@shared/schema";

export function useCallSheetHistory() {
  return useQuery({
    queryKey: ['/api/call-sheets'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/call-sheets');
        if (!response.ok) {
          console.warn('Banco de dados indisponível, usando histórico local');
          return getLocalHistory();
        }
        const data = await response.json() as CallSheet[];
        return data.sort((a, b) => 
          new Date(b.updatedAt || b.createdAt || '').getTime() - 
          new Date(a.updatedAt || a.createdAt || '').getTime()
        );
      } catch (error) {
        console.warn('Erro de conexão com banco, usando histórico local:', error);
        return getLocalHistory();
      }
    },
  });
}

function getLocalHistory(): CallSheet[] {
  try {
    const stored = localStorage.getItem('brick_call_sheets_history');
    if (!stored) return [];
    const data = JSON.parse(stored) as CallSheet[];
    return data.sort((a, b) => 
      new Date(b.updatedAt || b.createdAt || '').getTime() - 
      new Date(a.updatedAt || a.createdAt || '').getTime()
    );
  } catch (error) {
    console.error('Erro ao carregar histórico local:', error);
    return [];
  }
}

export function useCreateCallSheet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (callSheet: CallSheet) => {
      try {
        const response = await fetch('/api/call-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(callSheet),
        });
        if (!response.ok) throw new Error('Failed to create call sheet');
        return response.json();
      } catch (error) {
        console.warn('Salvando ordem do dia localmente devido a erro de conexão:', error);
        return saveCallSheetLocally(callSheet);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/call-sheets'] });
    },
  });
}

function saveCallSheetLocally(callSheet: CallSheet): CallSheet {
  try {
    const stored = localStorage.getItem('brick_call_sheets_history');
    const history = stored ? JSON.parse(stored) : [];
    
    const newCallSheet: CallSheet = {
      ...callSheet,
      id: `local_${Date.now()}`,
      createdAt: callSheet.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    history.push(newCallSheet);
    localStorage.setItem('brick_call_sheets_history', JSON.stringify(history));
    
    return newCallSheet;
  } catch (error) {
    console.error('Erro ao salvar ordem do dia localmente:', error);
    throw new Error('Falha ao salvar ordem do dia');
  }
}

export function useDeleteCallSheet() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    
    try {
      const stored = localStorage.getItem('brick_call_sheets_history');
      const history = stored ? JSON.parse(stored) : [];
      
      const filteredHistory = history.filter((cs: CallSheet) => cs.id !== id);
      localStorage.setItem('brick_call_sheets_history', JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Erro ao deletar call sheet:', error);
      throw new Error('Falha ao deletar call sheet');
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
  };
}