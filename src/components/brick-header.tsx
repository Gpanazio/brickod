import { Film, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrickHeaderProps {
  onExportPDF: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

export default function BrickHeader({ onExportPDF, onSave, hasUnsavedChanges }: BrickHeaderProps) {
  return (
    <header className="brick-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* Brick Logo */}
            <div className="h-8 flex items-center">
              <svg viewBox="0 0 200 50" className="h-8 w-auto">
                <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white">
                  BRICK
                </text>
              </svg>
            </div>
            <div className="text-white">
              <h1 className="text-lg font-semibold">Gerador de Ordem do Dia</h1>
              <p className="text-xs text-gray-300">Produção Audiovisual</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={onExportPDF}
              variant="brick"
              className="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Gerar PDF
            </Button>
            <Button
              onClick={onSave}
              variant="ghost"
              className={`text-gray-300 hover:text-white transition-colors ${hasUnsavedChanges ? 'text-yellow-400' : ''}`}
            >
              <Save className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
