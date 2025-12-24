# Script para Verificar Status do GitHub Actions
# Desenvolvido por: Nícolas Ávila

$ErrorActionPreference = "Continue"
$repo = "avilaops/avilaops"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔍 Verificação de GitHub Actions                     ║" -ForegroundColor Cyan
Write-Host "║  Desenvolvido por: Nícolas Ávila                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Limpar token de ambiente
$env:GITHUB_TOKEN = ''

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 Últimas 10 Execuções do Workflow" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $runs = gh run list --repo $repo --limit 10 --json databaseId,displayTitle,status,conclusion,createdAt,event,headBranch | ConvertFrom-Json
    
    if ($runs.Count -eq 0) {
        Write-Host "   ℹ️  Nenhuma execução encontrada" -ForegroundColor Cyan
    } else {
        $failedCount = 0
        $successCount = 0
        $inProgressCount = 0
        
        foreach ($run in $runs) {
            $runId = $run.databaseId
            $title = $run.displayTitle
            $status = $run.status
            $conclusion = $run.conclusion
            $createdAt = $run.createdAt
            $event = $run.event
            $branch = $run.headBranch
            
            Write-Host ""
            Write-Host "   Run ID: " -NoNewline -ForegroundColor Gray
            Write-Host "#$runId" -ForegroundColor White
            
            Write-Host "   Título: " -NoNewline -ForegroundColor Gray
            Write-Host "$title" -ForegroundColor White
            
            Write-Host "   Branch: " -NoNewline -ForegroundColor Gray
            Write-Host "$branch" -ForegroundColor White
            
            Write-Host "   Evento: " -NoNewline -ForegroundColor Gray
            Write-Host "$event" -ForegroundColor White
            
            Write-Host "   Data: " -NoNewline -ForegroundColor Gray
            Write-Host "$createdAt" -ForegroundColor White
            
            Write-Host "   Status: " -NoNewline -ForegroundColor Gray
            if ($status -eq "completed") {
                if ($conclusion -eq "success") {
                    Write-Host "✓ $status ($conclusion)" -ForegroundColor Green
                    $successCount++
                } elseif ($conclusion -eq "failure") {
                    Write-Host "✗ $status ($conclusion)" -ForegroundColor Red
                    $failedCount++
                } else {
                    Write-Host "⚠️  $status ($conclusion)" -ForegroundColor Yellow
                }
            } elseif ($status -eq "in_progress") {
                Write-Host "⏳ $status" -ForegroundColor Cyan
                $inProgressCount++
            } else {
                Write-Host "$status" -ForegroundColor Gray
            }
            
            Write-Host "   ─────────────────────────────────────" -ForegroundColor DarkGray
        }
        
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "📊 Resumo" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "   ✓ Sucesso:      " -NoNewline -ForegroundColor Gray
        Write-Host "$successCount" -ForegroundColor Green
        Write-Host "   ✗ Falha:        " -NoNewline -ForegroundColor Gray
        Write-Host "$failedCount" -ForegroundColor Red
        Write-Host "   ⏳ Em Progresso: " -NoNewline -ForegroundColor Gray
        Write-Host "$inProgressCount" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ✗ Erro ao obter lista de execuções: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Se houver falhas, mostrar detalhes da última
if ($failedCount -gt 0) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "🔍 Detalhes da Última Falha" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    try {
        # Encontrar a primeira execução com falha
        $failedRun = $runs | Where-Object { $_.conclusion -eq "failure" } | Select-Object -First 1
        
        if ($failedRun) {
            $failedRunId = $failedRun.databaseId
            
            Write-Host ""
            Write-Host "   Obtendo logs da execução #$failedRunId..." -ForegroundColor Cyan
            Write-Host ""
            
            # Obter logs
            $logs = gh run view $failedRunId --repo $repo --log 2>&1
            
            # Filtrar linhas com erro
            $errorLines = $logs | Select-String -Pattern "error|failed|Error|ERROR|Failed|FAILED" -Context 2
            
            if ($errorLines) {
                Write-Host "   📝 Erros encontrados:" -ForegroundColor Red
                Write-Host ""
                foreach ($line in $errorLines | Select-Object -First 10) {
                    Write-Host "   $line" -ForegroundColor White
                }
                
                if ($errorLines.Count -gt 10) {
                    Write-Host ""
                    Write-Host "   ... e mais $($errorLines.Count - 10) linhas com erros" -ForegroundColor Gray
                }
            } else {
                Write-Host "   ℹ️  Nenhum erro específico encontrado nos logs" -ForegroundColor Cyan
            }
            
            Write-Host ""
            Write-Host "   🔗 Ver logs completos:" -ForegroundColor Cyan
            Write-Host "   https://github.com/$repo/actions/runs/$failedRunId" -ForegroundColor White
        }
    } catch {
        Write-Host "   ⚠️  Não foi possível obter detalhes da falha: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔗 Links Úteis" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "   Actions: https://github.com/$repo/actions" -ForegroundColor White
Write-Host "   Workflows: https://github.com/$repo/actions/workflows" -ForegroundColor White
Write-Host "   Settings: https://github.com/$repo/settings/pages" -ForegroundColor White
Write-Host ""

# Timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Verificação realizada em: $timestamp" -ForegroundColor Gray
Write-Host ""

# Desenvolvido por Nícolas Ávila
# avilaops.com | github.com/avilaops
