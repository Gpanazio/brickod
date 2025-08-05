import { Clock, Plus, Minus, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { CallTime, TeamMember } from "@shared/schema";

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
  members: TeamMember[];
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
  onUpdateField,
  members
}: CallTimesSectionProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[var(--brick-dark)] rounded-lg flex items-center justify-center mr-3">
              <Clock className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--brick-dark)]">Horários de Chamada</h2>
          </div>
        </div>

        {/* Horários Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-muted rounded-lg">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Horário de Início
            </Label>
            <Input
              type="time"
              value={startTime || ''}
              onChange={(e) => onUpdateField('startTime', e.target.value)}
              size="lg"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Horário do Almoço
            </Label>
            <Input
              type="time"
              value={lunchBreakTime || ''}
              onChange={(e) => onUpdateField('lunchBreakTime', e.target.value)}
              size="lg"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">
              Horário de Fim
            </Label>
            <Input
              type="time"
              value={endTime || ''}
              onChange={(e) => onUpdateField('endTime', e.target.value)}
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crew Section */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-foreground flex items-center">
                <Users className="w-4 h-4 mr-2 text-[var(--brick-red)]" />
                Equipe Técnica
              </h3>
              <Button
                onClick={onAddCrew}
                variant="outlineBrick"
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {crewCallTimes.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm italic">
                Nenhum horário de equipe adicionado
              </div>
            ) : (
              <div className="space-y-3">
                {crewCallTimes.map((callTime) => (
                  <div key={callTime.id} className="space-y-2 p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="w-full mr-2">
                        <Label className="text-xs text-muted-foreground mb-1 block">Membro da Equipe</Label>
                        <Select
                          value={callTime.memberId || undefined}
                          onValueChange={(value) => {
                            const member = members.find((m) => m.id === value);
                            if (member) {
                              onUpdateCrew(callTime.id, {
                                memberId: member.id,
                                name: member.name,
                                role: member.role || '',
                                phone: member.phone || '',
                              });
                            } else {
                              onUpdateCrew(callTime.id, { memberId: undefined });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full px-3 py-2 text-sm">
                            <SelectValue placeholder="Selecione um membro" />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => onRemoveCrew(callTime.id)}
                        variant="iconDestructive"
                        size="sm"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Nome</Label>
                        <Input
                          type="text"
                          value={callTime.name}
                          onChange={(e) => onUpdateCrew(callTime.id, { name: e.target.value })}
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Cargo</Label>
                        <Input
                          type="text"
                          value={callTime.role}
                          onChange={(e) => onUpdateCrew(callTime.id, { role: e.target.value })}
                          placeholder="Ex: Diretor, Cinegrafista"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Telefone</Label>
                        <Input
                          type="tel"
                          value={callTime.phone || ''}
                          onChange={(e) => onUpdateCrew(callTime.id, { phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Horário</Label>
                        <Input
                          type="time"
                          value={callTime.time}
                          onChange={(e) => onUpdateCrew(callTime.id, { time: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cast Section */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-foreground flex items-center">
                <Star className="w-4 h-4 mr-2 text-[var(--brick-red)]" />
                Elenco
              </h3>
              <Button
                onClick={onAddCast}
                variant="outlineBrick"
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {castCallTimes.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm italic">
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
                      className="w-48"
                    />
                    <Input
                      type="time"
                      value={callTime.time}
                      onChange={(e) => onUpdateCast(callTime.id, { time: e.target.value })}
                      className="w-24"
                    />
                    <Button
                      onClick={() => onRemoveCast(callTime.id)}
                      variant="iconDestructive"
                      size="sm"
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
