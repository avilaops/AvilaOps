# Script de Monitoramento Automático HTTPS
# Desenvolvido por: Nícolas Ávila
# Executa automaticamente até ativar HTTPS

$ErrorActionPreference = "Continue"
$repo = "avilaops/avilaops"
$domain = "avilaops.com"
$maxAttempts = 30  # 30 minutos máximo
$attempt = 0
$success = $false

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔄 MONITORAMENTO AUTOMÁTICO HTTPS                          ║" -ForegroundColor Cyan
Write-Host "║  Desenvolvido por: Nícolas Ávila                            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "⏰ Iniciando monitoramento automático..." -ForegroundColor Yellow
Write-Host "   Máximo: $maxAttempts tentativas (aprox. 30 minutos)" -ForegroundColor Gray
Write-Host "   Intervalo: 60 segundos entre tentativas" -ForegroundColor Gray
Write-Host ""

$env:GITHUB_TOKEN = ''

while ($attempt -lt $maxAttempts -and -not $success) {
    $attempt++
    $timestamp = Get-Date -Format "HH:mm:ss"
    $elapsed = [math]::Round(($attempt * 60) / 60, 1)  # minutos decorridos

    Write-Host "[$timestamp] Tentativa $attempt de $maxAttempts ($elapsed min)" -ForegroundColor Cyan

    try {
        # Tentar ativar HTTPS
        $result = gh api -X PUT repos/$repo/pages -f cname=$domain -F https_enforced=true 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
            Write-Host "║  ✅ HTTPS ATIVADO COM SUCESSO!                              ║" -ForegroundColor Green
            Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
            Write-Host ""

            # Verificar status final
            Start-Sleep -Seconds 3
            $finalStatus = gh api repos/$repo/pages | ConvertFrom-Json

            Write-Host "📊 Status Final:" -ForegroundColor Cyan
            Write-Host "   URL: https://$domain" -ForegroundColor Green
            Write-Host "   HTTPS Enforced: $($finalStatus.https_enforced)" -ForegroundColor Green
            Write-Host "   Domain State: $($finalStatus.protected_domain_state)" -ForegroundColor White
            Write-Host ""

            Write-Host "🎉 Parabéns! HTTPS ativado automaticamente!" -ForegroundColor Green
            Write-Host "🌐 Seu site está seguro: https://$domain" -ForegroundColor Green
            Write-Host ""

            $success = $true
        } else {
            $errorMessage = $result | Out-String

            if ($errorMessage -match "certificate does not exist") {
                Write-Host "   ⏳ Certificado ainda não provisionado" -ForegroundColor Yellow

                # Barra de progresso
                $progressPercent = [math]::Min(100, ($attempt / $maxAttempts) * 100)
                $progressBar = "[" + ("=" * [math]::Floor($progressPercent / 5)) + (" " * (20 - [math]::Floor($progressPercent / 5))) + "]"
                Write-Host "   $progressBar $([math]::Round($progressPercent))%" -ForegroundColor Gray

                if ($attempt -lt $maxAttempts) {
                    Write-Host "   ⏰ Próxima tentativa em 60 segundos..." -ForegroundColor Gray
                    Start-Sleep -Seconds 60
                }
            } else {
                Write-Host "   ❌ Erro inesperado: $($errorMessage.Substring(0, [Math]::Min(100, $errorMessage.Length)))" -ForegroundColor Red
                break
            }
        }
    } catch {
        Write-Host "   ❌ Erro de conexão: $_" -ForegroundColor Red
        Write-Host "   ⏰ Tentando novamente em 60 segundos..." -ForegroundColor Gray
        Start-Sleep -Seconds 60
    }
}

if (-not $success) {
    $totalTime = [math]::Round(($attempt * 60) / 60, 1)

    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║  ⚠️  MONITORAMENTO CONCLUÍDO SEM SUCESSO                    ║" -ForegroundColor Yellow
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host ""

    Write-Host "⏱️  Tempo total: $totalTime minutos" -ForegroundColor Gray
    Write-Host "🔄 Tentativas realizadas: $attempt" -ForegroundColor Gray
    Write-Host ""

    Write-Host "📝 Possíveis soluções:" -ForegroundColor Cyan
    Write-Host "   1. Aguardar mais tempo (até 24 horas)" -ForegroundColor White
    Write-Host "   2. Verificar status: .\check-status.ps1" -ForegroundColor White
    Write-Host "   3. Executar novamente: .\enable-https.ps1" -ForegroundColor White
    Write-Host "   4. Ativar manualmente: https://github.com/$repo/settings/pages" -ForegroundColor White
    Write-Host ""

    Write-Host "💡 Dica: O certificado pode levar até 24h para ser provisionado." -ForegroundColor Yellow
    Write-Host "         Execute este script novamente mais tarde." -ForegroundColor Yellow
    Write-Host ""

    exit 1
}

# Desenvolvido por Nícolas Ávila
# avilaops.com | github.com/avilaops