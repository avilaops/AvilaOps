@echo off
REM ========================================
REM  Commit e Push dos Scripts HTTPS
REM  Desenvolvido por: Nicolas Avila
REM ========================================
echo ========================================
echo  Commit e Push dos Scripts HTTPS
echo  Desenvolvido por: Nicolas Avila
echo ========================================
echo.

cd /d "%~dp0"

echo Adicionando arquivos...
git add HTTPS-README.md
git add README-PRINCIPAL.md
git add INDEX.md
git add CHECKLIST-VALIDACAO.md
git add HTTPS-TROUBLESHOOTING.md
git add TROUBLESHOOTING-VISUAL.md
git add COMO-VERIFICAR-ACTIONS.md
git add VERIFICAR-ACTIONS-NAVEGADOR.md
git add CORRIGIR-CI-ERROS.md
git add EXECUTAR-AGORA.md
git add check-actions.ps1
git add check-actions.bat
git add disable-ci-workflow.ps1
git add fix-github-actions.ps1
git add fix-github-actions.bat
git add enable-https.ps1
git add check-status.ps1
git add monitor-https.ps1
git add README-HTTPS.md
git add RESUMO.md
git add COMANDOS.md
git add HTTPS-SETUP-README.md
git add commit-https-files.bat
git add trial-signup.html
git add status.html
git add docs.html
git add index.html
git add sitemap.xml
git add README-NOVAS-FUNCIONALIDADES.md

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  PACOTE COMPLETO - 29 ARQUIVOS                        ║
echo ║  Desenvolvido por: Nicolas Avila                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo DOCUMENTACAO (8 arquivos):
echo  ✓ HTTPS-README.md (Ponto de entrada)
echo  ✓ README-PRINCIPAL.md (Doc completa)
echo  ✓ INDEX.md (Indice)
echo  ✓ README-HTTPS.md (Guia rapido)
echo  ✓ RESUMO.md (Resumo)
echo  ✓ HTTPS-SETUP-README.md (Setup tecnico)
echo  ✓ EXECUTAR-AGORA.md (Guia de execucao)
echo  ✓ README-NOVAS-FUNCIONALIDADES.md (Guia das novas features)
echo.
echo TROUBLESHOOTING (5 arquivos):
echo  ✓ HTTPS-TROUBLESHOOTING.md
echo  ✓ TROUBLESHOOTING-VISUAL.md
echo  ✓ COMO-VERIFICAR-ACTIONS.md
echo  ✓ VERIFICAR-ACTIONS-NAVEGADOR.md
echo  ✓ CORRIGIR-CI-ERROS.md
echo.
echo CHECKLISTS E COMANDOS (2 arquivos):
echo  ✓ CHECKLIST-VALIDACAO.md
echo  ✓ COMANDOS.md
echo.
echo SCRIPTS (9 arquivos):
echo  ✓ enable-https.ps1 (Ativar HTTPS)
echo  ✓ check-status.ps1 (Verificar status)
echo  ✓ monitor-https.ps1 (Monitor automatico)
echo  ✓ check-actions.ps1 (Verificar Actions)
echo  ✓ check-actions.bat (Actions batch)
echo  ✓ disable-ci-workflow.ps1 (Desabilitar workflow)
echo  ✓ fix-github-actions.ps1 (Corrigir Actions)
echo  ✓ fix-github-actions.bat (Corrigir batch)
echo  ✓ commit-https-files.bat (Este script)
echo.
echo NOVAS PAGINAS WEB (5 arquivos):
echo  ✓ trial-signup.html (Pagina de trial gratuito) [NOVO!]
echo  ✓ status.html (Status em tempo real) [NOVO!]
echo  ✓ docs.html (Portal de documentacao) [NOVO!]
echo  ✓ index.html (Homepage atualizada) [ATUALIZADO!]
echo  ✓ sitemap.xml (SEO otimizado) [ATUALIZADO!]

echo.
echo Verificando status...
git status --short

echo.
echo Criando commit...
git commit -m "Add trial signup, status page and documentation portal - Developed by Nicolas Avila"

echo.
echo Fazendo push para GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  ✓ Concluido com Sucesso!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo  X Erro ao fazer push
    echo ========================================
    echo Verifique sua conexao e autenticacao
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  🎉 NOVAS FUNCIONALIDADES DISPONIVEIS!                ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Acesse agora:
echo  📝 Trial Gratuito: https://avilaops.com/trial-signup.html
echo  📊 Status: https://avilaops.com/status.html
echo  📚 Documentacao: https://avilaops.com/docs.html
echo.
echo Proximos passos:
echo 1. Aguarde 2-5 minutos para o deploy (GitHub Actions)
echo 2. Configure integracao do trial com seu CRM
echo 3. Conecte status page com API de monitoring
echo 4. Expanda a documentacao para todos os produtos
echo.
echo Desenvolvido por: Nicolas Avila
echo avilaops.com ^| github.com/avilaops
echo.
pause
