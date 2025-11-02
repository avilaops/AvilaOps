# 🤖 AI Integration Guide - AvilaOps Terminal

## Overview

O Terminal Interativo agora possui integração com **Azure OpenAI** (GPT-4.1-mini) e memória persistente no **Cosmos DB**.

### Features

✅ **Comando `ask`** - Perguntas naturais sobre DevOps/Cloud/Azure  
✅ **Context Awareness** - AI lembra das últimas 5 mensagens  
✅ **Persistent Memory** - Histórico salvo por usuário no Cosmos DB  
✅ **Session Isolation** - Cada visitante tem contexto próprio  
✅ **Error Handling** - Graceful degradation se AI não estiver configurada  

## Setup

### 1. Provisionar Recursos Azure

#### Azure AI Foundry

```bash
# Criar resource group
az group create --name rg-avilaops-ai --location eastus

# Criar AI Foundry hub
az ml workspace create \
  --name avilaops-ai-hub \
  --resource-group rg-avilaops-ai \
  --location eastus \
  --kind hub

# Criar AI Foundry project
az ml workspace create \
  --name avilaops-terminal \
  --resource-group rg-avilaops-ai \
  --location eastus \
  --kind project \
  --hub-id /subscriptions/<SUB_ID>/resourceGroups/rg-avilaops-ai/providers/Microsoft.MachineLearningServices/workspaces/avilaops-ai-hub
```

#### Deploy Model (Portal)

1. Portal Azure > AI Foundry > avilaops-terminal
2. Model catalog > **gpt-4.1-mini** (recomendado: custo-benefício)
3. Deploy > Create deployment
4. Nome: `gpt-4o-mini-deployment`
5. Copiar **Endpoint** e **API Key**

#### Cosmos DB (usar Bicep existente)

```bash
# Já criado em azure-ai-resources.bicep
az deployment group create \
  --resource-group rg-avilaops-ai \
  --template-file infra/azure-ai-resources.bicep \
  --parameters tenantId=<YOUR_TENANT_ID>

# Pegar keys
az cosmosdb keys list \
  --name cosmos-avilaops \
  --resource-group rg-avilaops-ai \
  --type connection-strings
```

### 2. Configurar Ambiente Local

Copiar `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Editar `.env.local` com valores reais:

```bash
# Azure OpenAI / AI Foundry
AZURE_OPENAI_ENDPOINT=https://avilaops-ai-foundry-xxxxxxx.openai.azure.com
AZURE_OPENAI_API_KEY=your-32-char-api-key-here
AZURE_OPENAI_MODEL=gpt-4.1-mini

# Cosmos DB
AZURE_COSMOS_ENDPOINT=https://cosmos-avilaops.documents.azure.com:443/
AZURE_COSMOS_KEY=your-64-char-primary-key-here==
```

### 3. Testar Localmente

```bash
# Instalar dependências (já feito)
npm install

# Rodar dev server
npm run dev

# Testar no terminal (http://localhost:3000)
ask qual a diferença entre Kubernetes e Docker Swarm?
ask como implementar CI/CD com Azure DevOps?
ask o que é observability?
```

### 4. Deploy para Azure

#### Static Web Apps (via secrets)

GitHub Secrets necessários:

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_MODEL`
- `AZURE_COSMOS_ENDPOINT`
- `AZURE_COSMOS_KEY`

Atualizar `.github/workflows/azure-static-web-apps.yml`:

```yaml
env:
  AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
  AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
  AZURE_OPENAI_MODEL: ${{ secrets.AZURE_OPENAI_MODEL }}
  AZURE_COSMOS_ENDPOINT: ${{ secrets.AZURE_COSMOS_ENDPOINT }}
  AZURE_COSMOS_KEY: ${{ secrets.AZURE_COSMOS_KEY }}
```

#### Azure DevOps (via variables)

Pipeline variables:

- `AZURE_OPENAI_ENDPOINT` (secret)
- `AZURE_OPENAI_API_KEY` (secret)
- `AZURE_OPENAI_MODEL` (text: `gpt-4.1-mini`)
- `AZURE_COSMOS_ENDPOINT` (secret)
- `AZURE_COSMOS_KEY` (secret)

## Usage

### Terminal Commands

```bash
# Mostrar ajuda
help

# Perguntar sobre DevOps
ask como automatizar deploys com Terraform?

# Perguntar sobre Cloud
ask quais são as vantagens do Azure Kubernetes Service?

# Perguntar sobre Observability
ask como implementar distributed tracing?

# Context awareness (AI lembra conversa anterior)
ask e quais ferramentas usar?
ask pode detalhar mais?
```

### API Endpoint

Também pode chamar diretamente:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Como implementar CI/CD?",
    "userId": "user-123",
    "conversationId": "terminal"
  }'
```

Response:

```json
{
  "message": "CI/CD (Continuous Integration/Continuous Deployment) envolve...",
  "conversationId": "terminal",
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 85,
    "total_tokens": 205
  }
}
```

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  Terminal   │─────▶│  API Route   │─────▶│ Azure OpenAI │
│ (Frontend)  │      │  /api/chat   │      │  GPT-4.1-mini│
└─────────────┘      └──────────────┘      └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Cosmos DB   │
                     │   (Memory)   │
                     └──────────────┘
```

