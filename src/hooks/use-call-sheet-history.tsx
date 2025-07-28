import { useState, useEffect } from "react";
import type { CallSheet } from "@shared/schema";

// Versão simplificada para frontend estático - usa apenas localStorage
export function useCallSheetHistory() {
  const [callSheets, setCallSheets] = useState<CallSheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('brick_call_sheets_history');
        const history = stored ? JSON.parse(stored) : [];
        setCallSheets(history);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setCallSheets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  return {
    data: callSheets,
    isLoading,
    error: null,
  };
}

export function useCreateCallSheet() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (callSheet: CallSheet): Promise<CallSheet> => {
    setIsPending(true);
    
    try {
      const stored = localStorage.getItem('brick_call_sheets_history');
      const history = stored ? JSON.parse(stored) : [];
      
      const newCallSheet = {
        ...callSheet,
        id: callSheet.id || `local_${Date.now()}`,
        createdAt: callSheet.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Adiciona no início do array (mais recente primeiro)
      history.unshift(newCallSheet);
      
      // Limita a 50 itens no histórico
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem('brick_call_sheets_history', JSON.stringify(history));
      
      return newCallSheet;
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
      throw new Error('Falha ao salvar no histórico');
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
  };
}