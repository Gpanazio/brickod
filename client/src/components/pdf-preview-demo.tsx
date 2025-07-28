import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateCallSheetPDF } from "@/lib/pdf-generator";

// Dados de exemplo para demonstração
const exampleCallSheet = {
  id: "demo-123",
  productionTitle: "Curta-Metragem Brick - Projeto Exemplo",
  shootingDate: "2025-02-15",
  scriptUrl: "https://drive.google.com/file/d/1234567890/view",
  scriptName: "Roteiro Final v3.2 - Brick Curta",
  locations: [
    {
      id: "loc1",
      address: "Rua Augusta, 123 - Vila Madalena, São Paulo - SP",
      notes: "Acesso restrito até 8h. Autorização necessária para estacionamento."
    },
    {
      id: "loc2", 
      address: "Parque Ibirapuera - Portão 3, São Paulo - SP",
      notes: "Filmagem externa. Verificar condições climáticas."
    }
  ],
  scenes: [
    {
      id: "scene1",
      number: "1A",
      description: "Conversa entre protagonistas no café",
      cast: "Ana Silva, João Santos"
    },
    {
      id: "scene2",
      number: "2B", 
      description: "Perseguição pela rua principal",
      cast: "João Santos, Figurantes (5 pessoas)"
    }
  ],
  contacts: [
    {
      id: "contact1",
      name: "Maria Produtora",
      role: "Produtora Executiva", 
      phone: "(11) 99999-1234"
    },
    {
      id: "contact2",
      name: "Carlos Diretor",
      role: "Diretor",
      phone: "(11) 88888-5678"
    }
  ],
  crewCallTimes: [
    {
      id: "crew1",
      time: "06:00",
      name: "",
      role: "Equipe Técnica Geral"
    },
    {
      id: "crew2", 
      time: "06:30",
      name: "",
      role: "Diretor de Fotografia"
    },
    {
      id: "crew3", 
      time: "07:00",
      name: "",
      role: "Som Direto"
    }
  ],
  castCallTimes: [
    {
      id: "cast1",
      time: "07:30", 
      name: "Ana Silva",
      role: ""
    },
    {
      id: "cast2",
      time: "08:00",
      name: "João Santos", 
      role: ""
    }
  ],
  generalNotes: "ATENÇÃO: Previsão de chuva pela manhã. Equipamento de proteção disponível no caminhão de produção. Catering será servido às 12h no local. Todos devem portar documento de identidade para acesso às locações. Reunião de segurança às 5h45min no ponto de encontro.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface PDFPreviewDemoProps {
  onClose?: () => void;
}

export default function PDFPreviewDemo({ onClose }: PDFPreviewDemoProps) {
  const handleGenerateExamplePDF = () => {
    generateCallSheetPDF(exampleCallSheet);
  };

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader className="brick-dark text-white">
        <CardTitle className="flex items-center">
          <FileText className="w-6 h-6 mr-3" />
          Demonstração do PDF Gerado
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* PDF Preview Visual Representation */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
            {/* Header Section */}
            <div className="brick-black text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-white flex items-center justify-center">
                  <span className="text-brick-black font-bold text-xs">BRICK</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">MAPA DE FILMAGEM</h2>
                  <p className="text-sm text-gray-300">Produção Audiovisual</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <p>Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Content Preview */}
            <div className="bg-white p-6 space-y-6 text-sm">
              {/* Production Info */}
              <section>
                <h3 className="font-bold text-base mb-3 text-brick-dark">INFORMAÇÕES DA PRODUÇÃO</h3>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Título:</strong> Curta-Metragem Brick - Projeto Exemplo</p>
                  <p><strong>Data de Filmagem:</strong> 15/02/2025</p>
                  <p><strong>Roteiro:</strong> Roteiro Final v3.2 - Brick Curta</p>
                  <p className="text-blue-600"><strong>Link:</strong> https://drive.google.com/file/d/1234567890/view</p>
                </div>
              </section>

              {/* Locations */}
              <section>
                <h3 className="font-bold text-base mb-3 text-brick-dark">LOCAÇÕES</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Locação 1:</p>
                    <p className="ml-4">Endereço: Rua Augusta, 123 - Vila Madalena, São Paulo - SP</p>
                    <p className="ml-4">Observações: Acesso restrito até 8h. Autorização necessária...</p>
                  </div>
                  <div>
                    <p className="font-semibold">Locação 2:</p>
                    <p className="ml-4">Endereço: Parque Ibirapuera - Portão 3, São Paulo - SP</p>
                    <p className="ml-4">Observações: Filmagem externa. Verificar condições climáticas.</p>
                  </div>
                </div>
              </section>

              {/* Scenes */}
              <section>
                <h3 className="font-bold text-base mb-3 text-brick-dark">CENAS PROGRAMADAS</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-semibold">Cena 1A:</p>
                    <p className="ml-4">Descrição: Conversa entre protagonistas no café</p>
                    <p className="ml-4">Elenco: Ana Silva, João Santos</p>
                  </div>
                  <div>
                    <p className="font-semibold">Cena 2B:</p>
                    <p className="ml-4">Descrição: Perseguição pela rua principal</p>
                    <p className="ml-4">Elenco: João Santos, Figurantes (5 pessoas)</p>
                  </div>
                </div>
              </section>

              {/* Call Times */}
              <section>
                <h3 className="font-bold text-base mb-3 text-brick-dark">HORÁRIOS DE CHAMADA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="font-semibold mb-2">Equipe Técnica:</p>
                    <div className="ml-4 space-y-1">
                      <p>06:00 - Equipe Técnica Geral</p>
                      <p>06:30 - Diretor de Fotografia</p>
                      <p>07:00 - Som Direto</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Elenco:</p>
                    <div className="ml-4 space-y-1">
                      <p>07:30 - Ana Silva</p>
                      <p>08:00 - João Santos</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* General Notes */}
              <section>
                <h3 className="font-bold text-base mb-3 text-brick-dark">OBSERVAÇÕES GERAIS</h3>
                <div className="text-gray-700">
                  <p>ATENÇÃO: Previsão de chuva pela manhã. Equipamento de proteção disponível no caminhão de produção. Catering será servido às 12h no local...</p>
                </div>
              </section>

              {/* Contacts */}
              <section>
                <h3 className="font-bold text-base mb-3 text-brick-dark">CONTATOS IMPORTANTES</h3>
                <div className="space-y-2 text-gray-700">
                  <div>
                    <p>Maria Produtora - Produtora Executiva</p>
                    <p className="ml-4">Tel: (11) 99999-1234</p>
                  </div>
                  <div>
                    <p>Carlos Diretor - Diretor</p>
                    <p className="ml-4">Tel: (11) 88888-5678</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="brick-black text-white p-3 text-xs flex justify-between">
              <span>BRICK Produtora - 7 anos de experiência em produção audiovisual</span>
              <span>Página 1 de 1</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleGenerateExamplePDF}
              className="brick-red brick-red-hover text-white px-6 py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF de Exemplo
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="px-6 py-2"
              >
                Fechar Preview
              </Button>
            )}
          </div>

          <div className="text-center text-gray-600 text-sm">
            <p>Este é um exemplo de como fica o PDF gerado pela aplicação.</p>
            <p>O documento mantém a identidade visual da Brick com header e footer personalizados.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}