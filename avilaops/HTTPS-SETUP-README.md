# 🔒 Configuração HTTPS para GitHub Pages

**Desenvolvido por:** Nícolas Ávila

## 📦 Pacote de Scripts e Documentação

Este pacote contém todos os scripts e documentação necessários para configurar e ativar HTTPS no GitHub Pages para o domínio `avilaops.com`.

## 📁 Arquivos Incluídos

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `README-HTTPS.md` | 📖 Documentação | Guia rápido de início |
| `RESUMO.md` | 📖 Documentação | Resumo completo em português |
| `HTTPS-TROUBLESHOOTING.md` | 📖 Documentação | Guia detalhado de troubleshooting |
| `COMANDOS.md` | 📋 Referência | Comandos prontos para copiar/colar |
| `enable-https.ps1` | 🔧 Script | Script automático de ativação HTTPS |
| `check-status.ps1` | 🔍 Script | Script de verificação de status |
| `commit-https-files.bat` | 📤 Script | Script para commit dos arquivos |

## 🚀 Início Rápido

### Passo 1: Aguardar Provisionamento
Aguarde 15-30 minutos após configurar o DNS para o GitHub provisionar o certificado SSL.

### Passo 2: Executar Script de Ativação
```powershell
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops
.\enable-https.ps1
```

### Passo 3: Verificar Status
```powershell
.\check-status.ps1
```

## 📚 Documentação Detalhada

- **Começando?** Leia: `README-HTTPS.md`
- **Resumo em português?** Leia: `RESUMO.md`
- **Problemas?** Consulte: `HTTPS-TROUBLESHOOTING.md`
- **Comandos rápidos?** Veja: `COMANDOS.md`

## 🎯 Recursos

### Scripts PowerShell

#### `enable-https.ps1`
Script inteligente que:
- ✅ Monitora o provisionamento do certificado
- ✅ Tenta ativar HTTPS automaticamente
- ✅ Mostra progresso em tempo real
- ✅ Faz até 60 tentativas (30 minutos)

**Uso:**
```powershell
.\enable-https.ps1
```

**Parâmetros opcionais:**
```powershell
.\enable-https.ps1 -MaxAttempts 120 -IntervalSeconds 20
```

#### `check-status.ps1`
Script de diagnóstico que verifica:
- ✅ Configuração GitHub Pages
- ✅ Status do DNS
- ✅ Acessibilidade HTTPS
- ✅ Subdomínio WWW
- ✅ Recomendações personalizadas

**Uso:**
```powershell
.\check-status.ps1
```

### Batch Script

#### `commit-https-files.bat`
Script para salvar os arquivos no repositório Git.

**Uso:**
```batch
.\commit-https-files.bat
```

## 🔧 Tecnologias Utilizadas

- **PowerShell 5.1+** - Scripts de automação
- **GitHub CLI (gh)** - Interação com API do GitHub
- **Git** - Controle de versão
- **Batch Script** - Automação Windows

## 📖 Guias por Cenário

### Cenário 1: Primeira Configuração
1. Configure o DNS no provedor
2. Aguarde 30 minutos
3. Execute: `.\enable-https.ps1`

### Cenário 2: Verificar Status
1. Execute: `.\check-status.ps1`
2. Siga as recomendações mostradas

### Cenário 3: Problemas Persistentes
1. Consulte: `HTTPS-TROUBLESHOOTING.md`
2. Verifique DNS: `nslookup avilaops.com`
3. Contate suporte GitHub

### Cenário 4: Salvar Alterações
1. Execute: `.\commit-https-files.bat`
2. Ou use comandos em `COMANDOS.md`

## 🌐 Links Úteis

- **Repositório**: https://github.com/avilaops/avilaops
- **GitHub Pages Settings**: https://github.com/avilaops/avilaops/settings/pages
- **Verificar DNS**: https://www.whatsmydns.net/#A/avilaops.com
- **Testar SSL**: https://www.ssllabs.com/ssltest/analyze.html?d=avilaops.com
- **GitHub Status**: https://www.githubstatus.com
- **Suporte GitHub**: https://support.github.com

## 🎓 Como Funciona

### 1. Provisionamento do Certificado
```
GitHub → Verifica DNS → Let's Encrypt → Gera Certificado → Instala
```

### 2. Ativação do HTTPS
```
Script → Verifica Certificado → Ativa HTTPS → Confirma Ativação
```

### 3. Timeline Típica
```
0 min: Configurar DNS ✅
5-15 min: GitHub verifica DNS ⏳
15-60 min: Certificado provisionado ⏳
60+ min: HTTPS ativado ✅
```

## ⚡ Solução Rápida de Problemas

| Problema | Solução Rápida |
|----------|----------------|
| DNS não verificado | Aguarde 15 minutos e tente novamente |
| Certificado não existe | Aguarde provisionamento (15-60 min) |
| HTTPS não ativa | Execute `.\enable-https.ps1` |
| Erro no script | Verifique se está autenticado: `gh auth status` |

## 📝 Requisitos

- ✅ Windows 10/11
- ✅ PowerShell 5.1+
- ✅ Git instalado
- ✅ GitHub CLI (gh) instalado e autenticado
- ✅ Repositório clonado localmente

## 🤝 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação incluída
2. Verifique os logs dos scripts
3. Contate: Nícolas Ávila

## 📄 Licença

Scripts desenvolvidos para uso no projeto AvilaOps.

---

**Desenvolvido por Nícolas Ávila**  
📧 Contato: avilaops.com  
🔗 GitHub: github.com/avilaops  
📅 Data: Dezembro 2024

## 🎉 Agradecimentos

Obrigado por usar estes scripts! Se funcionaram para você, considere dar uma ⭐ no repositório.

---

*Este pacote faz parte do projeto AvilaOps - Transformando infraestrutura em código.*
