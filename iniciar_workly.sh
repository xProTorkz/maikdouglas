#!/bin/bash
# ==============================================================================
# WORKLY — SUPERAPP DO TRABALHO QUE CONECTA
# Script Launcher Oficial (Fullstack: API REST + WebSockets + Frontend SPA)
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
PORT=4000

# Adiciona caminhos padrão do Node/npm no macOS
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "=================================================="
echo "    🚀 WORKLY — Trabalho que Conecta (Fullstack)   "
echo "=================================================="
echo "📁 Diretório Raiz: $ROOT_DIR"
echo "🔌 Porta: $PORT"
echo "📡 API Healthcheck: http://localhost:$PORT/health"
echo "💻 Acesso Web:     http://localhost:$PORT/login"
echo "=================================================="

# Verifica se o Node.js está disponível
if ! command -v node &> /dev/null; then
    echo "⚠️ Node.js não encontrado no PATH padrão. Tentando caminhos alternativos..."
    for node_path in /opt/homebrew/bin/node /usr/local/bin/node ~/.nvm/versions/node/*/bin/node; do
        if [ -x "$node_path" ]; then
            export PATH="$(dirname "$node_path"):$PATH"
            break
        fi
    done
fi

if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js é necessário para rodar o backend do Workly."
    exit 1
fi

echo "🟢 Node.js detectado: $(node -v)"

# Se dist/server.js não existir, compila
if [ ! -f "$BACKEND_DIR/dist/server.js" ]; then
    echo "🔨 Compilando o backend TypeScript..."
    (cd "$BACKEND_DIR" && npm run build)
fi

# Abre no navegador padrão do macOS
(sleep 1.5 && open "http://localhost:$PORT/login" 2>/dev/null) &

# Executa o servidor unificado Node.js
cd "$BACKEND_DIR"
node dist/server.js
