# 📸 Guia Visual: Verificar Actions no Navegador

**Desenvolvido por:** Nícolas Ávila  
**Última Atualização:** Dezembro 2024

---

## 🎯 Método Mais Fácil: Verificar no Navegador

### Passo 1: Abrir GitHub Actions

**Cole este link no seu navegador:**

```
https://github.com/avilaops/avilaops/actions
```

---

## 🔍 O Que Você Verá

### Interface do GitHub Actions

```
┌─────────────────────────────────────────────────────────────┐
│  avilaops / avilaops                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Actions   Code   Issues   Pull requests            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  All workflows ▼   [Buscar workflows...]                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ Deploy to GitHub Pages                             │  │
│  │   Deploy to GitHub Pages                             │  │
│  │   #42 · main · 5 minutes ago · 1m 23s               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✗ Deploy to GitHub Pages                             │  │
│  │   Deploy to GitHub Pages                             │  │
│  │   #41 · main · 2 hours ago · 45s                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚦 Identificar Status

### ✅ Verde = Sucesso

```
┌──────────────────────────────────────────────────────┐
│ ✓ Deploy to GitHub Pages                            │ ← Verde
│   Add HTTPS activation scripts                      │
│   #43 · main · 10 minutes ago · 1m 15s             │
└──────────────────────────────────────────────────────┘
```

**Significado:** Deploy funcionou corretamente!

---

### ❌ Vermelho = Falha

```
┌──────────────────────────────────────────────────────┐
│ ✗ Deploy to GitHub Pages                            │ ← Vermelho
│   Update configuration                              │
│   #42 · main · 1 hour ago · 32s                     │
└──────────────────────────────────────────────────────┘
```

**Significado:** Algo deu errado! Clique para ver detalhes.

---

### 🟡 Amarelo = Em Progresso ou Cancelado

```
┌──────────────────────────────────────────────────────┐
│ ○ Deploy to GitHub Pages                            │ ← Amarelo
│   Deploy to GitHub Pages                            │
│   #41 · main · running · 15s                        │
└──────────────────────────────────────────────────────┘
```

**Significado:** Workflow está executando agora.

---

## 🔍 Passo 2: Ver Detalhes do Erro

### Clique na Execução Falhada

```
┌──────────────────────────────────────────────────────────┐
│  ✗ Deploy to GitHub Pages #42                           │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  deploy                                  1m 23s    │ │ ← Clique aqui
│  │  ✓ Set up job                           3s        │ │
│  │  ✓ Checkout                             5s        │ │
│  │  ✓ Setup Pages                          2s        │ │
│  │  ✗ Upload artifact                      45s       │ │ ← ERRO AQUI!
│  │  ✗ Deploy to GitHub Pages              skipped   │ │
│  │  ✗ Complete job                         1s        │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 📝 Passo 3: Ler a Mensagem de Erro

### Expandir o Step que Falhou

```
┌──────────────────────────────────────────────────────────┐
│  ✗ Upload artifact                                       │
│                                                          │
│  Run actions/upload-pages-artifact@v3                   │
│  with:                                                   │
│    path: .                                               │
│                                                          │
│  Error: Resource not accessible by integration          │ ← ERRO!
│  The operation was canceled.                             │
│                                                          │
│  For more information, see:                              │
│  https://docs.github.com/actions/...                     │
└──────────────────────────────────────────────────────────┘
```

**Esta é a mensagem de erro que você precisa!**

---

## 🛠️ Erros Comuns e Soluções

### Erro 1: "Resource not accessible by integration"

**O Problema:**
```
Error: Resource not accessible by integration
```

**Causa:** Permissões do workflow insuficientes

**Solução:**

1. Vá para: `https://github.com/avilaops/avilaops/settings/actions`
2. Role até **Workflow permissions**
3. Selecione: **Read and write permissions**
4. Clique em **Save**

```
┌─────────────────────────────────────────────┐
│  Workflow permissions                       │
│                                             │
│  ○ Read repository contents permission     │
│  ● Read and write permissions    ← Selecione│
│                                             │
│  [Save]                                     │
└─────────────────────────────────────────────┘
```

---

### Erro 2: "Failed to deploy"

**O Problema:**
```
Error: Failed to deploy
Error: Process completed with exit code 1
```

**Causa:** GitHub Pages não está configurado corretamente

