# Guia de Deploy - Gerador de Ordem do Dia

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

#### Preparação
1. Faça o build da aplicação:
```bash
npm run build
```

2. Crie o arquivo `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

#### Deploy
1. Instale a CLI do Vercel: `npm i -g vercel`
2. Execute: `vercel`
3. Configure as variáveis de ambiente no dashboard do Vercel

### 2. Railway

1. Conecte o repositório no [Railway](https://railway.app)
2. Configure a variável `DATABASE_URL`
3. No console do Railway, execute `npm run db:push` para criar as tabelas
4. Railway fará o deploy automaticamente

### 3. Render

1. Conecte o repositório no [Render](https://render.com)
2. Configure as variáveis de ambiente
3. Use o comando build: `npm run build`
4. Use o comando start: `npm start`

### 4. Heroku

1. Crie um app no Heroku
2. Configure a variável `DATABASE_URL`
3. Deploy via Git:
```bash
git remote add heroku https://git.heroku.com/seu-app.git
git push heroku main
```

## 🔧 Variáveis de Ambiente Necessárias

```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

## 📋 Checklist Pré-Deploy

- [ ] Testado localmente com `npm run build`
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] Dependências atualizadas
- [ ] Logs de erro verificados
- [ ] Performance testada

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de usar a URL do Connection Pooling
- Codifique caracteres especiais na senha

### Build Falhando
- Verifique se todas as dependências estão instaladas
- Execute `npm run build` localmente primeiro
- Verifique os logs de build para erros específicos

### App não Inicia
- Verifique se a porta está configurada corretamente
- Confirme que o arquivo `server/index.ts` existe
- Verifique os logs do servidor

## 📊 Monitoramento

Após o deploy, monitore:
- Logs de erro do servidor
- Performance da aplicação
- Conexões com banco de dados
- Uso de recursos (CPU/Memória)