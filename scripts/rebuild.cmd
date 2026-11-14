@echo off
rem Rebuild the mascot dots and push them into the client module.
rem Usage: scripts\rebuild.cmd   (run from the plugin folder or anywhere)
setlocal
cd /d "%~dp0.."

set "PY=%~dp0..\..\..\..\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
if not exist "%PY%" set "PY=python"

echo [1/3] sampling artwork -> grids
"%PY%" "%~dp0build_girl.py" || goto :fail

echo [2/3] splicing blocks into client.js
node "%~dp0splice.mjs" || goto :fail

echo [3/3] injecting grids
node "%~dp0build.mjs" || goto :fail

echo.
echo done. refresh the dsh window (Ctrl+R) to see it.
exit /b 0

:fail
echo.
echo FAILED - nothing was installed.
exit /b 1
