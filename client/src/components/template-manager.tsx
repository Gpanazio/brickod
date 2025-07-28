import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Layers, Edit } from "lucide-react";
import { useTemplates, useCreateTemplate, useDeleteTemplate } from "@/hooks/use-templates";
import { useToast } from "@/hooks/use-toast";
import type { CallSheet, Template } from "@shared/schema";

interface TemplateManagerProps {
  onSelectTemplate: (templateData: CallSheet) => void;
  currentCallSheet?: Partial<CallSheet>;
}

const CATEGORIES = [
  "Comercial",
  "Documentário", 
  "Ficção",
  "Clipe Musical",
  "Institucional",
  "Evento",
  "Outro"
];

export function TemplateManager({ onSelectTemplate, currentCallSheet }: TemplateManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  
  const { data: templates = [], isLoading, refetch } = useTemplates(
    selectedCategory === "all" ? undefined : selectedCategory
  );
  const createTemplate = useCreateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const handleCreateTemplate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      isDefault: false,
      templateData: {
        productionTitle: currentCallSheet?.productionTitle || "",
        locations: currentCallSheet?.locations || [],
        scenes: currentCallSheet?.scenes || [],
        contacts: currentCallSheet?.contacts || [],
        crewCallTimes: currentCallSheet?.crewCallTimes || [],
        castCallTimes: currentCallSheet?.castCallTimes || [],
        generalNotes: currentCallSheet?.generalNotes || "",
      }
    };

    try {
      await createTemplate.mutateAsync(templateData);
      toast({
        title: "Template criado",
        description: "O template foi salvo com sucesso!",
      });
      setIsCreateOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o template.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir o template "${name}"?`)) return;
    
    try {
      await deleteTemplate.mutateAsync(id);
      toast({
        title: "Template excluído",
        description: "O template foi removido com sucesso!",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o template.",
        variant: "destructive",
      });
    }
  };

  const handleApplyTemplate = (template: any) => {
    const callSheetData: CallSheet = {
      id: "",
      productionTitle: template.templateData.productionTitle || "",
      shootingDate: "",
      scriptUrl: "",
      scriptName: "",
      locations: template.templateData.locations || [],
      scenes: template.templateData.scenes || [],
      contacts: template.templateData.contacts || [],
      crewCallTimes: template.templateData.crewCallTimes || [],
      castCallTimes: template.templateData.castCallTimes || [],
      generalNotes: template.templateData.generalNotes || "",
      createdAt: "",
      updatedAt: "",
    };
    
    onSelectTemplate(callSheetData);
    toast({
      title: "Template aplicado",
      description: `O template "${template.name}" foi carregado!`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie seus modelos de mapa de filmagem
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateTemplate}>
              <DialogHeader>
                <DialogTitle>Criar Novo Template</DialogTitle>
                <DialogDescription>
                  Salve o mapa atual como um template para reutilizar
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Comercial Padrão"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva quando usar este template..."
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? "Salvando..." : "Salvar Template"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          Todos
        </Button>
        {CATEGORIES.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Lista de Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Carregando templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Layers className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Nenhum template encontrado</p>
            <p className="text-sm text-gray-400">
              Crie seu primeiro template a partir de um mapa existente
            </p>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="relative group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {template.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="mb-4">
                  {template.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div>Locações: {template.templateData.locations.length}</div>
                  <div>Cenas: {template.templateData.scenes.length}</div>
                  <div>Contatos: {template.templateData.contacts.length}</div>
                </div>
                
                <Button 
                  onClick={() => handleApplyTemplate(template)}
                  className="w-full"
                >
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}