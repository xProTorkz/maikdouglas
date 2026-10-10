#!/bin/bash
# ==============================================================================
# SCRIPT OFICIAL DE DEPLOY AUTOMATIZADO NA VPS — WORKLY BRASIL
# ==============================================================================
set -e

echo "=================================================="
echo "    🚀 INICIANDO DEPLOY NA VPS — WORKLY BRASIL   "
echo "=================================================="

# 1. Verifica e Instala Docker se necessário (Ubuntu/Debian)
if ! command -v docker &> /dev/null; then
    echo "📦 Instalando Docker na VPS..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# 2. Verifica e instala Docker Compose plugin
if ! docker compose version &> /dev/null; then
    echo "📦 Instalando Docker Compose Plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# 3. Diretório da aplicação
APP_DIR="/opt/workly"
if [ ! -d "$APP_DIR" ]; then
    echo "📂 Clonando repositório Workly em $APP_DIR..."
    git clone https://github.com/xProTorkz/maikdouglas.git "$APP_DIR"
    cd "$APP_DIR"
else
    echo "🔄 Atualizando repositório existente..."
    cd "$APP_DIR"
    git pull origin main
fi

# 4. Executa build e sobe os contêineres Docker (App + PostgreSQL)
echo "🔨 Construindo imagens e iniciando contêineres (App + PostgreSQL)..."
docker compose down || true
docker compose up -d --build

# 5. Aguarda inicialização dos serviços
echo "⏳ Aguardando serviços estabilizarem..."
sleep 8

# 6. Teste de Healthcheck Local
echo "🩺 Verificando status da aplicação..."
HEALTH_STATUS=$(curl -s http://localhost:4000/health || echo "ERRO")

echo "=================================================="
echo "    ✅ DEPLOY CONCLUÍDO COM SUCESSO NA VPS!       "
echo "=================================================="
echo "Status do Healthcheck: $HEALTH_STATUS"
echo "🌐 Acesso Web: http://$(curl -s ifconfig.me):4000/login"
echo "=================================================="
