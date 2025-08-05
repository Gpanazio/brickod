import { FileText, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
            <div className="text-[var(--brick-light)]">
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
            <Link href="/team-members">
              <Button variant="ghostBrick">
                <Users className="w-4 h-4 mr-2" />
                Membros da equipe
              </Button>
            </Link>
            <Button
              onClick={onSave}
              variant="ghostBrick"
              className={hasUnsavedChanges ? 'text-yellow-400' : undefined}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar OD
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
