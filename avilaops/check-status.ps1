# Script para Verificar Status do GitHub Pages e Certificado SSL
# Desenvolvido por: Nícolas Ávila
# Versão: 1.0
# Data: Dezembro 2024

# Configurações
$ErrorActionPreference = "Continue"
$repo = "avilaops/avilaops"
$domain = "avilaops.com"
$expectedIPs = @("185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153")

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔍 Verificação de Status - GitHub Pages              ║" -ForegroundColor Cyan
Write-Host "║  Desenvolvido por: Nícolas Ávila                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Limpar token de ambiente
$env:GITHUB_TOKEN = ''

# Variáveis de status
$statusCount = 0
$errorCount = 0
$warningCount = 0

# 1. Verificar configuração do GitHub Pages
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 1. Configuração GitHub Pages" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
try {
    $pagesStatus = gh api repos/$repo/pages 2>&1 | ConvertFrom-Json
    
    Write-Host "   Repository:       " -NoNewline -ForegroundColor Gray
    Write-Host $repo -ForegroundColor White
    
    Write-Host "   Build Status:     " -NoNewline -ForegroundColor Gray
    if ($pagesStatus.status -eq "built") {
        Write-Host "✓ $($pagesStatus.status)" -ForegroundColor Green
        $statusCount++
    } else {
        Write-Host "⏳ $($pagesStatus.status)" -ForegroundColor Yellow
        $warningCount++
    }
    
    Write-Host "   Custom Domain:    " -NoNewline -ForegroundColor Gray
    if ($pagesStatus.cname) {
        Write-Host "✓ $($pagesStatus.cname)" -ForegroundColor Green
        $statusCount++
    } else {
        Write-Host "✗ Não configurado" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host "   Domain State:     " -NoNewline -ForegroundColor Gray
    if ($pagesStatus.protected_domain_state -eq "verified") {
        Write-Host "✓ $($pagesStatus.protected_domain_state)" -ForegroundColor Green
        $statusCount++
    } else {
        Write-Host "✗ $($pagesStatus.protected_domain_state)" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host "   HTTPS Enforced:   " -NoNewline -ForegroundColor Gray
    if ($pagesStatus.https_enforced -eq $true) {
        Write-Host "✓ Ativado" -ForegroundColor Green
        $statusCount++
    } else {
        Write-Host "✗ Desativado" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host "   Build Type:       " -NoNewline -ForegroundColor Gray
    Write-Host $pagesStatus.build_type -ForegroundColor White
    
    Write-Host "   Public:           " -NoNewline -ForegroundColor Gray
    Write-Host $pagesStatus.public -ForegroundColor White
    
    Write-Host "   Source Branch:    " -NoNewline -ForegroundColor Gray
    Write-Host $pagesStatus.source.branch -ForegroundColor White
    
    Write-Host "   Source Path:      " -NoNewline -ForegroundColor Gray
    Write-Host $pagesStatus.source.path -ForegroundColor White
} catch {
    Write-Host "   ✗ Erro ao obter status: $_" -ForegroundColor Red
    $errorCount++
}

Write-Host ""

# 2. Verificar DNS
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🌐 2. Configuração DNS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
try {
    $dnsResults = nslookup $domain 2>&1 | Out-String
    $ips = $dnsResults | Select-String -Pattern "(\d{1,3}\.){3}\d{1,3}" -AllMatches | 
           ForEach-Object { $_.Matches.Value } | 
           Where-Object { $_ -notmatch "^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^127\." } | 
           Select-Object -Unique
    
    $hasCorrectDNS = $false
    $correctIPCount = 0
    
    foreach ($ip in $ips) {
        if ($expectedIPs -contains $ip) {
            $hasCorrectDNS = $true
            $correctIPCount++
            Write-Host "   ✓ " -NoNewline -ForegroundColor Green
            Write-Host "$ip" -NoNewline -ForegroundColor White
            Write-Host " (GitHub Pages)" -ForegroundColor Gray
            $statusCount++
        } else {
            Write-Host "   ⚠️  " -NoNewline -ForegroundColor Yellow
            Write-Host "$ip" -NoNewline -ForegroundColor White
            Write-Host " (Não é IP do GitHub Pages)" -ForegroundColor Yellow
            $warningCount++
        }
    }
    
    if (-not $hasCorrectDNS) {
        Write-Host "   ✗ DNS não está configurado corretamente!" -ForegroundColor Red
        Write-Host "   Configure os IPs: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153" -ForegroundColor Yellow
        $errorCount++
    } else {
        Write-Host "   ℹ️  " -NoNewline -ForegroundColor Cyan
        Write-Host "$correctIPCount de 4 IPs configurados corretamente" -ForegroundColor White
    }
} catch {
    Write-Host "   ✗ Erro ao verificar DNS: $_" -ForegroundColor Red
    $errorCount++
}

Write-Host ""

# 3. Verificar HTTPS
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔒 3. Status HTTPS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Testar HTTP
Write-Host "   HTTP (port 80):   " -NoNewline -ForegroundColor Gray
try {
    $httpTest = Test-NetConnection -ComputerName $domain -Port 80 -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($httpTest) {
        Write-Host "✓ Acessível" -ForegroundColor Green
        $statusCount++
    } else {
        Write-Host "✗ Não acessível" -ForegroundColor Red
        $errorCount++
    }
} catch {
    Write-Host "⚠️  Não testado" -ForegroundColor Yellow
    $warningCount++
}

# Testar HTTPS
Write-Host "   HTTPS (port 443): " -NoNewline -ForegroundColor Gray
try {
    $httpsTest = Test-NetConnection -ComputerName $domain -Port 443 -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($httpsTest) {
        Write-Host "✓ Acessível" -ForegroundColor Green
        $statusCount++
        
        # Tentar verificar o certificado
        try {
            $req = [System.Net.WebRequest]::Create("https://$domain")
            $req.Timeout = 5000
            $req.AllowAutoRedirect = $false
            $response = $req.GetResponse()
            $response.Close()
            
            Write-Host "   Certificado SSL:  " -NoNewline -ForegroundColor Gray
            Write-Host "✓ Válido" -ForegroundColor Green
            $statusCount++
        } catch {
            Write-Host "   Certificado SSL:  " -NoNewline -ForegroundColor Gray
            Write-Host "⚠️  Erro ao validar" -ForegroundColor Yellow
            $warningCount++
        }
    } else {
        Write-Host "✗ Não acessível" -ForegroundColor Red
        Write-Host "   Certificado SSL:  " -NoNewline -ForegroundColor Gray
        Write-Host "⏳ Aguardando provisionamento" -ForegroundColor Yellow
        $errorCount++
    }
} catch {
    Write-Host "⚠️  Não testado" -ForegroundColor Yellow
    $warningCount++
}

Write-Host ""

# 4. Verificar WWW
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🌍 4. Subdomínio WWW" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
try {
    $wwwDNS = nslookup "www.$domain" 2>&1 | Out-String
    
    Write-Host "   CNAME Record:     " -NoNewline -ForegroundColor Gray
    if ($wwwDNS -match "$repo\.github\.io") {
        Write-Host "✓ Configurado corretamente" -ForegroundColor Green
        Write-Host "   Aponta para:      " -NoNewline -ForegroundColor Gray
        Write-Host "$repo.github.io" -ForegroundColor White
        $statusCount++
    } else {
        Write-Host "⚠️  CNAME pode não estar configurado" -ForegroundColor Yellow
        $warningCount++
    }
} catch {
    Write-Host "   ✗ Erro ao verificar WWW: $_" -ForegroundColor Red
    $errorCount++
}

Write-Host ""

# 5. Resumo e Recomendações
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 5. Resumo da Verificação" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$totalChecks = $statusCount + $errorCount + $warningCount
$successRate = if ($totalChecks -gt 0) { [math]::Round(($statusCount / $totalChecks) * 100) } else { 0 }

Write-Host "   ✓ Checks OK:      " -NoNewline -ForegroundColor Gray
Write-Host "$statusCount" -ForegroundColor Green
Write-Host "   ✗ Erros:          " -NoNewline -ForegroundColor Gray
Write-Host "$errorCount" -ForegroundColor Red
Write-Host "   ⚠️  Avisos:         " -NoNewline -ForegroundColor Gray
Write-Host "$warningCount" -ForegroundColor Yellow
Write-Host "   Taxa de Sucesso:  " -NoNewline -ForegroundColor Gray
Write-Host "$successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 50) { "Yellow" } else { "Red" })

Write-Host ""

# 6. Recomendações
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "💡 6. Recomendações" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($pagesStatus.https_enforced -eq $true) {
    Write-Host "   ✅ HTTPS está ativado e funcionando!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   🌐 Seu site: " -NoNewline -ForegroundColor Gray
    Write-Host "https://$domain" -ForegroundColor Green
    Write-Host ""
    Write-Host "   🔗 Próximos passos:" -ForegroundColor Cyan
    Write-Host "      1. Teste no navegador: https://$domain" -ForegroundColor White
    Write-Host "      2. Verifique SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$domain" -ForegroundColor White
} elseif ($pagesStatus.protected_domain_state -eq "verified") {
    Write-Host "   📝 DNS verificado, mas HTTPS não ativado ainda." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   ⚡ Ação recomendada:" -ForegroundColor Cyan
    Write-Host "      Execute: " -NoNewline -ForegroundColor White
    Write-Host ".\enable-https.ps1" -ForegroundColor Green
    Write-Host "      Para tentar ativar automaticamente" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  DNS não verificado ou HTTPS não disponível." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   📖 Ações recomendadas:" -ForegroundColor Cyan
    Write-Host "      1. Aguarde 15-30 minutos para propagação DNS" -ForegroundColor White
    Write-Host "      2. Consulte: HTTPS-TROUBLESHOOTING.md" -ForegroundColor White
    Write-Host "      3. Verifique DNS em: https://www.whatsmydns.net/#A/$domain" -ForegroundColor White
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔗 Links Úteis" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "   GitHub Pages:     https://github.com/$repo/settings/pages" -ForegroundColor White
Write-Host "   DNS Propagation:  https://www.whatsmydns.net/#A/$domain" -ForegroundColor White
Write-Host "   SSL Labs Test:    https://www.ssllabs.com/ssltest/analyze.html?d=$domain" -ForegroundColor White
Write-Host "   GitHub Status:    https://www.githubstatus.com" -ForegroundColor White
Write-Host ""

# Timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Verificação realizada em: $timestamp" -ForegroundColor Gray
Write-Host ""

# Desenvolvido por Nícolas Ávila
# avilaops.com | github.com/avilaops
