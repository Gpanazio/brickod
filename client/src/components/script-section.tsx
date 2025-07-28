import { FileText, Upload, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ScriptSectionProps {
  scriptUrl: string;
  scriptName: string;
  onUpdateField: (field: any, value: any) => void;
}

export default function ScriptSection({ 
  scriptUrl, 
  scriptName, 
  onUpdateField 
}: ScriptSectionProps) {
  const { toast } = useToast();

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
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Abrir
                </Button>
                <Button
                  onClick={clearScript}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
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
                    className="brick-red brick-red-hover text-white px-6 py-2 cursor-pointer"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}