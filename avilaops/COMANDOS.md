# COMANDOS RÁPIDOS - Copie e Cole

**Desenvolvido por:** Nícolas Ávila  
**Versão:** 1.0  
**Data:** Dezembro 2024

---

## 🚀 Comandos Principais

### 1. Ativar HTTPS automaticamente ⭐ (RECOMENDADO)
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops
.\enable-https.ps1
```

**Opções avançadas:**
```powershell
# Com mais tentativas e intervalo menor
.\enable-https.ps1 -MaxAttempts 120 -IntervalSeconds 20

# Com modo verbose (debug)
.\enable-https.ps1 -Verbose

# Combinando opções
.\enable-https.ps1 -MaxAttempts 90 -IntervalSeconds 25 -Verbose
```

---

### 2. Verificar status completo 🔍
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops
.\check-status.ps1
```

---

### 3. Ver configuração do GitHub Pages (API)
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops
$env:GITHUB_TOKEN = ''
gh api repos/avilaops/avilaops/pages | ConvertFrom-Json | Format-List
```

**Versão compacta:**
```powershell
$env:GITHUB_TOKEN = ''
gh api repos/avilaops/avilaops/pages | ConvertFrom-Json | Select-Object status, cname, https_enforced, protected_domain_state
```

---

### 4. Fazer commit e push dos scripts 📤
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops

# Opção 1: Usando o script batch
.\commit-https-files.bat

# Opção 2: Manualmente
git add .
git commit -m "Add HTTPS activation scripts and guides - Developed by Nicolas Avila"
git push origin main
```

**Verificar status antes:**
```powershell
git status
git diff
```

---

### 5. Tentar ativar HTTPS manualmente (uma única tentativa)
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops
$env:GITHUB_TOKEN = ''
gh api -X PUT repos/avilaops/avilaops/pages -f cname=avilaops.com -F https_enforced=true
```

---

### 6. Verificar DNS 🌐
```powershell
# Verificar domínio principal
nslookup avilaops.com

# Verificar subdomínio www
nslookup www.avilaops.com

# Limpar cache DNS local
ipconfig /flushdns

# Verificar novamente após limpar cache
nslookup avilaops.com
```

---

### 7. Testar conectividade HTTPS 🔒
```powershell
# Teste básico
Test-NetConnection -ComputerName avilaops.com -Port 443

# Teste com curl
curl -I https://avilaops.com

# Teste com Invoke-WebRequest
Invoke-WebRequest -Uri https://avilaops.com -Method Head
```

---

### 8. Ver logs do GitHub Actions 📋
```powershell
# Ver últimas execuções
gh run list --repo avilaops/avilaops --limit 5

# Ver detalhes de uma execução específica
gh run view <RUN_ID> --repo avilaops/avilaops

# Ver logs de uma execução
gh run view <RUN_ID> --log --repo avilaops/avilaops

# OU use o script batch (se o terminal estiver com problemas)
avilaops\check-actions.bat

# OU veja diretamente no navegador (RECOMENDADO se houver problemas)
# https://github.com/avilaops/avilaops/actions
```

**Se o terminal tiver problemas:**
```powershell
# Abra um NOVO terminal PowerShell (Win + R → powershell)
# E execute os comandos acima
```

---

### 8.1. Verificar Erros no Actions (NOVO) 🚨
```powershell
# Opção 1: Script PowerShell
.\check-actions.ps1

# Opção 2: Script Batch
.\check-actions.bat

# Opção 3: Navegador (MAIS FÁCIL)
# Abra: https://github.com/avilaops/avilaops/actions

# Opção 4: Comandos diretos
$env:GITHUB_TOKEN = ''
gh run list --repo avilaops/avilaops --limit 10 --json status,conclusion,displayTitle,databaseId

# Ver última execução
gh run view --repo avilaops/avilaops

# Ver logs da última execução
gh run view --repo avilaops/avilaops --log
```

**Problemas com PSReadLine?**
- Veja: [COMO-VERIFICAR-ACTIONS.md](COMO-VERIFICAR-ACTIONS.md)

---

### 9. Forçar novo deploy 🔄
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops

# Criar commit vazio para forçar deploy
git commit --allow-empty -m "Force GitHub Pages redeploy"
git push origin main
```

