@echo off
REM ========================================
REM  Corrigir GitHub Actions Automaticamente
REM  Desenvolvido por: Nicolas Avila
REM ========================================
echo ========================================
echo  Correcao GitHub Actions
echo  Desenvolvido por: Nicolas Avila
echo ========================================
echo.

cd /d "%~dp0"

echo [ETAPA 1] Listando workflows...
echo.
set GITHUB_TOKEN=
gh workflow list --repo avilaops/avilaops

echo.
echo ========================================
echo.

echo [ETAPA 2] Desabilitando workflow CI/CD...
echo.
echo Procurando workflow ci.yml...
gh workflow list --repo avilaops/avilaops --json id,name,path | findstr /i "ci.yml"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Workflow ci.yml encontrado!
    echo.
    echo Deseja desabilitar? (S/N)
    set /p choice=
    
    if /i "%choice%"=="S" (
        echo.
        echo Desabilitando workflow...
        gh workflow disable ci.yml --repo avilaops/avilaops
        
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo ✓ Workflow desabilitado com sucesso!
        ) else (
            echo.
            echo X Erro ao desabilitar workflow
            echo Tente manualmente em: https://github.com/avilaops/avilaops/actions/workflows
        )
    )
) else (
    echo.
    echo Workflow ci.yml nao encontrado
    echo.
    echo Workflows disponiveis:
    gh workflow list --repo avilaops/avilaops
    echo.
    echo Digite o nome do arquivo do workflow para desabilitar:
    echo Exemplo: ci.yml, test.yml, pytest.yml
    echo (ou pressione Enter para pular)
    set /p workflow_file=
    
    if not "%workflow_file%"=="" (
        echo.
        echo Desabilitando %workflow_file%...
        gh workflow disable %workflow_file% --repo avilaops/avilaops
        
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo ✓ Workflow desabilitado com sucesso!
        ) else (
            echo.
            echo X Erro ao desabilitar workflow
        )
    )
)

echo.
echo ========================================
echo.

echo [ETAPA 3] Configurando permissoes...
echo.
echo Configure manualmente (se necessario):
echo 1. Acesse: https://github.com/avilaops/avilaops/settings/actions
echo 2. Em "Workflow permissions", selecione:
echo    - Read and write permissions
echo 3. Clique em Save
echo.
pause

echo.
echo ========================================
echo.

echo [ETAPA 4] Verificando status...
echo.
gh run list --repo avilaops/avilaops --limit 5

echo.
echo ========================================
echo  Concluido!
echo ========================================
echo.
echo Proximos passos:
echo 1. Verifique workflows: https://github.com/avilaops/avilaops/actions/workflows
echo 2. Verifique execucoes: https://github.com/avilaops/avilaops/actions
echo 3. Continue com: enable-https.ps1
echo.
echo Desenvolvido por: Nicolas Avila
echo avilaops.com ^| github.com/avilaops
echo.
pause
