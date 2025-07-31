-- SQL para criar a tabela de templates no Railway
-- Execute este código no SQL Editor do seu projeto Railway

CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON templates 
    FOR EACH ROW EXECUTE FUNCTION update_templates_updated_at();

-- Inserir alguns templates padrão
INSERT INTO templates (id, name, description, category, is_default, template_data) VALUES 
(
  'template_comercial_basico',
  'Comercial Básico',
  'Template padrão para comerciais de 30 segundos com locação única',
  'Comercial',
  true,
  '{
    "productionTitle": "",
    "locations": [
      {
        "id": "loc1",
        "address": "Estúdio - A definir",
        "notes": "Estúdio com fundo infinito branco"
      }
    ],
    "scenes": [
      {
        "id": "scene1",
        "number": "1",
        "description": "Apresentação do produto",
        "cast": "Apresentador principal"
      }
    ],
    "contacts": [
      {
        "id": "contact1",
        "name": "Diretor",
        "role": "Direção",
        "phone": "(11) 99999-9999"
      },
      {
        "id": "contact2",
        "name": "Produtor",
        "role": "Produção",
        "phone": "(11) 99999-9999"
      }
    ],
    "crewCallTimes": [
      {
        "id": "crew1",
        "time": "07:00",
        "name": "Equipe Técnica",
        "role": "Setup/Montagem"
      }
    ],
    "castCallTimes": [
      {
        "id": "cast1",
        "time": "09:00",
        "name": "Apresentador",
        "role": "Maquiagem e Figurino"
      }
    ],
    "generalNotes": "• Confirmar equipamentos de áudio\n• Preparar produtos para cena\n• Verificar iluminação do estúdio"
  }'
),
(
  'template_documentario',
  'Documentário Interview',
  'Template para entrevistas documentais com duas locações',
  'Documentário',
  true,
  '{
    "productionTitle": "",
    "locations": [
      {
        "id": "loc1",
        "address": "Local da entrevista - A definir",
        "notes": "Ambiente silencioso, boa iluminação natural"
      }
    ],
    "scenes": [
      {
        "id": "scene1",
        "number": "1",
        "description": "Entrevista principal",
        "cast": "Entrevistado"
      }
    ],
    "contacts": [
      {
        "id": "contact1",
        "name": "Diretor",
        "role": "Direção",
        "phone": "(11) 99999-9999"
      },
      {
        "id": "contact2",
        "name": "Entrevistado",
        "role": "Personagem",
        "phone": "(11) 99999-9999"
      }
    ],
    "crewCallTimes": [
      {
        "id": "crew1",
        "time": "08:00",
        "name": "Equipe Técnica",
        "role": "Setup equipamentos"
      }
    ],
    "castCallTimes": [
      {
        "id": "cast1",
        "time": "10:00",
        "name": "Entrevistado",
        "role": "Entrevista"
      }
    ],
    "generalNotes": "• Testar áudio antes da gravação\n• Preparar roteiro de perguntas\n• Verificar backup de cartões de memória"
  }'
);