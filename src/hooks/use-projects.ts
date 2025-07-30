import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { SelectProject, InsertProject } from "@shared/schema";
import { nanoid } from "nanoid";
import { apiRequest } from "@/lib/api";

const STORAGE_KEY = "brick-projects";

export function useProjects() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Função de sincronização inteligente
  const syncData = async () => {
    try {
      // 1. Buscar dados do servidor
      const serverProjects = await apiRequest("/api/projects");
      console.log("Server projects:", serverProjects);
      
      // 2. Buscar dados locais
      const localData = localStorage.getItem(STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      console.log("Local projects:", localProjects);
      
      // 3. Primeiro, enviar projetos locais que não existem no servidor
      const serverIds = new Set(serverProjects.map((p: SelectProject) => p.id));
      const localOnlyProjects = localProjects.filter(p => !serverIds.has(p.id));
      
      for (const localProject of localOnlyProjects) {
        try {
          console.log("Uploading local project to server:", localProject.name);
          await apiRequest("/api/projects", {
            method: "POST",
            body: JSON.stringify(localProject),
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.warn("Failed to upload local project:", error);
        }
      }
      
      // 4. Buscar dados atualizados do servidor após upload
      const updatedServerProjects = await apiRequest("/api/projects");
      
      // 5. Merge inteligente baseado em timestamp
      const merged = new Map<string, SelectProject>();
      
      // Adicionar projetos do servidor (sempre prioridade)
      updatedServerProjects.forEach((project: SelectProject) => {
        merged.set(project.id, project);
      });
      
      // Verificar projetos locais mais recentes
      localProjects.forEach(localProject => {
        const serverProject = merged.get(localProject.id);
        
        if (serverProject) {
          // Comparar timestamps e manter o mais recente
          const localDate = new Date(localProject.updatedAt);
          const serverDate = new Date(serverProject.updatedAt);
          
          if (localDate > serverDate) {
            merged.set(localProject.id, localProject);
            // Atualizar no servidor também
            apiRequest(`/api/projects/${localProject.id}`, {
              method: "PUT",
              body: JSON.stringify(localProject),
              headers: { "Content-Type": "application/json" },
            }).catch(err => console.warn("Failed to update server:", err));
          }
        }
      });
      
      const finalProjects = Array.from(merged.values());
      
      // 6. Salvar resultado sincronizado no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProjects));
      
      setLastSync(new Date());
      console.log("Sync completed, final projects:", finalProjects);
      return finalProjects;
      
    } catch (error) {
      console.warn("Server sync failed, using localStorage:", error);
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  };

  // Query principal com sync mais agressivo
  const query = useQuery<SelectProject[]>({
    queryKey: ["/api/projects"],
    queryFn: syncData,
    staleTime: 5000, // 5 segundos
    refetchInterval: 15000, // 15 segundos (mais frequente)
    refetchOnWindowFocus: true, // Sync quando volta para a aba
    refetchOnMount: true, // Sempre sync ao montar
  });

  // Mutations
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

      // 1. Tentar salvar no servidor PRIMEIRO
      try {
        console.log("Creating project on server:", newProject);
        const serverProject = await apiRequest("/api/projects", {
          method: "POST",
          body: JSON.stringify(newProject),
          headers: { "Content-Type": "application/json" },
        });
        
        // 2. Salvar localmente após sucesso no servidor
        const localData = localStorage.getItem(STORAGE_KEY);
        const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
        const updated = [...localProjects, serverProject];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        console.log("Project created successfully on server and local");
        return serverProject;
        
      } catch (error) {
        console.warn("Server save failed, saving locally:", error);
        
        // 3. Fallback: salvar apenas localmente
        const localData = localStorage.getItem(STORAGE_KEY);
        const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
        const updated = [...localProjects, newProject];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        return newProject;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProject> }) => {
      // Atualizar localmente
      const localData = localStorage.getItem(STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      const updated = localProjects.map(p => 
        p.id === id 
          ? { ...p, ...data, updatedAt: new Date() }
          : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Tentar atualizar no servidor
      try {
        return await apiRequest(`/api/projects/${id}`, {
          method: "PUT",
          body: JSON.stringify({ ...data, updatedAt: new Date() }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.warn("Server update failed:", error);
        return updated.find(p => p.id === id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto atualizado",
        description: "O projeto foi atualizado com sucesso.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Deletar localmente
      const localData = localStorage.getItem(STORAGE_KEY);
      const localProjects: SelectProject[] = localData ? JSON.parse(localData) : [];
      const filtered = localProjects.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      // Tentar deletar do servidor
      try {
        await apiRequest(`/api/projects/${id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.warn("Server delete failed:", error);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso.",
      });
    },
  });

  return {
    projects: query.data || [],
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
      const projects = query.data || [];
      return projects.find((project: SelectProject) => project.id === id);
    },
    refreshProjects: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    forceSync: () => {
      return queryClient.refetchQueries({ queryKey: ["/api/projects"] });
    },
  };
}

// Hook simples para call sheets
export function useProjectCallSheets(projectId?: string) {
  const [callSheets, setCallSheets] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("brick-call-sheets");
      if (stored) {
        const allCallSheets = JSON.parse(stored);
        if (projectId) {
          const filtered = allCallSheets.filter((cs: any) => cs.projectId === projectId);
          setCallSheets(filtered);
        } else {
          setCallSheets(allCallSheets);
        }
      }
    } catch (error) {
      console.error("Error loading call sheets:", error);
    }
  }, [projectId]);

  return {
    callSheets,
    refreshCallSheets: () => {
      // Recarregar do localStorage
      try {
        const stored = localStorage.getItem("brick-call-sheets");
        if (stored) {
          const allCallSheets = JSON.parse(stored);
          if (projectId) {
            const filtered = allCallSheets.filter((cs: any) => cs.projectId === projectId);
            setCallSheets(filtered);
          } else {
            setCallSheets(allCallSheets);
          }
        }
      } catch (error) {
        console.error("Error refreshing call sheets:", error);
      }
    },
  };
}