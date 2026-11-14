@echo off
rem Render the current grids to scripts\preview-grid.png
setlocal
cd /d "%~dp0.."

set "PY=%~dp0..\..\..\..\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
if not exist "%PY%" set "PY=python"

"%PY%" "%~dp0preview.py"