---

### 10. Remover e recriar GitHub Pages (reset completo) ⚠️
```powershell
$env:GITHUB_TOKEN = ''

# Remover GitHub Pages
gh api -X DELETE repos/avilaops/avilaops/pages

# Aguardar 5 segundos
Start-Sleep -Seconds 5

# Recriar GitHub Pages
gh api -X POST repos/avilaops/avilaops/pages -f cname=avilaops.com -f source[branch]=main -f source[path]=/

# Aguardar 10 segundos
Start-Sleep -Seconds 10

# Verificar status
gh api repos/avilaops/avilaops/pages
```

---

## 🎯 Fluxo Recomendado

### Para Primeira Configuração:
```powershell
# 1. Verificar status atual
.\check-status.ps1

# 2. Se DNS estiver OK, tentar ativar HTTPS
.\enable-https.ps1

# 3. Verificar novamente
.\check-status.ps1
```

### Para Troubleshooting:
```powershell
# 1. Verificar status detalhado
.\check-status.ps1

# 2. Limpar cache DNS
ipconfig /flushdns

# 3. Verificar DNS novamente
nslookup avilaops.com

# 4. Tentar ativar HTTPS com verbose
.\enable-https.ps1 -Verbose

# 5. Se não funcionar, consultar guia
# Abrir: HTTPS-TROUBLESHOOTING.md
```

### Para Salvar no Git:
```powershell
# 1. Ver mudanças
git status
git diff

# 2. Adicionar e commitar
git add .
git commit -m "Update HTTPS configuration"

# 3. Push para GitHub
git push origin main

# 4. Verificar workflow
gh run list --repo avilaops/avilaops --limit 3
```

---

## 📚 Documentação por Situação

| Situação | Comando/Arquivo |
|----------|-----------------|
| Primeira vez configurando | `.\check-status.ps1` + `.\enable-https.ps1` |
| HTTPS não ativa | `.\enable-https.ps1` |
| Verificar progresso | `.\check-status.ps1` |
| DNS com problemas | `nslookup avilaops.com` + `ipconfig /flushdns` |
| Erros persistentes | Abrir `HTTPS-TROUBLESHOOTING.md` |
| Entender o processo | Abrir `README-HTTPS.md` |
| Ver resumo completo | Abrir `RESUMO.md` |
| Salvar arquivos | `.\commit-https-files.bat` |

---

## 🔧 Comandos de Manutenção

### Ver versão das ferramentas:
```powershell
gh --version
git --version
pwsh --version
```

### Atualizar GitHub CLI:
```powershell
winget upgrade --id GitHub.cli
```

### Re-autenticar no GitHub:
```powershell
gh auth logout
gh auth login
```

### Ver informações do repositório:
```powershell
gh repo view avilaops/avilaops
```

---

## 🆘 Comandos de Emergência

### Se nada funcionar:
```powershell
# 1. Verificar autenticação
gh auth status

# 2. Re-autenticar se necessário
gh auth login

# 3. Verificar se repositório existe
gh repo view avilaops/avilaops

# 4. Verificar se GitHub Pages está ativo
gh api repos/avilaops/avilaops/pages

# 5. Verificar status do GitHub
Start-Process "https://www.githubstatus.com"
```

---

## 💡 Dicas e Truques

### Criar alias para comandos frequentes:
```powershell
# Adicionar ao seu perfil do PowerShell
Set-Alias check-https "C:\Users\Administrador\source\repos\AvilaOps\avilaops\check-status.ps1"
Set-Alias enable-https "C:\Users\Administrador\source\repos\AvilaOps\avilaops\enable-https.ps1"

# Usar:
check-https
enable-https
```

### Ver arquivo de perfil:
```powershell
notepad $PROFILE
```

---

**Desenvolvido por Nícolas Ávila**  
📧 Contato: avilaops.com  
🔗 GitHub: github.com/avilaops  
📅 Última atualização: Dezembro 2024
