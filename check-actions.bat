@echo off
REM ========================================
REM  Verificar Status do GitHub Actions
REM  Desenvolvido por: Nicolas Avila
REM ========================================
echo ========================================
echo  Verificacao GitHub Actions
echo  Desenvolvido por: Nicolas Avila
echo ========================================
echo.

cd /d "%~dp0"

echo Obtendo ultimas execucoes do workflow...
echo.

set GITHUB_TOKEN=
gh run list --repo avilaops/avilaops --limit 10

echo.
echo ========================================
echo  Detalhes da Ultima Execucao
echo ========================================
echo.

gh run view --repo avilaops/avilaops

echo.
echo ========================================
echo  Ver logs completos da ultima execucao
echo ========================================
echo.

echo Deseja ver os logs completos? (S/N)
set /p choice=

if /i "%choice%"=="S" (
    gh run view --repo avilaops/avilaops --log
)

echo.
echo Links uteis:
echo - Actions: https://github.com/avilaops/avilaops/actions
echo - Workflows: https://github.com/avilaops/avilaops/actions/workflows
echo - Settings: https://github.com/avilaops/avilaops/settings/pages
echo.
echo Desenvolvido por: Nicolas Avila
echo avilaops.com ^| github.com/avilaops
echo.
pause
