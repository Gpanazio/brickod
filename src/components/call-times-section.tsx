import { Clock, Plus, Minus, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CallTime } from "@shared/schema";

interface CallTimesSectionProps {
  crewCallTimes: CallTime[];
  castCallTimes: CallTime[];
  startTime?: string;
  lunchBreakTime?: string;
  endTime?: string;
  onAddCrew: () => void;
  onUpdateCrew: (id: string, updates: Partial<CallTime>) => void;
  onRemoveCrew: (id: string) => void;
  onAddCast: () => void;
  onUpdateCast: (id: string, updates: Partial<CallTime>) => void;
  onRemoveCast: (id: string) => void;
  onUpdateField: (field: any, value: any) => void;
}

export default function CallTimesSection({ 
  crewCallTimes,
  castCallTimes,
  startTime,
  lunchBreakTime,
  endTime,
  onAddCrew,
  onUpdateCrew,
  onRemoveCrew,
  onAddCast,
  onUpdateCast,
  onRemoveCast,
  onUpdateField
}: CallTimesSectionProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 brick-dark rounded-lg flex items-center justify-center mr-3">
              <Clock className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-brick-dark">Horários de Chamada</h2>
          </div>
        </div>

        {/* Horários Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Horário de Início
            </Label>
            <Input
              type="time"
              value={startTime || ''}
              onChange={(e) => onUpdateField('startTime', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brick-red focus:border-transparent transition-all"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Horário do Almoço
            </Label>
            <Input
              type="time"
              value={lunchBreakTime || ''}
              onChange={(e) => onUpdateField('lunchBreakTime', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brick-red focus:border-transparent transition-all"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Horário de Fim
            </Label>
            <Input
              type="time"
              value={endTime || ''}
              onChange={(e) => onUpdateField('endTime', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brick-red focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crew Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Users className="w-4 h-4 mr-2 text-brick-red" />
                Equipe Técnica
              </h3>
              <Button
                onClick={onAddCrew}
                variant="outline"
                size="sm"
                className="text-brick-red border-brick-red hover:bg-brick-red hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {crewCallTimes.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm italic">
                Nenhum horário de equipe adicionado
              </div>
            ) : (
              <div className="space-y-3">
                {crewCallTimes.map((callTime) => (
                  <div key={callTime.id} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Membro da Equipe</span>
                      <Button
                        onClick={() => onRemoveCrew(callTime.id)}
                        variant="iconGhost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Nome</Label>
                        <Input
                          type="text"
                          value={callTime.name}
                          onChange={(e) => onUpdateCrew(callTime.id, { name: e.target.value })}
                          placeholder="Ex: João Silva"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Cargo</Label>
                        <Input
                          type="text"
                          value={callTime.role}
                          onChange={(e) => onUpdateCrew(callTime.id, { role: e.target.value })}
                          placeholder="Ex: Diretor, Cinegrafista"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Telefone</Label>
                        <Input
                          type="tel"
                          value={callTime.phone || ''}
                          onChange={(e) => onUpdateCrew(callTime.id, { phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1 block">Horário</Label>
                        <Input
                          type="time"
                          value={callTime.time}
                          onChange={(e) => onUpdateCrew(callTime.id, { time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cast Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Star className="w-4 h-4 mr-2 text-brick-red" />
                Elenco
              </h3>
              <Button
                onClick={onAddCast}
                variant="outline"
                size="sm"
                className="text-brick-red border-brick-red hover:bg-brick-red hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {castCallTimes.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm italic">
                Nenhum horário de elenco adicionado
              </div>
            ) : (
              <div className="space-y-3">
                {castCallTimes.map((callTime) => (
                  <div key={callTime.id} className="flex items-center space-x-3">
                    <Input
                      type="text"
                      value={callTime.name}
                      onChange={(e) => onUpdateCast(callTime.id, { name: e.target.value })}
                      placeholder="Nome do Ator/Atriz"
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
                    />
                    <Input
                      type="time"
                      value={callTime.time}
                      onChange={(e) => onUpdateCast(callTime.id, { time: e.target.value })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
                    />
                    <Button
                      onClick={() => onRemoveCast(callTime.id)}
                      variant="iconGhost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
