#!/bin/bash
# Script de Execução Local do Aplicativo Workly
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/app" && pwd)"
PORT=4000

echo "=================================================="
echo "    Iniciando Workly — Trabalho que Conecta      "
echo "=================================================="
echo "Servindo diretório: $DIR"
echo "Acesse no navegador: http://localhost:$PORT"
echo "Para encerrar, pressione Ctrl + C"
echo "=================================================="

open "http://localhost:$PORT" 2>/dev/null &
python3 -m http.server $PORT -d "$DIR"