### Data Flow

1. **User** digita `ask <pergunta>` no Terminal
2. **Frontend** envia POST para `/api/chat`
3. **API Route**:
   - Busca histórico do Cosmos DB (últimas 5 msgs)
   - Monta contexto com system prompt + histórico + pergunta
   - Chama Azure OpenAI Chat Completions
   - Salva pergunta + resposta no Cosmos DB
4. **Response** volta para Terminal e exibe

### System Prompt

AI é configurada como **especialista AvilaOps**:

```
Você é o assistente AI da AvilaOps, especialista em:
- DevOps Engineering (CI/CD, GitOps, IaC)
- Cloud Architecture (Azure, multi-cloud, serverless)
- Observability (monitoring, logging, tracing)
- Security (DevSecOps, compliance)
- Automation (Terraform, Ansible, Bicep)

Estilo: Técnico mas acessível, específico, max 150 palavras
Foco: DevOps/Cloud/Azure
```

## Cost Estimation

### Azure OpenAI (gpt-4.1-mini)

- **Preço**: $0.70 / 1M tokens
- **Consumo médio**: 200 tokens/pergunta (prompt + completion)
- **Custo por pergunta**: $0.00014 (menos de 1 centavo)
- **1000 perguntas/mês**: ~$0.14

### Cosmos DB (Free Tier)

- **1000 RU/s grátis** (suficiente para milhares de queries)
- **25 GB storage grátis**
- **Custo adicional**: $0 até ultrapassar free tier

### Total Estimado

- **MVP (1000 users/mês, 5 perguntas cada)**: ~$0.70/mês
- **Escala (10k users/mês)**: ~$7/mês
- **Enterprise (100k users/mês)**: ~$70/mês

## Monitoring

### Logs

```bash
# API Route logs (server)
tail -f /var/log/swa/api-chat.log

# Cosmos DB metrics
az cosmosdb show --name cosmos-avilaops --resource-group rg-avilaops-ai
```

### Metrics to Track

- **Request Count**: Quantas perguntas/dia
- **Latency**: Tempo médio de resposta
- **Token Usage**: Custos acumulados
- **Error Rate**: % de falhas
- **Top Questions**: Perguntas mais comuns

### Application Insights

Integrar `@azure/monitor` para telemetria:

```typescript
import { ApplicationInsights } from "@azure/monitor";

const insights = new ApplicationInsights({ connectionString: process.env.APPINSIGHTS_CONNECTION_STRING });
insights.trackEvent({ name: "AIQuestionAsked", properties: { question, userId } });
```

## Troubleshooting

### "Azure OpenAI not configured"

- Verificar `.env.local` tem `AZURE_OPENAI_ENDPOINT` e `AZURE_OPENAI_API_KEY`
- Verificar secrets no GitHub/Azure DevOps
- Confirmar variáveis no Static Web Apps Configuration

### "Failed to get AI response"

- Verificar endpoint está correto (deve terminar em `.openai.azure.com`)
- Verificar API key é válida (regenerar no Portal se necessário)
- Confirmar modelo está deployed no AI Foundry

### "Error fetching conversation history"

- Verificar Cosmos DB endpoint e key
- Confirmar database `avilaops` e container `memory` existem
- Verificar partition key é `/userId`

### Rate Limits

Azure OpenAI Free Tier:

- **20 RPM** (requests per minute)
- **300K TPM** (tokens per minute)

Se atingir limite, upgrade para Standard:

```bash
az cognitiveservices account update \
  --name avilaops-openai \
  --resource-group rg-avilaops-ai \
  --sku S0
```

## Security Best Practices

### ✅ Implementado

- API keys em env vars (não commitadas)
- Cosmos DB com RBAC (opcional)
- User ID gerado via `crypto.randomUUID()` (anônimo)
- Rate limiting via Azure (20 RPM grátis)

### 🔜 Melhorias Futuras

- **Input Sanitization**: Validar perguntas (max length, no injection)
- **Rate Limiting Frontend**: Limitar perguntas/usuário (ex: 10/hora)
- **Content Moderation**: Azure Content Safety API
- **Authentication**: Integrar com Azure AD B2C
- **Audit Logs**: Registrar todas as perguntas

## Next Steps

### Features Adicionais

1. **Streaming Responses** - Respostas em tempo real (SSE)
2. **Voice Input** - Speech-to-Text para perguntas
3. **Multimodal** - Aceitar imagens de arquitetura
4. **RAG** - Buscar documentação interna antes de responder
5. **Analytics Dashboard** - Métricas de uso e top questions

### Performance

1. **Caching** - Redis para perguntas repetidas
2. **Pre-warming** - Respostas pré-geradas para FAQ
3. **Model Upgrade** - Testar gpt-4.1 full (mais caro mas melhor)

---

**Criado para AvilaOps** 🚀  
AI Integration: Azure OpenAI + Cosmos DB  
Status: ✅ Ready for MVP
