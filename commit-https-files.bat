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
git add README-HTTPS.md
git add RESUMO.md
git add COMANDOS.md
git add HTTPS-SETUP-README.md
git add commit-https-files.bat

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  PACOTE COMPLETO - 22 ARQUIVOS                        ║
echo ║  Desenvolvido por: Nicolas Avila                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo DOCUMENTACAO (7 arquivos):
echo  ✓ HTTPS-README.md (Ponto de entrada)
echo  ✓ README-PRINCIPAL.md (Doc completa)
echo  ✓ INDEX.md (Indice)
echo  ✓ README-HTTPS.md (Guia rapido)
echo  ✓ RESUMO.md (Resumo)
echo  ✓ HTTPS-SETUP-README.md (Setup tecnico)
echo  ✓ EXECUTAR-AGORA.md (Guia de execucao) [NOVO!]
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
echo SCRIPTS (8 arquivos):
echo  ✓ enable-https.ps1 (Ativar HTTPS)
echo  ✓ check-status.ps1 (Verificar status)
echo  ✓ check-actions.ps1 (Verificar Actions)
echo  ✓ check-actions.bat (Actions batch)
echo  ✓ disable-ci-workflow.ps1 (Desabilitar workflow)
echo  ✓ fix-github-actions.ps1 (Corrigir Actions) [NOVO!]
echo  ✓ fix-github-actions.bat (Corrigir batch) [NOVO!]
echo  ✓ commit-https-files.bat (Este script)

echo.
echo Verificando status...
git status --short

echo.
echo Criando commit...
git commit -m "Add HTTPS activation scripts and troubleshooting guide - Developed by Nicolas Avila"

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
echo Proximos passos:
echo 1. Aguarde 15-30 minutos para o certificado ser provisionado
echo 2. Execute: enable-https.ps1
echo 3. Ou verifique manualmente em: https://github.com/avilaops/avilaops/settings/pages
echo.
echo Desenvolvido por: Nicolas Avila
echo avilaops.com ^| github.com/avilaops
echo.
pause
