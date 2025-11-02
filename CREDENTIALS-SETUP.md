# 🔐 Guia de Configuração - Azure AI Credentials

## Passo 1: Azure OpenAI / AI Foundry

### Opção A: Usar Azure AI Foundry (Recomendado)

1. **Acessar Portal Azure:**
   ```
   https://portal.azure.com
   ```

2. **Navegar até AI Foundry:**
   - Buscar: "Azure AI Foundry"
   - Ou acessar: https://ai.azure.com

3. **Criar/Selecionar Project:**
   - Se não tiver: "Create new project"
   - Nome sugerido: `avilaops-terminal`
   - Region: `East US` (recomendado)

4. **Deploy Model:**
   - No project > "Deployments" > "Deploy model"
   - Selecionar: **gpt-4o-mini** ou **gpt-4.1-mini**
   - Deployment name: `gpt-4o-mini-deployment`
   - Clique em "Deploy"

5. **Obter Credentials:**
   - Após deploy > "View in Playground"
   - Clicar em "</> View code"
   - Copiar:
     - **Endpoint:** `https://xxxx.openai.azure.com`
     - **API Key:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
     - **Model Name:** `gpt-4o-mini-deployment` (ou nome que você escolheu)

### Opção B: Usar Azure OpenAI Service Direto

1. **Criar Azure OpenAI Resource:**
   ```bash
   # Via CLI (se preferir)
   az cognitiveservices account create \
     --name avilaops-openai \
     --resource-group rg-avilaops \
     --kind OpenAI \
     --sku S0 \
     --location eastus
   ```

2. **Deploy Model no Portal:**
   - Portal > Azure OpenAI Resource > "Model deployments"
   - "Create new deployment"
   - Model: `gpt-4o-mini` (recomendado - mais barato)
   - Deployment name: `gpt-4o-mini`

3. **Obter Keys:**
   - Resource > "Keys and Endpoint"
   - Copiar:
     - **Endpoint:** `https://avilaops-openai.openai.azure.com`
     - **Key 1:** (copiar a chave completa)

---

## Passo 2: Azure Cosmos DB

### Já tem o Bicep pronto! Vamos criar:

```bash
# 1. Criar resource group (se não tiver)
az group create --name rg-avilaops --location eastus

# 2. Deploy Cosmos DB usando seu Bicep
cd infra
az deployment group create \
  --resource-group rg-avilaops \
  --template-file azure-ai-resources.bicep \
  --parameters tenantId=$(az account show --query tenantId -o tsv)

# 3. Pegar credentials
az cosmosdb keys list \
  --name cosmos-avilaops \
  --resource-group rg-avilaops \
  --type keys \
  --query primaryMasterKey -o tsv
```

### Ou pelo Portal:

1. **Portal Azure > Cosmos DB:**
   - Buscar: "Azure Cosmos DB"
   - Se não tiver: "Create" > "Azure Cosmos DB for NoSQL"

2. **Configuração:**
   - Account name: `cosmos-avilaops`
   - API: **NoSQL** (não MongoDB!)
   - Region: `East US`
   - Capacity mode: **Serverless** (grátis até 25GB)

3. **Criar Database & Container:**
   - Após criar > "Data Explorer"
   - "New Database" > Nome: `avilaops`
   - "New Container":
     - Database: `avilaops`
     - Container: `memory`
     - Partition key: `/userId`

4. **Obter Keys:**
   - Cosmos DB > "Keys"
   - Copiar:
     - **URI:** `https://cosmos-avilaops.documents.azure.com:443/`
     - **Primary Key:** (copiar chave completa)

---

## Passo 3: Configurar .env.local

Abra o arquivo `.env.local` (já criado) e preencha:

```bash
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Azure OpenAI / AI Foundry Configuration
AZURE_OPENAI_ENDPOINT=https://SEU-ENDPOINT-AQUI.openai.azure.com
AZURE_OPENAI_API_KEY=SUA-CHAVE-AQUI-32-CARACTERES
AZURE_OPENAI_MODEL=gpt-4o-mini

# Azure Cosmos DB Configuration  
AZURE_COSMOS_ENDPOINT=https://SEU-COSMOS-AQUI.documents.azure.com:443/
AZURE_COSMOS_KEY=SUA-CHAVE-COSMOS-AQUI-64-CARACTERES
```

---

## Passo 4: Testar

```bash
# 1. Reiniciar servidor (se estiver rodando)
# Ctrl+C no terminal e depois:
npm run dev

# 2. Testar no browser
# http://localhost:3000

# 3. No terminal, testar AI:
ask o que é DevOps?
```

Se funcionar, você verá uma resposta do AI! 🎉

---

## 🆘 Troubleshooting

### "Azure OpenAI not configured"
- Verificar se `.env.local` existe
- Verificar se variáveis estão preenchidas (sem espaços extras)
- Reiniciar servidor após editar `.env.local`

### "Failed to get AI response"
- Verificar endpoint (deve terminar em `.openai.azure.com`)
- Verificar API key está correta
- Confirmar modelo está deployed

### "Error fetching conversation history"
- Verificar Cosmos DB URI e Key
- Confirmar database `avilaops` e container `memory` existem
- Verificar partition key é `/userId`

---

## 💡 Dicas

### Free Tier Availability:

**Azure OpenAI:**
- Não tem free tier gratuito permanente
- Mas trial de $200 créditos por 30 dias
- Depois: ~$0.0002 por request (barato!)

**Cosmos DB Serverless:**
- ✅ **GRÁTIS até 25GB storage**
- ✅ **GRÁTIS primeiros 1000 RU/s**
- Perfeito para MVP!

### Alternativa para Testar SEM Azure:

Se quiser testar AI **sem criar recursos Azure agora**, posso criar um **mock mode** que simula respostas!

---

**Precisa de ajuda em algum passo específico?** Posso:
1. Gerar comandos CLI completos com seus valores
2. Criar script de setup automatizado
3. Implementar mock mode para testar sem Azure
4. Outra coisa?
