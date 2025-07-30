import { useState } from "react";
import { ArrowLeft, Calendar, FileText, Plus, MoreVertical, Edit, Trash2, Eye, Download, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProjectCallSheets } from "@/hooks/use-projects";
import { generateCallSheetPDF } from "@/lib/pdf-generator";
import type { SelectProject, SelectCallSheet } from "@shared/schema";

interface ProjectCallSheetsProps {
  project: SelectProject;
  onBack: () => void;
  onNewCallSheet: (projectId: string) => void;
  onEditCallSheet: (callSheet: SelectCallSheet) => void;
}

export function ProjectCallSheets({ project, onBack, onNewCallSheet, onEditCallSheet }: ProjectCallSheetsProps) {
  const { toast } = useToast();
  const { callSheets } = useProjectCallSheets(project.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState<SelectCallSheet | null>(null);

  const handleDeleteCallSheet = (callSheet: SelectCallSheet) => {
    // Implementar delete via localStorage por enquanto
    try {
      const localData = localStorage.getItem("brick-call-sheets");
      const allCallSheets = localData ? JSON.parse(localData) : [];
      const updated = allCallSheets.filter((cs: SelectCallSheet) => cs.id !== callSheet.id);
      localStorage.setItem("brick-call-sheets", JSON.stringify(updated));
      
      toast({
        title: "OD excluída",
        description: `A ordem do dia "${callSheet.productionTitle}" foi excluída.`,
      });
      setShowDeleteDialog(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a ordem do dia.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = (callSheet: SelectCallSheet) => {
    try {
      generateCallSheetPDF(callSheet);
      toast({
        title: "PDF gerado",
        description: "O arquivo PDF foi gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (callSheet: SelectCallSheet, newStatus: 'rascunho' | 'finalizada') => {
    try {
      const localData = localStorage.getItem("brick-call-sheets");
      const allCallSheets = localData ? JSON.parse(localData) : [];
      const updated = allCallSheets.map((cs: SelectCallSheet) => 
        cs.id === callSheet.id ? { ...cs, status: newStatus, updatedAt: new Date() } : cs
      );
      localStorage.setItem("brick-call-sheets", JSON.stringify(updated));
      
      toast({
        title: "Status atualizado",
        description: `OD "${callSheet.productionTitle}" marcada como ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da OD.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'rascunho':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Rascunho</Badge>;
      case 'finalizada':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Finalizada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const CallSheetCard = ({ callSheet }: { callSheet: CallSheet }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-brick-dark">{callSheet.productionTitle}</CardTitle>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(callSheet.shootingDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(callSheet.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditCallSheet(callSheet)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPDF(callSheet)}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </DropdownMenuItem>
                {callSheet.status === 'rascunho' && (
                  <DropdownMenuItem onClick={() => handleStatusChange(callSheet, 'finalizada')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Finalizar
                  </DropdownMenuItem>
                )}
                {callSheet.status === 'finalizada' && (
                  <DropdownMenuItem onClick={() => handleStatusChange(callSheet, 'rascunho')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Voltar para Rascunho
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(callSheet)}
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
        <div className="space-y-2">
          {callSheet.producer && (
            <p className="text-sm text-gray-600"><strong>Produtor:</strong> {callSheet.producer}</p>
          )}
          {callSheet.director && (
            <p className="text-sm text-gray-600"><strong>Diretor:</strong> {callSheet.director}</p>
          )}
          {callSheet.locations.length > 0 && (
            <p className="text-sm text-gray-600">
              <strong>Locações:</strong> {callSheet.locations.length} local{callSheet.locations.length !== 1 ? 'is' : ''}
            </p>
          )}
          {callSheet.scenes.length > 0 && (
            <p className="text-sm text-gray-600">
              <strong>Cenas:</strong> {callSheet.scenes.length} cena{callSheet.scenes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Atualizado em {new Date(callSheet.updatedAt!).toLocaleDateString('pt-BR')}
          </p>
          <div className="flex items-center space-x-2">
            {callSheet.attachments && callSheet.attachments.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {callSheet.attachments.length} arquivo{callSheet.attachments.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-brick-dark">{project.name}</h2>
            <p className="text-gray-600">
              {callSheets.length} ordem{callSheets.length !== 1 ? 's' : ''} do dia
            </p>
          </div>
        </div>
        <Button 
          onClick={() => onNewCallSheet(project.id!)}
          className="brick-red brick-red-hover text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova OD
        </Button>
      </div>

      {callSheets.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma ordem do dia criada</h3>
          <p className="text-gray-600 mb-6">Comece criando a primeira ordem do dia para este projeto.</p>
          <Button 
            onClick={() => onNewCallSheet(project.id!)}
            className="brick-red brick-red-hover text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira OD
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {callSheets.map((callSheet) => (
            <CallSheetCard key={callSheet.id} callSheet={callSheet} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent className="sm:max-w-md" aria-describedby="delete-dialog-description">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <p id="delete-dialog-description" className="text-sm text-gray-600">
              Esta ação não pode ser desfeita. A ordem do dia será removida permanentemente.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tem certeza que deseja excluir a ordem do dia <strong>"{showDeleteDialog?.productionTitle}"</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => showDeleteDialog && handleDeleteCallSheet(showDeleteDialog)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}