**Solução:**

1. Vá para: `https://github.com/avilaops/avilaops/settings/pages`
2. Verifique:
   - **Source:** Deploy from a branch OU GitHub Actions
   - **Branch:** main
   - **Folder:** / (root)

```
┌─────────────────────────────────────────────┐
│  GitHub Pages                               │
│                                             │
│  Build and deployment                       │
│    Source: GitHub Actions        ← Verifique│
│    Branch: main                  ← Verifique│
│    Folder: / (root)              ← Verifique│
│                                             │
│  [Save]                                     │
└─────────────────────────────────────────────┘
```

---

### Erro 3: "Invalid workflow file"

**O Problema:**
```
Error: .github/workflows/deploy.yml
Error: Invalid workflow file
```

**Causa:** Sintaxe YAML incorreta no arquivo de workflow

**Solução:**

1. Verifique o arquivo: `.github/workflows/deploy.yml`
2. Use validador YAML: https://www.yamllint.com/
3. Compare com template oficial

**Template correto:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🔄 Reexecutar Workflow

### Depois de Corrigir o Erro

1. Na página do workflow falhado
2. Clique em **Re-run jobs** (canto superior direito)
3. Selecione **Re-run all jobs**

```
┌──────────────────────────────────────────────────────────┐
│  ✗ Deploy to GitHub Pages #42        [Re-run jobs ▼]    │← Clique
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Re-run failed jobs                                │ │
│  │  Re-run all jobs                  ← Selecione      │ │
│  │  Cancel workflow                                    │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Monitorar Progresso

### Acompanhar Execução em Tempo Real

Quando você reexecutar:

```
┌──────────────────────────────────────────────────────┐
│ ○ Deploy to GitHub Pages #43          running       │
│                                                      │
│  deploy                               in progress   │
│  ✓ Set up job                        3s            │
│  ✓ Checkout                          5s            │
│  ✓ Setup Pages                       2s            │
│  ○ Upload artifact                   in progress   │← Progresso
│  - Deploy to GitHub Pages            queued        │
│  - Complete job                      queued        │
└──────────────────────────────────────────────────────┘
```

**Aguarde até ver todos com ✓**

---

## ✅ Sucesso!

### Quando Tudo Funcionar

```
┌──────────────────────────────────────────────────────┐
│ ✓ Deploy to GitHub Pages #43                        │
│   Deploy to GitHub Pages                            │
│   main · 2 minutes ago · 1m 15s                     │
│                                                      │
│  deploy                               success       │
│  ✓ Set up job                        3s            │
│  ✓ Checkout                          5s            │
│  ✓ Setup Pages                       2s            │
│  ✓ Upload artifact                   15s           │
│  ✓ Deploy to GitHub Pages            45s           │← Sucesso!
│  ✓ Complete job                      2s            │
└──────────────────────────────────────────────────────┘
```

**Seu site foi deployado com sucesso! 🎉**

---

## 🔗 Links Rápidos

### Para Acessar Rapidamente

| O Que Ver | Link Direto |
|-----------|-------------|
| **Actions** | https://github.com/avilaops/avilaops/actions |
| **Workflows** | https://github.com/avilaops/avilaops/actions/workflows |
| **Pages Settings** | https://github.com/avilaops/avilaops/settings/pages |
| **Actions Settings** | https://github.com/avilaops/avilaops/settings/actions |

---

## 📞 Ainda com Dúvidas?

### Documentos Relacionados

- **[COMO-VERIFICAR-ACTIONS.md](COMO-VERIFICAR-ACTIONS.md)** - Métodos alternativos
- **[HTTPS-TROUBLESHOOTING.md](HTTPS-TROUBLESHOOTING.md)** - Troubleshooting geral
- **[COMANDOS.md](COMANDOS.md)** - Comandos via terminal

### Suporte

- **GitHub Docs:** https://docs.github.com/en/actions
- **GitHub Support:** https://support.github.com
- **Desenvolvedor:** Nícolas Ávila

---

**Desenvolvido por Nícolas Ávila**  
📧 Contato: avilaops.com  
🔗 GitHub: github.com/avilaops  
📅 Última atualização: Dezembro 2024

---

*Este guia visual foi criado para facilitar a verificação de erros no GitHub Actions diretamente pelo navegador.*
