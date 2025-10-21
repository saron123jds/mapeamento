@echo off
REM Inicia o MapaFácil Market no localhost:4000
SETLOCAL ENABLEDELAYEDEXPANSION
CD /D %~dp0
IF NOT EXIST node_modules (
  echo Instalando dependencias...
  npm install
)
echo Iniciando servidor na porta 4000...
npm start
pause
