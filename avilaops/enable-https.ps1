# Script para Ativar HTTPS no GitHub Pages
# Monitora o provisionamento do certificado e ativa automaticamente
# Desenvolvido por: Nícolas Ávila
# Versão: 1.0
# Data: Dezembro 2024

param(
    [int]$MaxAttempts = 60,  # Máximo de tentativas (60 = 30 minutos com intervalo de 30s)
    [int]$IntervalSeconds = 30,  # Intervalo entre tentativas
    [switch]$Verbose  # Modo verbose para debug
)

# Configurações
$ErrorActionPreference = "Continue"
$repo = "avilaops/avilaops"
$domain = "avilaops.com"

Write-Host "🔒 Script para Ativar HTTPS no GitHub Pages" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Desenvolvido por: Nícolas Ávila" -ForegroundColor Gray
Write-Host ""

$attempt = 0
$success = $false
$startTime = Get-Date

# Limpar token de ambiente para usar o do keyring
$env:GITHUB_TOKEN = ''

# Verificar se GitHub CLI está instalado
try {
    $ghVersion = gh --version 2>&1 | Select-Object -First 1
    if ($Verbose) {
        Write-Host "✓ GitHub CLI detectado: $ghVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erro: GitHub CLI (gh) não está instalado!" -ForegroundColor Red
    Write-Host "   Instale com: winget install --id GitHub.cli" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticação
try {
    $authStatus = gh auth status 2>&1 | Out-String
    if ($authStatus -notmatch "Logged in") {
        Write-Host "❌ Erro: Não está autenticado no GitHub!" -ForegroundColor Red
        Write-Host "   Execute: gh auth login" -ForegroundColor Yellow
        exit 1
    }
    if ($Verbose) {
        Write-Host "✓ Autenticação verificada" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Aviso: Não foi possível verificar autenticação" -ForegroundColor Yellow
}

Write-Host "📊 Verificando status atual..." -ForegroundColor Yellow
try {
    $currentStatus = gh api repos/$repo/pages 2>&1 | ConvertFrom-Json
    
    Write-Host "   Repository: " -NoNewline -ForegroundColor Gray
    Write-Host $repo -ForegroundColor White
    Write-Host "   Domain: " -NoNewline -ForegroundColor Gray
    Write-Host $currentStatus.cname -ForegroundColor White
    Write-Host "   Status: " -NoNewline -ForegroundColor Gray
    Write-Host $currentStatus.status -ForegroundColor $(if ($currentStatus.status -eq "built") { "Green" } else { "Yellow" })
    Write-Host "   Domain State: " -NoNewline -ForegroundColor Gray
    Write-Host $currentStatus.protected_domain_state -ForegroundColor $(if ($currentStatus.protected_domain_state -eq "verified") { "Green" } else { "Red" })
    Write-Host "   HTTPS Enforced: " -NoNewline -ForegroundColor Gray
    Write-Host $currentStatus.https_enforced -ForegroundColor $(if ($currentStatus.https_enforced) { "Green" } else { "Red" })
    Write-Host ""

    if ($currentStatus.https_enforced -eq $true) {
        Write-Host "✅ HTTPS já está ativado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Seu site está acessível em: https://$domain" -ForegroundColor Green
        exit 0
    }

    if ($currentStatus.protected_domain_state -ne "verified") {
        Write-Host "⚠️  Aviso: Domínio não está verificado!" -ForegroundColor Yellow
        Write-Host "   Isso pode causar problemas no provisionamento do certificado." -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "❌ Erro ao obter status: $_" -ForegroundColor Red
    Write-Host "   Verifique se o repositório existe e você tem permissões." -ForegroundColor Yellow
    exit 1
}

Write-Host "⏳ Aguardando provisionamento do certificado SSL..." -ForegroundColor Yellow
Write-Host "   Isso pode levar de 5 a 30 minutos." -ForegroundColor Gray
Write-Host "   Tentativas: máximo de $MaxAttempts (intervalo de $IntervalSeconds segundos)" -ForegroundColor Gray
Write-Host "   Tempo estimado: $(($MaxAttempts * $IntervalSeconds) / 60) minutos" -ForegroundColor Gray
Write-Host ""

while ($attempt -lt $MaxAttempts -and -not $success) {
    $attempt++
    $timestamp = Get-Date -Format "HH:mm:ss"
    $elapsed = ((Get-Date) - $startTime).TotalMinutes
    $elapsedFormatted = [math]::Round($elapsed, 1)
    
    Write-Host "[$timestamp] Tentativa $attempt de $MaxAttempts (Tempo decorrido: $elapsedFormatted min)..." -ForegroundColor Cyan
    
    try {
        # Tentar ativar HTTPS
        $result = gh api -X PUT repos/$repo/pages -f cname=$domain -F https_enforced=true 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
            Write-Host "║  ✅ HTTPS ATIVADO COM SUCESSO!        ║" -ForegroundColor Green
            Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
            Write-Host ""
            
            # Verificar status final
            Start-Sleep -Seconds 2
            $finalStatus = gh api repos/$repo/pages 2>&1 | ConvertFrom-Json
            
            Write-Host "📊 Status Final:" -ForegroundColor Cyan
            Write-Host "   URL: " -NoNewline -ForegroundColor Gray
            Write-Host "https://$domain" -ForegroundColor Green
            Write-Host "   HTTPS Enforced: " -NoNewline -ForegroundColor Gray
            Write-Host $finalStatus.https_enforced -ForegroundColor Green
            Write-Host "   Domain State: " -NoNewline -ForegroundColor Gray
            Write-Host $finalStatus.protected_domain_state -ForegroundColor White
            Write-Host "   Status: " -NoNewline -ForegroundColor Gray
            Write-Host $finalStatus.status -ForegroundColor White
            Write-Host ""
            Write-Host "🎉 Seu site agora está seguro e acessível em: https://$domain" -ForegroundColor Green
            Write-Host ""
            Write-Host "🔗 Próximos passos:" -ForegroundColor Cyan
            Write-Host "   1. Teste no navegador: https://$domain" -ForegroundColor White
            Write-Host "   2. Verifique o certificado: https://www.ssllabs.com/ssltest/analyze.html?d=$domain" -ForegroundColor White
            Write-Host "   3. Configure redirecionamento automático (já feito pelo GitHub Pages)" -ForegroundColor White
            Write-Host ""
            
            $success = $true
        } else {
            $errorMessage = $result | Out-String
            
            if ($errorMessage -match "certificate does not exist") {
                Write-Host "   ⏳ Certificado ainda não provisionado. Aguardando..." -ForegroundColor Yellow
                
                # Mostrar barra de progresso estimada
                $progressPercent = [math]::Min(100, ($attempt / $MaxAttempts) * 100)
                $progressBar = "[" + ("=" * [math]::Floor($progressPercent / 5)) + (" " * (20 - [math]::Floor($progressPercent / 5))) + "]"
                Write-Host "   $progressBar $([math]::Round($progressPercent))%" -ForegroundColor Gray
                
            } elseif ($errorMessage -match "Bad credentials") {
                Write-Host "   ❌ Erro de autenticação!" -ForegroundColor Red
                Write-Host "   Execute: gh auth login" -ForegroundColor Yellow
                exit 1
            } elseif ($errorMessage -match "Not Found") {
                Write-Host "   ❌ Repositório ou GitHub Pages não encontrado!" -ForegroundColor Red
                Write-Host "   Verifique se o GitHub Pages está configurado: https://github.com/$repo/settings/pages" -ForegroundColor Yellow
                exit 1
            } else {
                Write-Host "   ⚠️  Erro desconhecido: $($errorMessage.Substring(0, [Math]::Min(100, $errorMessage.Length)))" -ForegroundColor Red
                if ($Verbose) {
                    Write-Host "   Detalhes completos: $errorMessage" -ForegroundColor Gray
                }
            }
            
            if ($attempt -lt $MaxAttempts) {
                Write-Host "   ⏰ Próxima tentativa em $IntervalSeconds segundos..." -ForegroundColor Gray
                Start-Sleep -Seconds $IntervalSeconds
            }
        }
    } catch {
        Write-Host "   ❌ Erro ao tentar ativar HTTPS: $_" -ForegroundColor Red
        
        if ($Verbose) {
            Write-Host "   Stack Trace: $($_.ScriptStackTrace)" -ForegroundColor Gray
        }
        
        if ($attempt -lt $MaxAttempts) {
            Write-Host "   ⏰ Tentando novamente em $IntervalSeconds segundos..." -ForegroundColor Gray
            Start-Sleep -Seconds $IntervalSeconds
        }
    }
}

if (-not $success) {
    $totalTime = [math]::Round(((Get-Date) - $startTime).TotalMinutes, 1)
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║  ⚠️  Não foi possível ativar o HTTPS automaticamente  ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⏱️  Tempo total de execução: $totalTime minutos" -ForegroundColor Gray
    Write-Host "🔄 Tentativas realizadas: $attempt de $MaxAttempts" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📝 Possíveis soluções:" -ForegroundColor Cyan
    Write-Host "   1. Aguardar mais tempo (até 24 horas para provisionamento completo)" -ForegroundColor White
    Write-Host "   2. Executar novamente este script: .\enable-https.ps1" -ForegroundColor White
    Write-Host "   3. Ativar manualmente em: https://github.com/$repo/settings/pages" -ForegroundColor White
    Write-Host "   4. Verificar o DNS: nslookup $domain" -ForegroundColor White
    Write-Host "   5. Consultar o guia: HTTPS-TROUBLESHOOTING.md" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Links úteis:" -ForegroundColor Cyan
    Write-Host "   - Status do DNS: https://www.whatsmydns.net/#A/$domain" -ForegroundColor White
    Write-Host "   - GitHub Status: https://www.githubstatus.com" -ForegroundColor White
    Write-Host "   - Suporte GitHub: https://support.github.com" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Dica: O certificado pode levar até 24h para ser provisionado." -ForegroundColor Yellow
    Write-Host "         Execute este script novamente mais tarde." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Desenvolvido por Nícolas Ávila
# avilaops.com | github.com/avilaops
