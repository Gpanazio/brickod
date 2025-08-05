import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Eye, FileText, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCallSheetHistory, useDeleteCallSheet } from "@/hooks/use-call-sheet-history";
import { useToast } from "@/hooks/use-toast";
import { generateCallSheetPDF } from "@/lib/pdf-generator";
import type { CallSheet } from "@shared/schema";

interface CallSheetHistoryProps {
  onSelectCallSheet: (callSheet: CallSheet) => void;
}

export function CallSheetHistory({ onSelectCallSheet }: CallSheetHistoryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: callSheets, isLoading } = useCallSheetHistory();
  const deleteCallSheet = useDeleteCallSheet();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteCallSheet.mutateAsync(deleteId);
      toast({
        title: "Mapa excluído",
        description: "O mapa de filmagem foi excluído com sucesso.",
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o mapa de filmagem.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async (callSheet: CallSheet) => {
    try {
      await generateCallSheetPDF(callSheet);
      toast({
        title: "PDF exportado",
        description: "O PDF foi gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Data não disponível";
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm");
    } catch {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brick-red)] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (!callSheets || callSheets.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Nenhuma ordem do dia encontrada</p>
        <p className="text-sm text-muted-foreground">
          Crie sua primeira ordem do dia para vê-la aqui
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {callSheets.map((callSheet) => (
          <Card key={callSheet.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-[var(--brick-dark)] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {callSheet.productionTitle || "Sem título"}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {callSheet.shootingDate || "Data não definida"}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {callSheet.locations.length} locações
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {callSheet.contacts.length} contatos
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outlineBrick"
                    onClick={() => onSelectCallSheet(callSheet)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Carregar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportPDF(callSheet)}
                    className="border-border text-muted-foreground hover:bg-muted"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(callSheet.id)}
                    className="border-red-400 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {callSheet.scenes.length > 0 && (
                  <Badge variant="secondary">
                    {callSheet.scenes.length} cenas
                  </Badge>
                )}
                {callSheet.crewCallTimes.length > 0 && (
                  <Badge variant="secondary">
                    {callSheet.crewCallTimes.length} horários equipe
                  </Badge>
                )}
                {callSheet.castCallTimes.length > 0 && (
                  <Badge variant="secondary">
                    {callSheet.castCallTimes.length} horários elenco
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Criado em: {formatDate(callSheet.createdAt)}
                {callSheet.updatedAt && callSheet.updatedAt !== callSheet.createdAt && (
                  <> • Atualizado em: {formatDate(callSheet.updatedAt)}</>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este mapa de filmagem? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteCallSheet.isPending}
            >
              {deleteCallSheet.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}