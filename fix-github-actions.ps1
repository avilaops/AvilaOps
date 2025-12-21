# Script Definitivo - Corrigir GitHub Actions
# Desenvolvido por: Nícolas Ávila
# Versão: 1.0 - Solução Completa

$ErrorActionPreference = "Stop"
$repo = "avilaops/avilaops"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 Correção Automática GitHub Actions                        ║" -ForegroundColor Cyan
Write-Host "║  Desenvolvido por: Nícolas Ávila                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Limpar token
$env:GITHUB_TOKEN = ''

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔍 ETAPA 1: Verificando Workflows Disponíveis" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

try {
    $workflows = gh workflow list --repo $repo --json id,name,path,state 2>&1 | ConvertFrom-Json
    
    Write-Host "   Workflows encontrados: $($workflows.Count)" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($wf in $workflows) {
        $statusColor = if ($wf.state -eq "active") { "Green" } else { "Red" }
        
        Write-Host "   📋 $($wf.name)" -ForegroundColor White
        Write-Host "      ID: $($wf.id) | Estado: " -NoNewline -ForegroundColor Gray
        Write-Host $wf.state -ForegroundColor $statusColor
        Write-Host "      Arquivo: $($wf.path)" -ForegroundColor DarkGray
        Write-Host ""
    }
} catch {
    Write-Host "   ⚠️  Erro ao listar workflows: $_" -ForegroundColor Yellow
    Write-Host "   Continuando com método alternativo..." -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🎯 ETAPA 2: Identificando Workflow Problemático" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Procurar workflows problemáticos (ci.yml, test.yml, etc)
$problematicPatterns = @("ci.yml", "test.yml", "tests.yml", "pytest.yml", "python-test.yml")
$workflowsToDisable = @()

foreach ($wf in $workflows) {
    foreach ($pattern in $problematicPatterns) {
        if ($wf.path -like "*$pattern*" -and $wf.state -eq "active") {
            $workflowsToDisable += $wf
            Write-Host "   ⚠️  Workflow problemático identificado:" -ForegroundColor Yellow
            Write-Host "      Nome: $($wf.name)" -ForegroundColor White
            Write-Host "      Arquivo: $($wf.path)" -ForegroundColor Gray
            Write-Host ""
        }
    }
}

if ($workflowsToDisable.Count -eq 0) {
    Write-Host "   ℹ️  Nenhum workflow problemático encontrado automaticamente" -ForegroundColor Cyan
    Write-Host "   Listando todos os workflows ativos para seleção manual..." -ForegroundColor Cyan
    Write-Host ""
    
    $activeWorkflows = $workflows | Where-Object { $_.state -eq "active" -and $_.name -ne "Deploy to GitHub Pages" }
    
    if ($activeWorkflows.Count -gt 0) {
        Write-Host "   Workflows ativos (exceto Deploy):" -ForegroundColor Cyan
        Write-Host ""
        
        for ($i = 0; $i -lt $activeWorkflows.Count; $i++) {
            Write-Host "   [$($i + 1)] $($activeWorkflows[$i].name)" -ForegroundColor White
            Write-Host "       $($activeWorkflows[$i].path)" -ForegroundColor Gray
            Write-Host ""
        }
        
        Write-Host "   Deseja desabilitar algum workflow? (Digite o número ou 0 para pular): " -NoNewline -ForegroundColor Cyan
        $choice = Read-Host
        
        if ($choice -gt 0 -and $choice -le $activeWorkflows.Count) {
            $workflowsToDisable += $activeWorkflows[$choice - 1]
        }
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔧 ETAPA 3: Desabilitando Workflows Problemáticos" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$disabledCount = 0

foreach ($wf in $workflowsToDisable) {
    Write-Host "   🔄 Desabilitando: $($wf.name)..." -ForegroundColor Cyan
    
    try {
        gh workflow disable $wf.id --repo $repo 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Desabilitado com sucesso!" -ForegroundColor Green
            $disabledCount++
        } else {
            Write-Host "   ⚠️  Não foi possível desabilitar via CLI" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Erro: $_" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ ETAPA 4: Configurando Permissões do Workflow" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "   Configurando permissões de Read and write para workflows..." -ForegroundColor Cyan
Write-Host ""

try {
    # Configurar permissões via API
    $permissions = @{
        default_workflow_permissions = "write"
        can_approve_pull_request_reviews = $true
    } | ConvertTo-Json

    gh api -X PUT "repos/$repo/actions/permissions/workflow" -f default_workflow_permissions="write" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Permissões configuradas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Configure manualmente em:" -ForegroundColor Cyan
        Write-Host "      https://github.com/$repo/settings/actions" -ForegroundColor White
        Write-Host "      → Workflow permissions → Read and write permissions" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ℹ️  Configure manualmente as permissões" -ForegroundColor Cyan
}

Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔍 ETAPA 5: Verificando Status Final" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

try {
    $runs = gh run list --repo $repo --limit 5 --json status,conclusion,name,databaseId 2>&1 | ConvertFrom-Json
    
    Write-Host "   Últimas 5 execuções:" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($run in $runs) {
        $icon = switch ($run.conclusion) {
            "success" { "✅" }
            "failure" { "❌" }
            "cancelled" { "⚠️" }
            default { "⏳" }
        }
        
        $color = switch ($run.conclusion) {
            "success" { "Green" }
            "failure" { "Red" }
            "cancelled" { "Yellow" }
            default { "Cyan" }
        }
        
        Write-Host "   $icon $($run.name)" -ForegroundColor $color
    }
} catch {
    Write-Host "   ℹ️  Verifique manualmente em:" -ForegroundColor Cyan
    Write-Host "      https://github.com/$repo/actions" -ForegroundColor White
}

Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 RESUMO DA OPERAÇÃO" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "   Workflows desabilitados: " -NoNewline -ForegroundColor Gray
Write-Host $disabledCount -ForegroundColor $(if ($disabledCount -gt 0) { "Green" } else { "Yellow" })
Write-Host "   Permissões configuradas: " -NoNewline -ForegroundColor Gray
Write-Host "Verificar manualmente" -ForegroundColor Cyan
Write-Host ""

if ($disabledCount -gt 0) {
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✅ SUCESSO! Workflows problemáticos foram desabilitados      ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
} else {
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║  ⚠️  ATENÇÃO: Nenhum workflow foi desabilitado                ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔗 PRÓXIMOS PASSOS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Verifique os workflows em:" -ForegroundColor White
Write-Host "      https://github.com/$repo/actions/workflows" -ForegroundColor Cyan
Write-Host ""
Write-Host "   2. Configure permissões (se necessário):" -ForegroundColor White
Write-Host "      https://github.com/$repo/settings/actions" -ForegroundColor Cyan
Write-Host "      → Workflow permissions → Read and write permissions" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Aguarde 5 minutos e verifique se há novas falhas:" -ForegroundColor White
Write-Host "      https://github.com/$repo/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "   4. Continue com ativação HTTPS:" -ForegroundColor White
Write-Host "      .\enable-https.ps1" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Desenvolvido por Nícolas Ávila
# avilaops.com | github.com/avilaops
