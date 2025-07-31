# Gerador de Ordem do Dia - Brick Produtora

Uma ferramenta web avançada para gerenciamento de produções audiovisuais, otimizada para equipes de produção brasileiras.

## 🎬 Sobre o Projeto

O Gerador de Ordem do Dia é uma aplicação desenvolvida pela Brick Produtora para facilitar a criação e gerenciamento de ordens do dia (call sheets) para produções audiovisuais. A ferramenta oferece uma interface intuitiva e responsiva para organizar todas as informações necessárias de uma produção.

## ✨ Funcionalidades

- **Criação de Ordens do Dia**: Interface completa para inserir informações da produção
- **Sistema de Templates**: Crie e reutilize templates para agilizar o trabalho
- **Histórico de Produções**: Acesse e gerencie ordens do dia anteriores
- **Exportação em PDF**: Gere PDFs profissionais com layout organizado
- **Gerenciamento de Equipe**: Organize contatos, locações e horários de chamada
- **Drag & Drop**: Reorganize seções facilmente (exceto horários de chamada)
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL com Railway + Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **PDF**: jsPDF para geração client-side
- **State Management**: React Query + Local Storage

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Railway (para banco de dados)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/gerador-ordem-do-dia.git
cd gerador-ordem-do-dia
```

### 2. Copie o arquivo de variáveis de ambiente
```bash
cp .env.example .env
```
Preencha `DATABASE_URL` e `PORT` (opcional).
Defina também `VITE_API_BASE_URL` (ou `API_BASE_URL` no servidor) com a URL
base da API caso execute código fora do navegador.

### 3. Instale as dependências
```bash
npm install
```

### 4. Configure o banco de dados

#### Opção A: Railway (Recomendado)
1. Crie um projeto no [Railway](https://railway.app)
2. Clique em "Add New" e selecione **PostgreSQL**
3. Abra a aba **Connect** e copie o campo `PostgreSQL connection`
4. Configure a variável de ambiente:

```bash
# .env
DATABASE_URL=postgresql://user:senha@host:port/database
```

**Importante**: Se sua senha contém caracteres especiais, codifique-os:
- `$` → `%24`
- `@` → `%40`
- `#` → `%23`

#### Teste a conexão (opcional)
Antes de prosseguir, confirme que a `DATABASE_URL` está correta e que a porta está acessível. Você pode utilizar o `netcat`:

```bash
nc -zv host port
```

Se preferir, execute um teste rápido com `psql` (caso esteja instalado):

```bash
psql $DATABASE_URL -c '\\q'
```

Se a porta estiver bloqueada ou a string estiver incorreta, a aplicação entrará em modo de armazenamento em memória.

#### Opção B: Armazenamento em Memória
A aplicação funciona automaticamente com fallback para armazenamento em memória se o banco não estiver disponível.


### 5. Execute as migrações
```bash
npm run db:push
```

### 6. Inicie a aplicação
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 📁 Estrutura do Projeto

```
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Páginas da aplicação
│   │   └── lib/         # Utilitários e configurações
├── server/          # Backend Express
│   ├── index.ts     # Servidor principal
│   ├── routes.ts    # Rotas da API
│   ├── db.ts        # Configuração do banco
│   └── storage.ts   # Camada de persistência
├── shared/          # Tipos compartilhados
│   └── schema.ts    # Schemas do banco de dados
└── package.json
```

## 🎨 Identidade Visual

A aplicação segue a identidade visual da Brick Produtora:
- **Cores principais**: Tons terrosos e neutros
- **Tipografia**: Fontes modernas e legíveis
- **Logo**: SVG responsivo integrado
- **Layout**: Design limpo e profissional

## 📱 Responsividade

- **Desktop**: Interface completa com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface otimizada para dispositivos móveis

## 🔐 Segurança

- Validação de dados com Zod
- Sanitização de inputs
- Conexões seguras com banco de dados
- Variáveis de ambiente para credenciais

## 🔧 Solução de Problemas

Se a aplicação não conseguir se conectar ao banco de dados durante o
início, ela exibirá uma mensagem de erro e encerrará o processo. Verifique
se a variável `DATABASE_URL` está correta e se o banco está acessível
antes de reiniciar o servidor.
Ao executar scripts Node ou testes que utilizem `fetch`, defina
`API_BASE_URL` ou `VITE_API_BASE_URL` para evitar erros de URL relativa.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da Brick Produtora. Todos os direitos reservados.

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato com a equipe da Brick Produtora.

---

**Desenvolvido com ❤️ pela Brick Produtora**