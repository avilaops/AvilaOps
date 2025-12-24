# 🔍 Como Verificar Erros no GitHub Actions

**Desenvolvido por:** Nícolas Ávila  
**Versão:** 1.0  
**Data:** Dezembro 2024

---

## ⚠️ Problema com o Terminal

O terminal PowerShell está apresentando erros no PSReadLine. Use as alternativas abaixo.

---

## 🌐 Método 1: Verificar no Navegador (MAIS FÁCIL)

### Passo 1: Abrir GitHub Actions

Abra seu navegador e acesse:

```
https://github.com/avilaops/avilaops/actions
```

### Passo 2: Identificar Falhas

- ✅ **Verde** = Sucesso
- ❌ **Vermelho** = Falha
- 🟡 **Amarelo** = Em progresso ou cancelado

### Passo 3: Ver Detalhes do Erro

1. Clique na execução que falhou (marcada em vermelho)
2. Clique no job que falhou
3. Expanda os steps para ver onde ocorreu o erro
4. Leia a mensagem de erro

---

## 💻 Método 2: Usar um Novo Terminal

### Abra um NOVO PowerShell

1. Pressione **Win + R**
2. Digite: `powershell`
3. Pressione **Enter**

### Execute os Comandos

```powershell
# Navegar até o diretório
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops

# Listar últimas execuções
$env:GITHUB_TOKEN = ''
gh run list --repo avilaops/avilaops --limit 10

# Ver detalhes da última execução
gh run view --repo avilaops/avilaops

# Ver logs da última execução (pode ser longo)
gh run view --repo avilaops/avilaops --log
```

---

## 📋 Método 3: Usar Script Batch

Execute o arquivo criado:

```cmd
avilaops\check-actions.bat
```

**OU** clique duas vezes no arquivo `check-actions.bat` no Windows Explorer.

---

## 🔧 Método 4: CMD (Prompt de Comando)

### Abrir CMD

1. Pressione **Win + R**
2. Digite: `cmd`
3. Pressione **Enter**

### Executar Comandos

```cmd
cd C:\Users\Administrador\source\repos\AvilaOps\avilaops

set GITHUB_TOKEN=

gh run list --repo avilaops/avilaops --limit 10

gh run view --repo avilaops/avilaops --log
```

---

## 🔍 Erros Comuns no GitHub Actions

### 1. Erro de Permissões

**Sintoma:**
```
Error: Resource not accessible by integration
Error: Insufficient permissions
```

**Solução:**
1. Vá para: https://github.com/avilaops/avilaops/settings/actions
2. Em **Workflow permissions**, selecione:
   - ✅ **Read and write permissions**
3. Salve as alterações

---

### 2. Erro no Deploy

**Sintoma:**
```
Error: Failed to deploy
Error: The operation was canceled
```

**Solução:**
1. Verifique se GitHub Pages está ativo
2. Verifique branch configurada (deve ser `main`)
3. Verifique arquivo `.github/workflows/deploy.yml`

---

### 3. Erro de Autenticação

**Sintoma:**
```
Error: Bad credentials
Error: HttpError: Requires authentication
```

**Solução:**
1. Vá para: https://github.com/settings/tokens
2. Gere um novo token (se necessário)
3. Configure no repositório

---

### 4. Erro no Workflow File

**Sintoma:**
```
Error: Invalid workflow file
Error: Unexpected symbol
```

**Solução:**
1. Verifique sintaxe do arquivo `deploy.yml`
2. Use validador: https://www.yamllint.com/
3. Compare com template oficial do GitHub

---

## 📊 Verificar Status Atual

### Via API REST

Abra no navegador ou use curl:

```
https://api.github.com/repos/avilaops/avilaops/actions/runs
```

### Via GitHub CLI (se funcionar)

```powershell
# JSON formatado
gh api repos/avilaops/avilaops/actions/runs | ConvertFrom-Json | Select-Object -First 1

# Lista simples
gh run list --repo avilaops/avilaops --json status,conclusion,name,databaseId
```

