import { FileText, Upload, ExternalLink, X, Plus, File, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Attachment } from "@shared/schema";
import { useState } from "react";

interface ScriptSectionProps {
  scriptUrl: string;
  scriptName: string;
  attachments: Attachment[];
  onUpdateField: (field: any, value: any) => void;
  onAddAttachment: (name: string, url: string, type: string) => void;
  onUpdateAttachment: (id: string, updates: Partial<Attachment>) => void;
  onRemoveAttachment: (id: string) => void;
}

export default function ScriptSection({ 
  scriptUrl, 
  scriptName, 
  attachments,
  onUpdateField, 
  onAddAttachment,
  onUpdateAttachment,
  onRemoveAttachment
}: ScriptSectionProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");
  const [newAttachmentType, setNewAttachmentType] = useState("documento");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Para demonstração, criamos um URL local do arquivo
      const fileUrl = URL.createObjectURL(file);
      onUpdateField('scriptUrl', fileUrl);
      onUpdateField('scriptName', file.name);
      
      toast({
        title: "Roteiro anexado",
        description: `O arquivo "${file.name}" foi anexado com sucesso.`,
      });
    }
  };

  const handleUrlInput = (url: string) => {
    onUpdateField('scriptUrl', url);
    if (url && !scriptName) {
      // Extrai o nome do arquivo da URL se possível
      const fileName = url.split('/').pop() || 'Roteiro';
      onUpdateField('scriptName', fileName);
    }
  };

  const clearScript = () => {
    onUpdateField('scriptUrl', '');
    onUpdateField('scriptName', '');
    toast({
      title: "Roteiro removido",
      description: "O roteiro foi removido da chamada.",
    });
  };

  const openScript = () => {
    if (scriptUrl) {
      window.open(scriptUrl, '_blank');
    }
  };

  const handleAddAttachment = () => {
    if (newAttachmentName.trim() && newAttachmentUrl.trim()) {
      onAddAttachment(newAttachmentName.trim(), newAttachmentUrl.trim(), newAttachmentType);
      setNewAttachmentName("");
      setNewAttachmentUrl("");
      setNewAttachmentType("documento");
      setShowAddDialog(false);
      toast({
        title: "Arquivo adicionado",
        description: `O arquivo "${newAttachmentName}" foi adicionado com sucesso.`,
      });
    }
  };

  const handleFileUploadForAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileName = file.name;
      const fileType = file.type.includes('image') ? 'imagem' : 
                      file.type.includes('video') ? 'vídeo' : 
                      file.type.includes('audio') ? 'áudio' : 'documento';
      
      onAddAttachment(fileName, fileUrl, fileType);
      toast({
        title: "Arquivo anexado",
        description: `O arquivo "${fileName}" foi anexado com sucesso.`,
      });
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'imagem':
        return <FileText className="w-4 h-4" />;
      case 'vídeo':
        return <FileText className="w-4 h-4" />;
      case 'áudio':
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 brick-dark rounded-lg flex items-center justify-center mr-3">
            <FileText className="text-white w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-brick-dark">Roteiro</h2>
        </div>

        {scriptUrl ? (
          // Script attached state
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">{scriptName || 'Roteiro anexado'}</p>
                  <p className="text-sm text-green-600">Roteiro disponível para consulta</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={openScript}
                  variant="successOutline"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Abrir
                </Button>
                <Button
                  onClick={clearScript}
                  variant="iconDestructive"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // No script attached state
          <div className="space-y-4">
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Anexe o roteiro da produção</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="script-upload"
                  />
                  <Button
                    asChild
                    variant="brick"
                    className="px-6 py-2 cursor-pointer"
                  >
                    <label htmlFor="script-upload">
                      <Upload className="w-4 h-4 mr-2" />
                      Enviar Arquivo
                    </label>
                  </Button>
                </div>
                
                <span className="text-gray-400">ou</span>
                
                <div className="flex-1 max-w-md">
                  <Input
                    type="url"
                    placeholder="Cole o link do roteiro (Google Drive, Dropbox, etc.)"
                    value={scriptUrl}
                    onChange={(e) => handleUrlInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p><strong>Dica:</strong> O link do roteiro será incluído no PDF da chamada para fácil acesso da equipe.</p>
              <p><strong>Formatos aceitos:</strong> PDF, DOC, DOCX, TXT ou links para Google Drive, Dropbox, etc.</p>
            </div>
          </div>
        )}

        {scriptUrl && (
          <div className="mt-4">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Roteiro (opcional)
            </Label>
            <Input
              type="text"
              value={scriptName}
              onChange={(e) => onUpdateField('scriptName', e.target.value)}
              placeholder="Ex: Roteiro Final v3.0, Script - Cena Externa"
            />
          </div>
        )}

        {/* Seção de Outros Arquivos */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Outros Arquivos</h3>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outlineBrick" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Arquivo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Arquivo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="attachment-name" className="text-sm font-medium">
                      Nome do Arquivo
                    </Label>
                    <Input
                      id="attachment-name"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                      placeholder="Ex: Storyboard, Lista de Equipamentos, Cronograma"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="attachment-type" className="text-sm font-medium">
                      Tipo de Arquivo
                    </Label>
                    <Select
                      value={newAttachmentType}
                      onValueChange={setNewAttachmentType}
                    >
                      <SelectTrigger id="attachment-type" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="documento">Documento</SelectItem>
                        <SelectItem value="imagem">Imagem</SelectItem>
                        <SelectItem value="vídeo">Vídeo</SelectItem>
                        <SelectItem value="áudio">Áudio</SelectItem>
                        <SelectItem value="planilha">Planilha</SelectItem>
                        <SelectItem value="apresentação">Apresentação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Link do Arquivo</Label>
                    <div className="mt-1 space-y-3">
                      <Input
                        type="url"
                        value={newAttachmentUrl}
                        onChange={(e) => setNewAttachmentUrl(e.target.value)}
                        placeholder="Cole o link (Google Drive, Dropbox, etc.)"
                      />
                      
                      <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-400">ou</span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileUploadForAttachment}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="attachment-upload"
                        />
                        <Button
                          asChild
                          variant="outline"
                          className="w-full cursor-pointer"
                        >
                          <label htmlFor="attachment-upload">
                            <Upload className="w-4 h-4 mr-2" />
                            Enviar Arquivo
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddAttachment}
                      variant="brick"
                      disabled={!newAttachmentName.trim() || !newAttachmentUrl.trim()}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {attachments.length > 0 ? (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getAttachmentIcon(attachment.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{attachment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => window.open(attachment.url, '_blank')}
                      variant="successOutline"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Abrir
                    </Button>
                    <Button
                      onClick={() => onRemoveAttachment(attachment.id)}
                      variant="iconDestructive"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <File className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Nenhum arquivo adicional anexado</p>
              <p className="text-xs text-gray-400 mt-1">Use o botão "+" para adicionar storyboards, cronogramas, etc.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}