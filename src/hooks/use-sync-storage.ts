import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { SelectProject, InsertProject, SelectCallSheet, InsertCallSheet } from "@shared/schema";
import { nanoid } from "nanoid";

const PROJECTS_STORAGE_KEY = "brick-projects";
const CALLSHEETS_STORAGE_KEY = "brick-call-sheets";

async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Sistema de sincronização inteligente
export function useSyncProjects() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Sincroniza dados entre localStorage e servidor
  const syncData = useCallback(async () => {
    try {
      // 1. Buscar dados do servidor
      const serverProjects = await apiRequest("/api/projects");
      
      // 2. Buscar dados do localStorage
      const localData = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      
      // 3. Merge inteligente baseado em updatedAt
      const mergedProjects = mergeByTimestamp(serverProjects, localProjects);
      
      // 4. Atualizar localStorage com dados mesclados
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(mergedProjects));
      
      // 5. Sincronizar diferenças para o servidor
      await syncToServer(mergedProjects, serverProjects);
      
      setLastSync(new Date());
      return mergedProjects;
      
    } catch (error) {
      console.warn("Sync failed, using localStorage only:", error);
      const localData = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  }, []);

  // Merge inteligente baseado em timestamp
  const mergeByTimestamp = (serverData: SelectProject[], localData: SelectProject[]): SelectProject[] => {
    const merged = new Map<string, SelectProject>();
    
    // Adicionar todos os itens do servidor
    serverData.forEach(item => {
      merged.set(item.id, item);
    });
    
    // Verificar itens locais e manter os mais recentes
    localData.forEach(localItem => {
      const serverItem = merged.get(localItem.id);
      
      if (!serverItem) {
        // Item existe apenas localmente, adicionar
        merged.set(localItem.id, localItem);
      } else {
        // Comparar timestamps e manter o mais recente
        const localDate = new Date(localItem.updatedAt);
        const serverDate = new Date(serverItem.updatedAt);
        
        if (localDate > serverDate) {
          merged.set(localItem.id, localItem);
        }
      }
    });
    
    return Array.from(merged.values());
  };

  // Sincronizar diferenças para o servidor
  const syncToServer = async (mergedData: SelectProject[], serverData: SelectProject[]) => {
    const serverMap = new Map(serverData.map(item => [item.id, item]));
    
    for (const project of mergedData) {
      const serverProject = serverMap.get(project.id);
      
      if (!serverProject) {
        // Criar no servidor
        try {
          await apiRequest("/api/projects", {
            method: "POST",
            body: JSON.stringify(project),
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.warn(`Failed to create project ${project.id} on server:`, error);
        }
      } else if (new Date(project.updatedAt) > new Date(serverProject.updatedAt)) {
        // Atualizar no servidor
        try {
          await apiRequest(`/api/projects/${project.id}`, {
            method: "PUT",
            body: JSON.stringify(project),
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.warn(`Failed to update project ${project.id} on server:`, error);
        }
      }
    }
  };

  // Query principal com sincronização automática
  const query = useQuery<SelectProject[]>({
    queryKey: ["/api/projects-sync"],
    queryFn: syncData,
    staleTime: 10000, // 10 segundos
    refetchInterval: 30000, // Re-sync a cada 30 segundos
  });

  // Mutation para criar projeto
  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const newProject: SelectProject = {
        ...data,
        id: data.id || nanoid(),
        description: data.description || '',
        client: data.client || '',
        status: data.status || 'ativo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 1. Salvar localmente primeiro (resposta imediata)
      const localData = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      const updatedLocal = [...localProjects, newProject];
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedLocal));

      // 2. Tentar salvar no servidor em background
      try {
        await apiRequest("/api/projects", {
          method: "POST",
          body: JSON.stringify(newProject),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.warn("Failed to save to server, will sync later:", error);
      }

      return newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects-sync"] });
      toast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso.",
      });
    },
  });

  // Mutation para atualizar projeto
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProject> }) => {
      // 1. Atualizar localmente primeiro
      const localData = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      const updated = localProjects.map(p => 
        p.id === id 
          ? { ...p, ...data, updatedAt: new Date() }
          : p
      );
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));

      // 2. Tentar atualizar no servidor
      try {
        return await apiRequest(`/api/projects/${id}`, {
          method: "PUT",
          body: JSON.stringify({ ...data, updatedAt: new Date() }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.warn("Failed to update on server, will sync later:", error);
        return updated.find(p => p.id === id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects-sync"] });
      toast({
        title: "Projeto atualizado",
        description: "O projeto foi atualizado com sucesso.",
      });
    },
  });

  // Mutation para deletar projeto
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // 1. Deletar localmente primeiro
      const localData = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      const filtered = localProjects.filter(p => p.id !== id);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));

      // 2. Tentar deletar do servidor
      try {
        await apiRequest(`/api/projects/${id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.warn("Failed to delete from server, will sync later:", error);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects-sync"] });
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso.",
      });
    },
  });

  const projects = query.data || [];

  return {
    projects,
    isLoading: query.isLoading,
    error: query.error,
    lastSync,
    addProject: (name: string, description?: string, client?: string) => {
      return createMutation.mutate({ 
        id: nanoid(),
        name, 
        description: description || '', 
        client: client || '' 
      });
    },
    updateProject: (id: string, updates: Partial<InsertProject>) => {
      return updateMutation.mutate({ id, data: updates });
    },
    deleteProject: (id: string) => {
      return deleteMutation.mutate(id);
    },
    getProject: (id: string) => {
      return projects.find((project: SelectProject) => project.id === id);
    },
    refreshProjects: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects-sync"] });
    },
    forceSync: () => {
      return syncData();
    },
  };
}

// Hook similar para Call Sheets
export function useSyncCallSheets(projectId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const syncCallSheetsData = useCallback(async () => {
    try {
      const serverCallSheets = await apiRequest("/api/call-sheets");
      const localData = localStorage.getItem(CALLSHEETS_STORAGE_KEY);
      const localCallSheets: SelectCallSheet[] = localData ? JSON.parse(localData) : [];
      
      // Merge similar ao de projetos
      const merged = new Map<string, SelectCallSheet>();
      
      serverCallSheets.forEach((item: SelectCallSheet) => {
        merged.set(item.id, item);
      });
      
      localCallSheets.forEach(localItem => {
        const serverItem = merged.get(localItem.id);
        if (!serverItem || new Date(localItem.updatedAt) > new Date(serverItem.updatedAt)) {
          merged.set(localItem.id, localItem);
        }
      });
      
      const mergedCallSheets = Array.from(merged.values());
      localStorage.setItem(CALLSHEETS_STORAGE_KEY, JSON.stringify(mergedCallSheets));
      
      return projectId 
        ? mergedCallSheets.filter(cs => cs.projectId === projectId)
        : mergedCallSheets;
        
    } catch (error) {
      console.warn("CallSheets sync failed:", error);
      const localData = localStorage.getItem(CALLSHEETS_STORAGE_KEY);
      const localCallSheets = localData ? JSON.parse(localData) : [];
      return projectId 
        ? localCallSheets.filter((cs: SelectCallSheet) => cs.projectId === projectId)
        : localCallSheets;
    }
  }, [projectId]);

  const query = useQuery<SelectCallSheet[]>({
    queryKey: ["/api/call-sheets-sync", projectId],
    queryFn: syncCallSheetsData,
    staleTime: 10000,
    refetchInterval: 30000,
  });

  return {
    callSheets: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refreshCallSheets: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-sheets-sync", projectId] });
    },
  };
}