---

## 🛠️ Solução: Reexecutar Workflow Falhado

### Via Navegador

1. Acesse: https://github.com/avilaops/avilaops/actions
2. Clique na execução falhada
3. Clique em **Re-run jobs** → **Re-run all jobs**

### Via GitHub CLI

```powershell
# Listar execuções
gh run list --repo avilaops/avilaops --limit 5

# Reexecutar (substitua RUN_ID)
gh run rerun <RUN_ID> --repo avilaops/avilaops

# Reexecutar a última falha
gh run rerun $(gh run list --repo avilaops/avilaops --json databaseId --jq '.[0].databaseId') --repo avilaops/avilaops
```

---

## 📝 Logs Importantes

### Verificar o que está falhando:

1. **Build logs** - Erros de compilação/build
2. **Deploy logs** - Erros no deploy
3. **Pages logs** - Erros específicos do GitHub Pages

### Exemplo de Output Normal (Sucesso):

```
✓ Set up job
✓ Checkout
✓ Setup Pages
✓ Upload artifact
✓ Deploy to GitHub Pages
✓ Complete job
```

### Exemplo de Output com Erro:

```
✓ Set up job
✓ Checkout
✓ Setup Pages
✗ Upload artifact  ← ERRO AQUI
  Error: ...
✗ Deploy to GitHub Pages
✗ Complete job
```

---

## 🔗 Links Úteis

### Verificar Status

- **Actions**: https://github.com/avilaops/avilaops/actions
- **Workflows**: https://github.com/avilaops/avilaops/actions/workflows
- **Deploy Workflow**: https://github.com/avilaops/avilaops/actions/workflows/deploy.yml

### Configurações

- **Pages Settings**: https://github.com/avilaops/avilaops/settings/pages
- **Actions Settings**: https://github.com/avilaops/avilaops/settings/actions
- **Secrets**: https://github.com/avilaops/avilaops/settings/secrets/actions

### Documentação

- **GitHub Actions**: https://docs.github.com/en/actions
- **GitHub Pages**: https://docs.github.com/en/pages
- **Workflows**: https://docs.github.com/en/actions/using-workflows

---

## 🚨 Casos Específicos

### Se TODOS os workflows estão falhando:

1. Verifique GitHub Status: https://www.githubstatus.com
2. Pode ser problema temporário do GitHub
3. Aguarde e tente novamente em 15-30 minutos

### Se APENAS o deploy falha:

1. Verifique GitHub Pages está ativo
2. Verifique domínio customizado não está causando conflito
3. Temporariamente remova o CNAME e teste

### Se aparece "Queued" por muito tempo:

1. GitHub pode estar com alta demanda
2. Limite de uso do GitHub Actions pode ter sido atingido
3. Verifique: https://github.com/avilaops/avilaops/settings/billing

---

## 📞 Próximos Passos

### Depois de Identificar o Erro:

1. **Anote a mensagem de erro exata**
2. **Consulte a seção correspondente neste documento**
3. **Aplique a solução sugerida**
4. **Reexecute o workflow**
5. **Se persistir, abra um issue no GitHub**

---

## 💡 Dica Rápida

**Para visualizar rapidamente no navegador, copie e cole este link:**

```
https://github.com/avilaops/avilaops/actions
```

E veja diretamente qual workflow falhou e por quê.

---

## 🆘 Suporte

Se não conseguir resolver:

1. **Capture screenshot do erro**
2. **Anote o Run ID da execução**
3. **Contate o suporte GitHub**: https://support.github.com
4. **Ou abra um issue no repositório**

---

**Desenvolvido por Nícolas Ávila**  
📧 Contato: avilaops.com  
🔗 GitHub: github.com/avilaops  
📅 Última atualização: Dezembro 2024

---

*Este guia foi criado devido a problemas no terminal PSReadLine. Use os métodos alternativos acima.*
