# ==============================================================================
# WORKLY SUPERAPP — DOCKERFILE MULTI-STAGE DE PRODUÇÃO
# ==============================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências do backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copia código-fonte e compila TypeScript
COPY backend/ ./backend/
RUN cd backend && npm run build

# ==============================================================================
# STAGE 2: RUNTIME FINAL
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copia dependências instaladas e arquivos compilados
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist

# Copia arquivos estáticos do frontend SPA
COPY app/ ./app/

# Expõe a porta oficial do Workly
EXPOSE 4000

WORKDIR /app/backend

# Inicia o servidor unificado Node.js (API + WebSockets + SPA)
CMD ["node", "dist/server.js"]
