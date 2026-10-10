# 🚀 PROMPT DE PRODUÇÃO PARA A FILA DO GITHUB: PERSISTÊNCIA, PIX REAL, WEBSOCKETS & LANÇAMENTO

**Repositório:** `xProTorkz/maikdouglas`  
**Projeto:** Workly — O SuperApp do Trabalho que Conecta  
**Escopo:** Transição do Protótipo Funcional para Produção Comercial (Infraestrutura, Fintech, Persistência e PWA)  
**Prioridade:** P0 (Go-Live)  

---

## 🎯 OBJETIVO EXECUTIVO DA SPRINT DE PRODUÇÃO

Implementar os 6 pilares de produção que faltam no repositório `xProTorkz/maikdouglas` para permitir que o sistema funcione com usuários reais, transações bancárias Pix no Banco Central e persistência em banco relacional PostgreSQL/Supabase:

```
[ CONTRATANTE REAL ] ──> (App PWA / Desktop)
                             │
                             ▼
                [ BACKEND EXPRESS / WEBSOCKET ]
                   ├──> [ SUPABASE / POSTGRESQL ] (Persistência)
                   ├──> [ GATEWAY ASAAS / EFI ]   (Pix Real + Split)
                   └──> [ WEBSOCKET / PUSH ]      (Chat Instantâneo)
```

---

## 📋 BACKLOG DE TAREFAS POR SPRINT

### SPRINT 1: PERSISTÊNCIA & BANCO DE DADOS (POSTGRESQL / SUPABASE)
- [ ] **Configuração do Pool PostgreSQL:**
  - Em `backend/src/database/db.ts`, instanciar `pg.Pool` lendo `process.env.DATABASE_URL`.
  - Criar script `npm run db:migrate` para executar o `backend/src/database/schema.sql` diretamente no banco configurado.
- [ ] **Migração dos Controllers para Banco Real:**
  - `authController.ts`: Gravação de usuários reais com hash bcrypt e validação de CPF/CNPJ único.
  - `walletController.ts`: Atualização transacional de saldos (`saldo_disponivel` e `saldo_em_custodia`) dentro de transações SQL (`BEGIN ... COMMIT`).
  - `jobController.ts`: Leitura e persistência de vagas reais com geolocalização (latitude/longitude).
  - `chatController.ts`: Persistência de mensagens e contratos de custódia na tabela `contracts`.
- [ ] **Seed Inicial da Praça Piloto (Goiatuba / Região Metropolitana GO):**
  - Criar `backend/src/database/seed.ts` inserindo:
    - 50 profissionais pioneiros nas verticais prioritárias (Elétrica, Hidráulica, Gastronomia, Chaveiro).
    - 10 vagas abertas reais com orçamento e descrições realistas.

### SPRINT 2: GATEWAY PIX REAL COM SPLIT (ASAAS / EFI / MERCADO PAGO)
- [ ] **Integração do Provedor de Pagamento:**
  - Implementar client HTTP autenticado em `backend/src/services/pixService.ts`.
  - Criar cobrança Pix dinâmica com payload BRCode e QR Code oficial do Banco Central.
- [ ] **Webhook Seguro (mTLS / HMAC):**
  - Implementar endpoint `POST /api/v1/wallet/webhook-pix` com validação de token de segurança.
  - Ao receber evento `PAYMENT_RECEIVED`:
    - Atualizar contrato para `em_custodia`.
    - Executar o split de pagamento (retendo 8% a 15% na conta Workly e reservando o líquido para o prestador).
- [ ] **Payout (Saque Pix Automatizado):**
  - Em `backend/src/controllers/walletController.ts`, integrar chamada de transferência Pix para a chave do prestador ao solicitar saque.

### SPRINT 3: MENSAGERIA EM TEMPO REAL & NOTIFICAÇÕES (WEBSOCKETS)
- [ ] **Socket.io Server:**
  - Acoplar `socket.io` ao servidor HTTP do Express em `backend/src/server.ts`.
  - Eventos de sala: `join_conversation`, `send_message`, `new_message`, `escrow_status_changed`.
- [ ] **Atualização Reativa no Front-end:**
  - Conectar cliente WebSocket no `app/assets/workly-system.js` para atualizar o chat e as notificações sem refresh da página.
- [ ] **Push Notifications (PWA / FCM):**
  - Adicionar suporte a notificações push nativas no `app/service-worker.js`.

### SPRINT 4: PWA (PROGRESSIVE WEB APP) & DISTRIBUIÇÃO MOBILE
- [x] Manifesto PWA (`app/manifest.json`) e Service Worker (`app/service-worker.js`) adicionados.
- [ ] Adicionar botão discreto "📲 Instalar Aplicativo Workly" no topo do simulador celular e na sidebar desktop quando o evento `beforeinstallprompt` for disparado.

### SPRINT 5: DEPLOY EM NUVEM & INFRAESTRUTURA
- [ ] Criar `Dockerfile` multi-stage para compilação do front e back.
- [ ] Criar arquivo de configuração `render.yaml` ou `railway.json` para deploy com 1 clique com suporte a HTTPS e domínios personalizados.

---

## 🧪 CRITÉRIOS DE ACEITAÇÃO
1. Rodar `npm run build` no backend compila com 0 erros.
2. Iniciar a API com `DATABASE_URL` válida conecta ao PostgreSQL sem falhas.
3. O Webhook do Pix processa eventos com assinatura válida e altera o status do contrato para `em_custodia`.
4. As mensagens do chat são entregues em menos de 500ms entre duas abas abertas via WebSocket.
5. O aplicativo pode ser instalado no Android e iPhone através do botão de compartilhamento / PWA.
6. Commits enviados para a branch `main` no repositório `xProTorkz/maikdouglas`.
