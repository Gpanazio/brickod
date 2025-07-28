import { useState, useEffect } from "react";
import type { SelectTemplate, InsertTemplate } from "@shared/schema";

// Versão completa para frontend estático - usa apenas localStorage
export function useTemplates(category?: string) {
  const [templates, setTemplates] = useState<SelectTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = () => {
      try {
        const stored = localStorage.getItem('brick_templates');
        let allTemplates: SelectTemplate[] = stored ? JSON.parse(stored) : [];
        
        if (category) {
          allTemplates = allTemplates.filter(t => t.category === category);
        }
        
        setTemplates(allTemplates);
      } catch (error) {
        console.error('Erro ao carregar templates:', error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [category]);

  return {
    data: templates,
    isLoading,
    error: null,
  };
}

export function useCreateTemplate() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (template: InsertTemplate): Promise<SelectTemplate> => {
    setIsPending(true);
    
    try {
      const stored = localStorage.getItem('brick_templates');
      const templates = stored ? JSON.parse(stored) : [];
      
      const newTemplate: SelectTemplate = {
        ...template,
        id: `local_${Date.now()}`,
        isDefault: Boolean(template.isDefault || false),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      templates.push(newTemplate);
      localStorage.setItem('brick_templates', JSON.stringify(templates));
      
      return newTemplate;
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      throw new Error('Falha ao salvar template');
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
  };
}

// Hook para deletar templates - ADICIONADO
export function useDeleteTemplate() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    
    try {
      const stored = localStorage.getItem('brick_templates');
      const templates = stored ? JSON.parse(stored) : [];
      
      const filteredTemplates = templates.filter((t: SelectTemplate) => t.id !== id);
      localStorage.setItem('brick_templates', JSON.stringify(filteredTemplates));
    } catch (error) {
      console.error('Erro ao deletar template:', error);
      throw new Error('Falha ao deletar template');
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
  };
}