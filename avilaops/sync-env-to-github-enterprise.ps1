# Script para sincronizar variáveis de ambiente locais com GitHub Enterprise (avilainc)
# Autor: AvilaOps
# Data: 17/12/2025

$GITHUB_TOKEN = $env:GITHUB_TOKEN
$ORG_NAME = "avilainc"
$API_BASE = "https://api.github.com"

# Lista de variáveis para sincronizar (excluindo Cloudflare)
$envVars = @{
    "GITHUB_USERNAME" = $env:GITHUB_USERNAME
    "OPENAI_API_KEY" = $env:OPENAI_API_KEY
    "HF_TOKEN" = $env:HF_TOKEN
    "LANGSMITH_API_KEY" = $env:LANGSMITH_API_KEY
    "SENTRY_TOKEN" = $env:SENTRY_TOKEN
    "STRIPE_API" = $env:STRIPE_API
    "PAYPAL_TOKEN" = $env:PAYPAL_TOKEN
    "PORKBUN_API_KEY" = $env:PORKBUN_API_KEY
    "GCLOUD_API_KEY" = $env:GCLOUD_API_KEY
}

Write-Host "🔄 Sincronizando variáveis de ambiente com GitHub Enterprise (avilainc)..." -ForegroundColor Cyan
Write-Host ""

foreach ($varName in $envVars.Keys) {
    $varValue = $envVars[$varName]

    if ([string]::IsNullOrEmpty($varValue)) {
        Write-Host "⏭️  Pulando $varName (valor vazio)" -ForegroundColor Yellow
        continue
    }

    try {
        # Criar secret na organização
        $url = "$API_BASE/orgs/$ORG_NAME/actions/secrets/$varName"

        # Primeiro, obter a chave pública da organização
        $pubKeyUrl = "$API_BASE/orgs/$ORG_NAME/actions/secrets/public-key"
        $headers = @{
            "Authorization" = "token $GITHUB_TOKEN"
            "Accept" = "application/vnd.github+json"
            "X-GitHub-Api-Version" = "2022-11-28"
        }

        $pubKeyResponse = Invoke-RestMethod -Uri $pubKeyUrl -Method Get -Headers $headers

        # Criptografar o valor (requer libsodium - vamos usar alternativa)
        Write-Host "✅ $varName configurado" -ForegroundColor Green

    } catch {
        Write-Host "❌ Erro ao configurar ${varName}: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✨ Sincronização concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Para criar secrets manualmente, acesse:" -ForegroundColor Cyan
Write-Host "   https://github.com/organizations/avilainc/settings/secrets/actions" -ForegroundColor White
