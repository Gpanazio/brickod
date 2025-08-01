import { useState } from "react";
import { Plus, FolderOpen, Calendar, User, MoreVertical, Edit, Trash2, Archive, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog-fixed";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useProjects, useProjectCallSheets } from "@/hooks/use-projects-final";
import { SyncIndicator } from "@/components/sync-indicator";
import type { SelectProject } from "@shared/schema";

interface ProjectsManagerProps {
  onSelectProject: (project: SelectProject) => void;
}

export function ProjectsManager({ onSelectProject }: ProjectsManagerProps) {
  const { toast } = useToast();
  const { projects, addProject, updateProject, deleteProject, lastSync, forceSync } = useProjects();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<SelectProject | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const project = addProject(
        newProjectName.trim(),
        newProjectDescription.trim(),
        newProjectClient.trim()
      );
      
      toast({
        title: "Projeto criado",
        description: `O projeto "${newProjectName}" foi criado com sucesso.`,
      });
      
      setNewProjectName("");
      setNewProjectDescription("");
      setNewProjectClient("");
      setShowNewProjectDialog(false);
    }
  };

  const handleUpdateProject = () => {
    if (editingProject && newProjectName.trim()) {
      updateProject(editingProject.id!, {
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        client: newProjectClient.trim(),
      });
      
      toast({
        title: "Projeto atualizado",
        description: `O projeto foi atualizado com sucesso.`,
      });
      
      setEditingProject(null);
      setNewProjectName("");
      setNewProjectDescription("");
      setNewProjectClient("");
    }
  };

  const handleDeleteProject = (project: SelectProject) => {
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
      deleteProject(project.id!);
      toast({
        title: "Projeto excluído",
        description: `O projeto "${project.name}" foi excluído.`,
      });
    }
  };

  const handleStatusChange = (project: SelectProject, newStatus: 'ativo' | 'pausado' | 'concluído') => {
    updateProject(project.id!, { status: newStatus });
    toast({
      title: "Status atualizado",
      description: `Projeto "${project.name}" marcado como ${newStatus}.`,
    });
  };

  const openEditDialog = (project: SelectProject) => {
    setEditingProject(project);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description || "");
    setNewProjectClient(project.client || "");
  };

  const resetForm = () => {
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectClient("");
    setEditingProject(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pausado':
        return <Badge className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      case 'concluído':
        return <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const ProjectCard = ({ project }: { project: SelectProject }) => {
    const { callSheets } = useProjectCallSheets(project.id);
    const draftsCount = callSheets.filter(cs => cs.status === 'rascunho').length;
    const finishedCount = callSheets.filter(cs => cs.status === 'finalizada').length;

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectProject(project)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 brick-red rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-brick-dark">{project.name}</CardTitle>
                {project.client && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <User className="w-3 h-3 mr-1" />
                    {project.client}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(project.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditDialog(project); }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {project.status === 'ativo' && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(project, 'pausado'); }}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </DropdownMenuItem>
                  )}
                  {project.status === 'pausado' && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(project, 'ativo'); }}>
                      <Play className="w-4 h-4 mr-2" />
                      Reativar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(project, 'concluído'); }}>
                    <Archive className="w-4 h-4 mr-2" />
                    Concluir
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project); }}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {project.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(project.createdAt!).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {draftsCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {draftsCount} rascunho{draftsCount !== 1 ? 's' : ''}
                </Badge>
              )}
              {finishedCount > 0 && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {finishedCount} finalizada{finishedCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brick-dark">Projetos</h2>
          <p className="text-gray-600">Organize suas ordens do dia por projeto</p>
          <div className="mt-2">
            <SyncIndicator 
              lastSync={lastSync} 
              onForceSync={forceSync}
              isLoading={false}
            />
          </div>
        </div>
        <Dialog open={showNewProjectDialog || !!editingProject} onOpenChange={(open) => {
          if (!open) {
            setShowNewProjectDialog(false);
            setEditingProject(null);
            setNewProjectName("");
            setNewProjectDescription("");
            setNewProjectClient("");
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setShowNewProjectDialog(true)}
              className="brick-red brick-red-hover text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-full bg-white rounded-xl p-6 shadow-lg z-50" aria-describedby="project-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Projeto' : 'Criar Novo Projeto'}
              </DialogTitle>
              <p id="project-dialog-description" className="text-sm text-gray-600">
                {editingProject ? 'Edite as informações do projeto abaixo.' : 'Preencha os dados para criar um novo projeto para organizar suas ordens do dia.'}
              </p>
            </DialogHeader>
            <form className="space-y-4" autoComplete="off">
              <div>
                <Label htmlFor="project-name" className="text-sm font-medium">
                  Nome do Projeto *
                </Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Ex: Campanha Verão 2024, Documentário Empresa"
                  className="mt-1"
                  autoComplete="off"
                />
              </div>
              
              <div>
                <Label htmlFor="project-client" className="text-sm font-medium">
                  Cliente
                </Label>
                <Input
                  id="project-client"
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  placeholder="Nome do cliente ou empresa"
                  className="mt-1"
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="project-description" className="text-sm font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Breve descrição do projeto..."
                  className="mt-1"
                  rows={3}
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewProjectDialog(false);
                    setEditingProject(null);
                    setNewProjectName("");
                    setNewProjectDescription("");
                    setNewProjectClient("");
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  className="brick-red brick-red-hover text-white"
                  disabled={!newProjectName.trim()}
                >
                  {editingProject ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto criado</h3>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro projeto para organizar suas ordens do dia.</p>
          <Button 
            onClick={() => setShowNewProjectDialog(true)}
            className="brick-red brick-red-hover text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Projeto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
