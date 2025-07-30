import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { CallSheet } from "@shared/schema";

export function useCallSheetHistory() {
  return useQuery({
    queryKey: ['/api/call-sheets'],
    queryFn: async () => {
      try {
        const data = await apiRequest('/api/call-sheets') as CallSheet[];
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
        return await apiRequest('/api/call-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(callSheet),
        }) as CallSheet;
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/call-sheets/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/call-sheets'] });
    },
  });
}