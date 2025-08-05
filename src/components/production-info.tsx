import { Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ProductionInfoProps {
  productionTitle: string;
  shootingDate: string;
  producer?: string;
  director?: string;
  client?: string;
  onUpdateField: (field: any, value: any) => void;
}

export default function ProductionInfo({ 
  productionTitle, 
  shootingDate,
  producer = '',
  director = '',
  client = '',
  onUpdateField 
}: ProductionInfoProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-[var(--brick-dark)] rounded-lg flex items-center justify-center mr-3">
            <Film className="text-[var(--brick-light)] w-4 h-4" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--brick-dark)]">Informações da Produção</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Cliente
            </Label>
            <Input
              type="text"
              value={client}
              onChange={(e) => onUpdateField('client', e.target.value)}
              placeholder="Nome do cliente ou empresa"
              size="lg"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Título da Produção
            </Label>
            <Input
              type="text"
              value={productionTitle}
              onChange={(e) => onUpdateField('productionTitle', e.target.value)}
              placeholder="Nome do projeto ou filme"
              size="lg"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Data de Filmagem
            </Label>
            <Input
              type="date"
              value={shootingDate}
              onChange={(e) => onUpdateField('shootingDate', e.target.value)}
              size="lg"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Produtor
            </Label>
            <Input
              type="text"
              value={producer}
              onChange={(e) => onUpdateField('producer', e.target.value)}
              placeholder="Nome do produtor"
              size="lg"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Diretor
            </Label>
            <Input
              type="text"
              value={director}
              onChange={(e) => onUpdateField('director', e.target.value)}
              placeholder="Nome do diretor"
              size="lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
