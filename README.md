# Reclame Aqui Bot

Bot de IA para Slack que funciona como especialista em processos internos do Reclame Aqui.

## Setup

### 1. Configurar Slack App

1. Acesse https://api.slack.com/apps
2. Clique "Create New App" → "From scratch"
3. Nome: "Reclame Aqui Bot"
4. Selecione seu workspace

### 2. Configurar Permissões

Na aba **"OAuth & Permissions"**:
- Adicione estes **Bot Token Scopes**:
  - `chat:write` - enviar mensagens
  - `app_mentions:read` - responder quando mencionado
  - `channels:history` - ler histórico

### 3. Ativar Eventos

Na aba **"Event Subscriptions"**:
- Ative "Enable Events"
- Adicione "app_mention" em "Subscribe to bot events"

### 4. Instalar no Workspace

Em **"Install App"**, clique em "Install to Workspace"
Você receberá um **Bot Token** (começa com `xoxb-`)

### 5. Configurar Variáveis de Ambiente

Atualize o arquivo `.env` com:
- `SLACK_BOT_TOKEN` - Token obtido acima
- `SLACK_SIGNING_SECRET` - Obtido em "Basic Information"
- `ANTHROPIC_API_KEY` - Sua chave da API Claude

### 6. Deploy no Railway

1. Acesse https://railway.app
2. Clique "Start a New Project"
3. Selecione "Deploy from GitHub"
4. Conecte este repositório
5. Railway fará deploy automático
6. Copie a URL gerada (ex: `https://seu-app.railway.app`)

### 7. Finalizar Configuração no Slack

Em "Event Subscriptions", no campo "Request URL", cole:
