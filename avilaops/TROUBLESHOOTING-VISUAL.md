# 🔧 Guia Visual de Troubleshooting HTTPS

**Desenvolvido por:** Nícolas Ávila  
**Versão:** 1.0  
**Data:** Dezembro 2024

---

## 🎯 Diagnóstico Rápido

### Execute este comando primeiro:
```powershell
.\check-status.ps1
```

---

## 🌳 Árvore de Decisão

```
┌─────────────────────────────────────────┐
│   Executar .\check-status.ps1          │
└─────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ DNS OK?       │
         └───────────────┘
          │           │
      SIM │           │ NÃO
          │           │
          ▼           ▼
   ┌──────────┐  ┌──────────────────┐
   │Domain    │  │Configurar DNS    │
   │Verified? │  │nos IPs corretos  │
   └──────────┘  │185.199.108.153   │
      │      │   │185.199.109.153   │
   SIM│     NÃO  │185.199.110.153   │
      │      │   │185.199.111.153   │
      │      │   └──────────────────┘
      │      │           │
      │      └───────────┤
      │                  │
      │         ┌────────▼────────┐
      │         │ Aguardar 15-30  │
      │         │ minutos         │
      │         └─────────────────┘
      │                  │
      └──────────────────┤
                         │
                         ▼
                  ┌────────────┐
                  │HTTPS       │
                  │Enforced?   │
                  └────────────┘
                   │          │
                SIM│         NÃO
                   │          │
                   ▼          ▼
            ┌─────────┐  ┌──────────────┐
            │  ✅      │  │.\enable-https│
            │ PRONTO! │  │.ps1          │
            └─────────┘  └──────────────┘
```

---

## 📊 Matriz de Problemas e Soluções

| Sintoma | Causa Provável | Solução | Comando |
|---------|----------------|---------|---------|
| DNS não resolve | IPs não configurados | Configurar A records | `nslookup avilaops.com` |
| Domain not verified | DNS não propagou | Aguardar 15-30 min | `.\check-status.ps1` |
| Certificate does not exist | Aguardando Let's Encrypt | Aguardar e tentar novamente | `.\enable-https.ps1` |
| Bad credentials | Token expirado | Re-autenticar | `gh auth login` |
| 404 Not Found | Pages não configurado | Configurar GitHub Pages | Abrir Settings → Pages |
| HTTPS não ativa | Certificado não pronto | Executar script | `.\enable-https.ps1` |
| Timeout na conexão | Firewall/Proxy | Verificar rede | `Test-NetConnection avilaops.com -Port 443` |

---

## 🚦 Status Indicators

### ✅ Tudo OK (Verde)
```
✓ DNS configurado corretamente
✓ Domain state: verified
✓ HTTPS enforced: true
✓ Certificado SSL válido
```
**Ação:** Nenhuma necessária! 🎉

---

### ⚠️ Em Progresso (Amarelo)
```
✓ DNS configurado corretamente
✓ Domain state: verified
✗ HTTPS enforced: false
⏳ Certificado em provisionamento
```
**Ação:** Execute `.\enable-https.ps1` e aguarde

---

### ❌ Problema (Vermelho)
```
✗ DNS não configurado
✗ Domain state: pending
✗ HTTPS enforced: false
✗ Certificado não existe
```
**Ação:** Configure DNS e aguarde 30 minutos

---

## 🔍 Checklist de Verificação

### Antes de Ativar HTTPS:

- [ ] **DNS configurado**
  ```powershell
  nslookup avilaops.com
  # Deve retornar: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  ```

- [ ] **CNAME do www configurado**
  ```powershell
  nslookup www.avilaops.com
  # Deve retornar: avilaops.github.io
  ```

- [ ] **GitHub Pages ativo**
  ```powershell
  gh api repos/avilaops/avilaops/pages
  # Deve retornar JSON com status: "built"
  ```

- [ ] **Domínio verificado**
  ```powershell
  gh api repos/avilaops/avilaops/pages | ConvertFrom-Json | Select-Object protected_domain_state
  # Deve retornar: "verified"
  ```

- [ ] **Autenticado no GitHub CLI**
  ```powershell
  gh auth status
  # Deve mostrar: "Logged in to github.com"
  ```

---

## 🕐 Timeline Típica

```
T+0 min    │ Configurar DNS no provedor
           │ ✓ Adicionar A records
           │ ✓ Adicionar CNAME para www
           │
T+5 min    │ DNS começa a propagar
           │ ⏳ Verificar: nslookup avilaops.com
           │
T+15 min   │ GitHub detecta DNS correto
           │ ✓ Domain state: verified
           │
T+30 min   │ Let's Encrypt provisiona certificado
           │ ⏳ Certificate status: pending
           │
T+45 min   │ Certificado disponível
           │ ✓ HTTPS pode ser ativado
           │ 🚀 Execute: .\enable-https.ps1
           │
T+60 min   │ HTTPS ativado e funcionando
           │ ✅ Site acessível em https://avilaops.com
```

---

## 🐛 Debugging Avançado

### Modo Verbose
```powershell
# Ver todas as etapas e mensagens detalhadas
.\enable-https.ps1 -Verbose
```

### Ver resposta completa da API
```powershell
$env:GITHUB_TOKEN = ''
gh api repos/avilaops/avilaops/pages --include
```

### Testar certificado SSL
```powershell
# PowerShell
$request = [System.Net.WebRequest]::Create("https://avilaops.com")
$request.GetResponse()

# Ou usando curl
curl -v https://avilaops.com
```

### Ver logs do GitHub Actions
```powershell
# Últimas execuções
gh run list --repo avilaops/avilaops --limit 10

# Logs detalhados da última execução
gh run view --repo avilaops/avilaops --log
```

---

## 📈 Monitoramento Contínuo

### Script de monitoramento (execute em loop):
```powershell
while ($true) {
    Clear-Host
    Write-Host "=== Monitoramento HTTPS ===" -ForegroundColor Cyan
    Write-Host "Timestamp: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
    Write-Host ""
    
    # Status do GitHub Pages
    $status = gh api repos/avilaops/avilaops/pages | ConvertFrom-Json
    Write-Host "HTTPS Enforced: $($status.https_enforced)" -ForegroundColor $(if ($status.https_enforced) {"Green"} else {"Red"})
    Write-Host "Domain State: $($status.protected_domain_state)" -ForegroundColor White
    Write-Host "Build Status: $($status.status)" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Próxima verificação em 60 segundos..." -ForegroundColor Gray
    Start-Sleep -Seconds 60
}
```

---

## 🔄 Fluxogramas de Processo

### Processo de Ativação HTTPS

```
┌─────────────────────────┐
│ Usuário: .\enable-https │
│         .ps1            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Verificar pré-requisitos│
│ - gh instalado?         │
│ - Autenticado?          │
│ - Repo existe?          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Obter status atual      │
│ gh api .../pages        │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────┐
    │ HTTPS já ativo?│
    └────────┬───────┘
         SIM │   │ NÃO
             │   │
             ▼   ▼
        ┌────┐  ┌──────────────────┐
        │FIM │  │ Loop de tentativas│
        └────┘  │ Tentar ativar     │
                │ a cada 30s        │
                └────────┬──────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Certificado    │
                │ existe?        │
                └────┬───────────┘
                 SIM │   │ NÃO
                     │   │
                     ▼   ▼
              ┌──────┐  ┌────────┐
              │Ativar│  │Aguardar│
              │HTTPS │  │30s     │
              └──┬───┘  └───┬────┘
                 │          │
                 │          └──┐
                 ▼             │
            ┌────────┐         │
            │Sucesso!│         │
            │  ✅    │         │
            └────────┘         │
                               │
                    ┌──────────▼────────┐
                    │Max tentativas?    │
                    │                   │
                    │ NÃO: volta ao loop│
                    │ SIM: erro         │
                    └───────────────────┘
```

---

## 📞 Quando Pedir Ajuda

### Contate o suporte do GitHub se:

1. **Após 24 horas:**
   - DNS está correto
   - Domain state: verified
   - Mas certificado não provisiona

2. **Erros persistentes da API:**
   - 500 Internal Server Error
   - 403 Forbidden (com permissões corretas)
   - Outros erros não documentados

3. **Problemas no provisionamento:**
   - Certificado expira imediatamente
   - Erro de validação CAA
   - Conflitos com outros serviços

### Como reportar:

```
1. Execute: .\check-status.ps1 > status-report.txt
2. Execute: gh api repos/avilaops/avilaops/pages > pages-config.json
3. Envie ambos os arquivos para o suporte
4. Link: https://support.github.com
```

---

## 🎓 Referências Rápidas

### Documentação Oficial GitHub:
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https

### Ferramentas de Teste:
- **DNS**: https://www.whatsmydns.net/#A/avilaops.com
- **SSL**: https://www.ssllabs.com/ssltest/analyze.html?d=avilaops.com
- **GitHub Status**: https://www.githubstatus.com

### Scripts Locais:
- `.\check-status.ps1` - Verificação completa
- `.\enable-https.ps1` - Ativação automática
- `HTTPS-TROUBLESHOOTING.md` - Guia detalhado
- `COMANDOS.md` - Referência de comandos

---

**Desenvolvido por Nícolas Ávila**  
📧 Contato: avilaops.com  
🔗 GitHub: github.com/avilaops  
📅 Última atualização: Dezembro 2024
