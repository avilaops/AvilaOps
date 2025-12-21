# Guia para Ativar HTTPS no GitHub Pages

**Desenvolvido por:** Nícolas Ávila

## Status Atual
- ✅ DNS configurado corretamente
- ✅ CNAME apontando para `avilaops.com`
- ✅ Registros A apontando para IPs do GitHub Pages
- ✅ CNAME do www apontando para `avilaops.github.io`

## Por que o "Enforce HTTPS" pode não estar disponível?

### 1. Certificado SSL em Provisionamento
Após configurar o DNS corretamente, o GitHub precisa provisionar o certificado SSL através do Let's Encrypt. Isso pode levar:
- **Mínimo**: 15-30 minutos
- **Máximo**: 24 horas

### 2. Verificações de DNS
O GitHub verifica periodicamente se o DNS está configurado corretamente. Às vezes é necessário:

#### Solução A: Remover e Re-adicionar o Domínio Customizado
1. Vá para o repositório: https://github.com/avilaops/avilaops
2. Clique em **Settings**
3. Na barra lateral, clique em **Pages**
4. Em "Custom domain", **remova** o domínio `avilaops.com`
5. Clique em **Save**
6. Aguarde 1-2 minutos
7. **Re-adicione** o domínio `avilaops.com`
8. Clique em **Save**
9. Aguarde a verificação do DNS (pode levar alguns minutos)
10. Após a verificação bem-sucedida, a opção **"Enforce HTTPS"** deve aparecer

#### Solução B: Verificar Cache do DNS
Execute no PowerShell:
```powershell
ipconfig /flushdns
Clear-DnsClientCache
```

Depois teste o domínio:
```powershell
nslookup avilaops.com
```

### 3. Configurações Necessárias no Provedor de DNS

Certifique-se de que no seu provedor de DNS (ex: Cloudflare, GoDaddy, etc.) você tem:

#### Registros A (para apex domain):
```
Type: A
Name: @
Value: 185.199.108.153
```
```
Type: A
Name: @
Value: 185.199.109.153
```
```
Type: A
Name: @
Value: 185.199.110.153
```
```
Type: A
Name: @
Value: 185.199.111.153
```

#### Registro CNAME (para www):
```
Type: CNAME
Name: www
Value: avilaops.github.io
```

### 4. Problemas com CAA Records
Alguns provedores de DNS têm registros CAA que podem bloquear o Let's Encrypt. Verifique se você tem registros CAA e, se tiver, adicione:

```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
```

### 5. Cloudflare ou Proxy
Se você estiver usando Cloudflare ou outro proxy:
- Desative temporariamente o proxy (ícone laranja → cinza)
- Aguarde o certificado ser provisionado
- Após ativar o "Enforce HTTPS", você pode reativar o proxy

## Verificação Manual

### Teste 1: Verificar se o HTTPS está funcionando
Abra no navegador:
- https://avilaops.com
- https://www.avilaops.com

Se carregar com cadeado verde, o certificado foi provisionado.

### Teste 2: Verificar Certificado
```bash
curl -I https://avilaops.com
```

Se retornar 200 OK, o HTTPS está funcionando.

### Teste 3: Verificar Detalhes do Certificado
No navegador, clique no cadeado ao lado da URL e verifique se o certificado é válido.

## Solução via GitHub CLI (Alternativa)

Se você tiver o GitHub CLI instalado, pode tentar forçar a verificação:

```bash
# Instalar GitHub CLI (se não tiver)
winget install --id GitHub.cli

# Login
gh auth login

# Verificar configuração do Pages
gh api repos/avilaops/avilaops/pages

# Atualizar configuração (forçar verificação)
gh api -X PUT repos/avilaops/avilaops/pages -f cname=avilaops.com -F https_enforced=true
```

## Timeline Esperada

1. **Imediatamente**: DNS configurado ✅
2. **5-15 minutos**: Verificação do DNS pelo GitHub
3. **15-60 minutos**: Provisionamento do certificado SSL
4. **Após provisionamento**: Opção "Enforce HTTPS" ficará disponível

## Contato com Suporte

Se após 24 horas o problema persistir:
1. Vá para https://support.github.com
2. Selecione "GitHub Pages"
3. Descreva: "Cannot enable Enforce HTTPS despite DNS being configured correctly"
4. Forneça o link do repositório: https://github.com/avilaops/avilaops

## Comandos Úteis para Debug

```powershell
# Verificar DNS
nslookup avilaops.com
nslookup www.avilaops.com

# Limpar cache DNS
ipconfig /flushdns

# Testar HTTPS
curl -I https://avilaops.com

# Verificar propagação DNS mundial
# Visite: https://www.whatsmydns.net/#A/avilaops.com
```

## Status Atual (Verificado Agora)

```
Domain: avilaops.com
DNS A Records: ✅ 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
WWW CNAME: ✅ avilaops.github.io
GitHub Pages Deploy: ✅ Ativo
HTTPS Status: ⏳ Aguardando provisionamento
```

## Recomendação

**Tente a Solução A primeiro** (remover e re-adicionar o domínio). Isso geralmente força o GitHub a re-verificar e provisionar o certificado imediatamente.

---

**Desenvolvido por Nícolas Ávila**  
📧 Contato: avilaops.com  
🔗 GitHub: github.com/avilaops
