# Configuração do Supabase para o Gerador de Chamada Brick

## ✅ Tabelas Criadas com Sucesso!

As seguintes tabelas foram criadas em seu projeto Supabase:
- `projects` - Para gerenciar produções
- `call_sheets` - Para armazenar os mapas de filmagem
- `templates` - Para armazenar os templates reutilizáveis

## ✨ Nova Funcionalidade: Sistema de Templates

Agora você pode:
- **Criar templates** a partir de mapas existentes
- **Aplicar templates** para agilizar criação de novos mapas
- **Organizar por categoria** (Comercial, Documentário, Clipe Musical, etc.)
- **Gerenciar templates** com interface completa

### Como usar:
1. Crie um mapa de filmagem com as informações desejadas
2. Clique em "Gerenciar Templates" 
3. Clique em "Criar Template" para salvar como modelo
4. Use "Aplicar Template" para carregar em novos mapas

## Próximo Passo: Configurar Conexão

### 1. Obtendo a String de Conexão do Seu Projeto

1. **No seu projeto Supabase existente**, vá para o projeto
2. **No menu lateral**, clique em **"Settings" (Configurações)**
3. **Clique em "Database"**
4. **Na seção "Connection string"**, copie a URI de **"Transaction pooler"**
5. A string será algo como:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

### 2. Configurando a Variável de Ambiente

1. **Substitua `[YOUR-PASSWORD]`** pela senha do seu banco Supabase
2. **No Replit**, clique no ícone **"Secrets" (🔒)** no painel lateral
3. **Adicione uma nova secret**:
   - **Key**: `DATABASE_URL`
   - **Value**: A string de conexão completa com sua senha

### 4. Exemplo de DATABASE_URL

```
DATABASE_URL=postgresql://postgres.abcdefghijklmn:MinhaSenh@Super123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## Status Atual do Projeto

✅ **Configurações Completas:**
- Drizzle ORM configurado para PostgreSQL
- Schema de banco de dados criado (`call_sheets` table)
- API REST completa para operações CRUD
- Storage substituído por DatabaseStorage
- Dependências atualizadas (postgres-js)

✅ **Migrações Aplicadas:**
- Tabela `call_sheets` criada com todos os campos necessários
- Suporte a JSON para arrays complexos (locações, cenas, contatos, etc.)
- Timestamps automáticos para created_at e updated_at

## Testando a Conexão

Após configurar a variável `DATABASE_URL`, o servidor irá:

1. **Conectar automaticamente** ao Supabase
2. **Sincronizar o schema** do banco de dados
3. **Permitir operações CRUD** via API:
   - `GET /api/call-sheets` - Listar todas as chamadas
   - `POST /api/call-sheets` - Criar nova chamada
   - `GET /api/call-sheets/:id` - Buscar chamada específica
   - `PUT /api/call-sheets/:id` - Atualizar chamada
   - `DELETE /api/call-sheets/:id` - Deletar chamada

## Verificação no Supabase

Para verificar se os dados estão sendo salvos:

1. No painel do Supabase, vá em "Table Editor"
2. Você verá a tabela `call_sheets` 
3. Os dados salvos pela aplicação aparecerão lá
4. Você pode visualizar, editar ou deletar registros diretamente

## Próximos Passos

Após configurar o `DATABASE_URL`:
1. O servidor reiniciará automaticamente
2. A aplicação passará a salvar no Supabase
3. Teste criando uma nova chamada na interface
4. Verifique no painel do Supabase se os dados foram salvos

## Troubleshooting

**Se der erro de conexão:**
- Verifique se a senha está correta na DATABASE_URL
- Confirme se a região do Supabase está acessível
- Teste a string de conexão removendo caracteres especiais da senha

**Se a tabela não existir:**
- Execute `npm run db:push` no terminal para sincronizar o schema