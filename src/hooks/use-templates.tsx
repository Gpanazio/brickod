import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { SelectTemplate, InsertTemplate } from "@shared/schema";

export function useTemplates(category?: string) {
  return useQuery({
    queryKey: category ? ['/api/templates', { category }] : ['/api/templates'],
    queryFn: async () => {
      try {
        const url = category ? `/api/templates?category=${category}` : '/api/templates';
        const response = await fetch(url);
        if (!response.ok) {
          console.warn('Banco de dados indisponível, usando armazenamento local');
          return getLocalTemplates(category);
        }
        return response.json() as Promise<SelectTemplate[]>;
      } catch (error) {
        console.warn('Erro de conexão com banco, usando armazenamento local:', error);
        return getLocalTemplates(category);
      }
    },
  });
}

function getLocalTemplates(category?: string): SelectTemplate[] {
  try {
    const stored = localStorage.getItem('brick_templates');
    if (!stored) return [];
    
    const templates = JSON.parse(stored);
    if (category) {
      return templates.filter((t: SelectTemplate) => t.category === category);
    }
    return templates;
  } catch (error) {
    console.error('Erro ao carregar templates locais:', error);
    return [];
  }
}

export function useDefaultTemplates() {
  return useQuery({
    queryKey: ['/api/templates/defaults'],
    queryFn: async () => {
      const response = await fetch('/api/templates/defaults');
      if (!response.ok) throw new Error('Failed to fetch default templates');
      return response.json() as Promise<SelectTemplate[]>;
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ['/api/templates', id],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      return response.json() as Promise<SelectTemplate>;
    },
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const client = useQueryClient();
  
  return useMutation({
    mutationFn: async (template: InsertTemplate) => {
      try {
        const response = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template),
        });
        if (!response.ok) {
          // Fallback para armazenamento local
          return saveTemplateLocally(template);
        }
        return response.json() as Promise<SelectTemplate>;
      } catch (error) {
        console.warn('Salvando template localmente devido a erro de conexão:', error);
        return saveTemplateLocally(template);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });
}

export function useUpdateTemplate(id: string) {
  const client = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<InsertTemplate>) => {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update template');
      return response.json() as Promise<SelectTemplate>;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['/api/templates'] });
      client.invalidateQueries({ queryKey: ['/api/templates', id] });
    },
  });
}

function saveTemplateLocally(template: InsertTemplate): SelectTemplate {
  try {
    const stored = localStorage.getItem('brick_templates');
    const templates = stored ? JSON.parse(stored) : [];
    
    const newTemplate: SelectTemplate = {
      ...template,
      id: `local_${Date.now()}`,
      isDefault: template.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    templates.push(newTemplate);
    localStorage.setItem('brick_templates', JSON.stringify(templates));
    
    return newTemplate;
  } catch (error) {
    console.error('Erro ao salvar template localmente:', error);
    throw new Error('Falha ao salvar template');
  }
}

export function useDeleteTemplate() {
  const client = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          // Fallback para exclusão local
          return deleteTemplateLocally(id);
        }
      } catch (error) {
        console.warn('Deletando template localmente devido a erro de conexão:', error);
        return deleteTemplateLocally(id);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });
}

function deleteTemplateLocally(id: string): void {
  try {
    const stored = localStorage.getItem('brick_templates');
    if (!stored) return;
    
    const templates = JSON.parse(stored);
    const updatedTemplates = templates.filter((t: SelectTemplate) => t.id !== id);
    localStorage.setItem('brick_templates', JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Erro ao deletar template localmente:', error);
    throw new Error('Falha ao deletar template');
  }
}