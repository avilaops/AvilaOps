# Script para Desabilitar Workflow CI/CD Problemático
# Desenvolvido por: Nícolas Ávila

$ErrorActionPreference = "Continue"
$repo = "avilaops/avilaops"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔧 Desabilitar Workflow CI/CD                        ║" -ForegroundColor Cyan
Write-Host "║  Desenvolvido por: Nícolas Ávila                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Limpar token de ambiente
$env:GITHUB_TOKEN = ''

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📋 Listando Workflows Disponíveis" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $workflows = gh workflow list --repo $repo --json id,name,path,state | ConvertFrom-Json
    
    Write-Host ""
    foreach ($wf in $workflows) {
        Write-Host "   ID: " -NoNewline -ForegroundColor Gray
        Write-Host $wf.id -NoNewline -ForegroundColor White
        Write-Host " | " -NoNewline
        Write-Host "Nome: " -NoNewline -ForegroundColor Gray
        Write-Host $wf.name -NoNewline -ForegroundColor White
        Write-Host " | " -NoNewline
        Write-Host "Estado: " -NoNewline -ForegroundColor Gray
        
        if ($wf.state -eq "active") {
            Write-Host $wf.state -ForegroundColor Green
        } else {
            Write-Host $wf.state -ForegroundColor Red
        }
        
        Write-Host "   Arquivo: " -NoNewline -ForegroundColor Gray
        Write-Host $wf.path -ForegroundColor DarkGray
        Write-Host ""
    }
} catch {
    Write-Host "   ✗ Erro ao listar workflows: $_" -ForegroundColor Red
    exit 1
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔧 Desabilitar Workflow CI/CD" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Procurar workflow de CI
$ciWorkflow = $workflows | Where-Object { $_.path -like "*ci.yml" }

if ($ciWorkflow) {
    Write-Host ""
    Write-Host "   Encontrado workflow: " -NoNewline -ForegroundColor Cyan
    Write-Host $ciWorkflow.name -ForegroundColor White
    Write-Host "   Arquivo: " -NoNewline -ForegroundColor Gray
    Write-Host $ciWorkflow.path -ForegroundColor White
    Write-Host ""
    
    $confirm = Read-Host "   Deseja desabilitar este workflow? (S/N)"
    
    if ($confirm -eq "S" -or $confirm -eq "s") {
        try {
            Write-Host ""
            Write-Host "   Desabilitando workflow..." -ForegroundColor Cyan
            
            gh workflow disable $ciWorkflow.id --repo $repo
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "   ✓ Workflow desabilitado com sucesso!" -ForegroundColor Green
                Write-Host ""
                Write-Host "   ℹ️  O workflow não será mais executado automaticamente" -ForegroundColor Cyan
                Write-Host "   ℹ️  Você pode reabilitá-lo a qualquer momento em:" -ForegroundColor Cyan
                Write-Host "      https://github.com/$repo/actions" -ForegroundColor White
            } else {
                Write-Host ""
                Write-Host "   ✗ Erro ao desabilitar workflow" -ForegroundColor Red
            }
        } catch {
            Write-Host ""
            Write-Host "   ✗ Erro: $_" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "   ℹ️  Operação cancelada" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "   ℹ️  Nenhum workflow ci.yml encontrado" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   O workflow problemático pode ter outro nome." -ForegroundColor Yellow
    Write-Host "   Desabilite manualmente em:" -ForegroundColor Yellow
    Write-Host "   https://github.com/$repo/actions/workflows" -ForegroundColor White
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔗 Links Úteis" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "   Workflows: https://github.com/$repo/actions/workflows" -ForegroundColor White
Write-Host "   Actions: https://github.com/$repo/actions" -ForegroundColor White
Write-Host ""

# Desenvolvido por Nícolas Ávila
# avilaops.com | github.com/avilaops
