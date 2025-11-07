# Deploy GitHub Actions para Azure Static Web Apps

Este documento explica como configurar o deploy automático da aplicação Next.js no Azure Static Web Apps usando GitHub Actions.

## Pré-requisitos

1. **Conta Azure** com permissões para criar recursos
2. **Repositório GitHub** com o código da aplicação
3. **Azure CLI** instalado localmente (opcional, para setup inicial)

## Configuração do Azure Static Web Apps

### 1. Criar o recurso Azure Static Web Apps

1. Acesse o [Portal Azure](https://portal.azure.com)
2. Clique em "Criar um recurso"
3. Procure por "Static Web Apps" e selecione
4. Preencha as informações:
   - **Subscription**: Sua subscription do Azure
   - **Resource Group**: Crie um novo ou use existente
   - **Name**: vilaops-com-static-app
   - **Plan type**: Free (para desenvolvimento)
   - **Region**: East US 2 ou West Europe
   - **Deployment source**: GitHub

### 2. Conectar ao GitHub

1. Na seção "Deployment details":
   - **GitHub account**: Conecte sua conta GitHub
   - **Organization**: avilaops
   - **Repository**: avilaops-com
   - **Branch**: main

2. Em "Build Details":
   - **Build Presets**: Next.js
   - **App location**: /
   - **Output location**: .next

3. Clique em "Review + create" e depois "Create"

### 3. Obter o Token de Deploy

Após criar o recurso:

1. Vá para o recurso criado no Portal Azure
2. Clique em "Manage deployment token" no menu lateral
3. Copie o token gerado

### 4. Configurar Secrets no GitHub

1. Vá para o repositório no GitHub
2. Acesse **Settings > Secrets and variables > Actions**
3. Clique em "New repository secret"
4. Adicione:
   - **Name**: AZURE_STATIC_WEB_APPS_API_TOKEN
   - **Value**: Cole o token copiado do Azure

## Variáveis de Ambiente (opcional)

Se sua aplicação usa variáveis de ambiente específicas, adicione-as como secrets no GitHub:

1. AZURE_OPENAI_ENDPOINT - Endpoint do Azure OpenAI
2. AZURE_OPENAI_API_KEY - Chave da API do Azure OpenAI
3. MONGODB_URI - String de conexão do MongoDB
4. APPLICATIONINSIGHTS_CONNECTION_STRING - Application Insights

## Como Funciona o Deploy

### Triggers Automáticos

O workflow será executado automaticamente quando:
- **Push para main**: Deploy em produção
- **Pull Request para main**: Deploy de preview
- **Fechamento de PR**: Limpeza do ambiente de preview

### Processo de Deploy

1. **Checkout do código**
2. **Setup do Node.js 20.x**
3. **Instalação de dependências** (
pm ci)
4. **Execução do lint** (continua mesmo com warnings)
5. **Build da aplicação** (
pm run build)
6. **Deploy no Azure Static Web Apps**

### Ambientes

- **Produção**: Branch main -> URL principal do site
- **Preview**: Pull Requests -> URLs temporárias para testes

## URLs de Acesso

Após o primeiro deploy:
- **Produção**: https://<nome-do-recurso>.azurestaticapps.net
- **Custom Domain**: Configure no Portal Azure se necessário

## Monitoramento

1. **Portal Azure**: Logs de deploy e métricas
2. **GitHub Actions**: Logs detalhados de cada execução
3. **Application Insights**: Telemetria da aplicação (se configurado)

## Troubleshooting

### Erro de Build
- Verifique os logs no GitHub Actions
- Confirme se todas as dependências estão no package.json
- Certifique-se de que o comando 
pm run build funciona localmente

### Erro de Deploy
- Verifique se o token do Azure está correto
- Confirme se o recurso Azure Static Web Apps existe
- Verifique as permissões do repositório no GitHub

### Issues Comuns

1. **Build falha**: Problema com dependências ou código
2. **Deploy falha**: Token inválido ou recurso não encontrado
3. **Site não carrega**: Configuração incorreta de rotas

## Comandos Úteis

`ash
# Build local para testar
npm run build

# Instalar Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy manual local (dev/test)
swa deploy .next --env production
`

## Próximos Passos

1.  Criar o recurso Azure Static Web Apps
2.  Configurar o secret no GitHub
3.  Fazer um push para testar o deploy
4.  Configurar domínio customizado (opcional)
5.  Configurar Application Insights (opcional)
6.  Configurar CDN (opcional)
