import { nanoid } from "nanoid";
import type { InsertTemplate } from "@shared/schema";
import { apiRequest } from "@/lib/api";

export const defaultTemplates: InsertTemplate[] = [
  {
    id: nanoid(),
    name: "Comercial Básico",
    description: "Template padrão para comerciais de 30 segundos com locação única",
    category: "Comercial",
    isDefault: true,
    templateData: {
      productionTitle: "",
      locations: [
        {
          id: nanoid(),
          address: "Estúdio - A definir",
          notes: "Estúdio com fundo infinito branco"
        }
      ],
      scenes: [
        {
          id: nanoid(),
          number: "1",
          description: "Apresentação do produto",
          cast: "Apresentador principal"
        }
      ],
      contacts: [
        {
          id: nanoid(),
          name: "Diretor",
          role: "Direção",
          phone: "(11) 99999-9999"
        },
        {
          id: nanoid(),
          name: "Produtor",
          role: "Produção",
          phone: "(11) 99999-9999"
        },
        {
          id: nanoid(),
          name: "DOP",
          role: "Direção de Fotografia",
          phone: "(11) 99999-9999"
        }
      ],
      crewCallTimes: [
        {
          id: nanoid(),
          time: "07:00",
          name: "Equipe Técnica",
          role: "Setup/Montagem"
        },
        {
          id: nanoid(),
          time: "08:00",
          name: "Direção e Produção",
          role: "Briefing"
        }
      ],
      castCallTimes: [
        {
          id: nanoid(),
          time: "09:00",
          name: "Apresentador",
          role: "Maquiagem e Figurino"
        },
        {
          id: nanoid(),
          time: "10:00",
          name: "Apresentador",
          role: "Gravação"
        }
      ],
      generalNotes: "• Confirmar equipamentos de áudio\n• Preparar produtos para cena\n• Verificar iluminação do estúdio"
    }
  },
  {
    id: nanoid(),
    name: "Documentário Interview",
    description: "Template para entrevistas documentais com duas locações",
    category: "Documentário",
    isDefault: true,
    templateData: {
      productionTitle: "",
      locations: [
        {
          id: nanoid(),
          address: "Local da entrevista - A definir",
          notes: "Ambiente silencioso, boa iluminação natural"
        },
        {
          id: nanoid(),
          address: "Locação externa - A definir",
          notes: "Para imagens de apoio e cobertura"
        }
      ],
      scenes: [
        {
          id: nanoid(),
          number: "1",
          description: "Entrevista principal",
          cast: "Entrevistado"
        },
        {
          id: nanoid(),
          number: "2",
          description: "Imagens de cobertura",
          cast: "Equipe técnica"
        }
      ],
      contacts: [
        {
          id: nanoid(),
          name: "Diretor",
          role: "Direção",
          phone: "(11) 99999-9999"
        },
        {
          id: nanoid(),
          name: "Entrevistado",
          role: "Personagem",
          phone: "(11) 99999-9999"
        },
        {
          id: nanoid(),
          name: "Técnico de Som",
          role: "Áudio",
          phone: "(11) 99999-9999"
        }
      ],
      crewCallTimes: [
        {
          id: nanoid(),
          time: "08:00",
          name: "Equipe Técnica",
          role: "Setup equipamentos"
        },
        {
          id: nanoid(),
          time: "09:00",
          name: "Direção",
          role: "Briefing e preparação"
        }
      ],
      castCallTimes: [
        {
          id: nanoid(),
          time: "10:00",
          name: "Entrevistado",
          role: "Entrevista"
        }
      ],
      generalNotes: "• Testar áudio antes da gravação\n• Preparar roteiro de perguntas\n• Verificar backup de cartões de memória"
    }
  },
  {
    id: nanoid(),
    name: "Clipe Musical",
    description: "Template para clipes musicais com múltiplas locações",
    category: "Clipe Musical",
    isDefault: true,
    templateData: {
      productionTitle: "",
      locations: [
        {
          id: nanoid(),
          address: "Estúdio de gravação",
          notes: "Para cenas de performance"
        },
        {
          id: nanoid(),
          address: "Locação externa - A definir",
          notes: "Para cenas narrativas"
        }
      ],
      scenes: [
        {
          id: nanoid(),
          number: "1",
          description: "Performance no estúdio",
          cast: "Artista e banda"
        },
        {
          id: nanoid(),
          number: "2",
          description: "Cenas narrativas",
          cast: "Artista e atores"
        }
      ],
      contacts: [
        {
          id: nanoid(),
          name: "Diretor",
          role: "Direção",
          phone: "(11) 99999-9999"
        },
        {
          id: nanoid(),
          name: "Artista Principal",
          role: "Performer",
          phone: "(11) 99999-9999"
        },
        {
          id: nanoid(),
          name: "Produtor Musical",
          role: "Produção Musical",
          phone: "(11) 99999-9999"
        }
      ],
      crewCallTimes: [
        {
          id: nanoid(),
          time: "07:00",
          name: "Equipe Técnica",
          role: "Montagem equipamentos"
        },
        {
          id: nanoid(),
          time: "08:30",
          name: "Direção e Produção",
          role: "Alinhamento criativo"
        }
      ],
      castCallTimes: [
        {
          id: nanoid(),
          time: "09:00",
          name: "Artista",
          role: "Maquiagem e figurino"
        },
        {
          id: nanoid(),
          time: "10:00",
          name: "Banda",
          role: "Soundcheck e gravação"
        }
      ],
      generalNotes: "• Playback sincronizado preparado\n• Figurinos aprovados\n• Equipamentos de áudio testados\n• Cronograma musical definido"
    }
  }
];

export async function insertDefaultTemplates() {
  const templates = defaultTemplates.map(template => ({
    ...template,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  try {
    for (const template of templates) {
      await apiRequest('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
    }
    console.log('Templates padrão inseridos com sucesso');
  } catch (error) {
    console.error('Erro ao inserir templates padrão:', error);
  }
}