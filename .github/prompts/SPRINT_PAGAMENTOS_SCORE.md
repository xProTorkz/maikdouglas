# 🚀 PROMPT DE ENGENHARIA PARA A FILA DO GITHUB (TASK RUNNER / COPILOT WORKSPACE)

**Repositório:** `xProTorkz/maikdouglas`  
**Projeto:** Workly — O SuperApp do Trabalho que Conecta  
**Escopo:** Implementação Completa do Sistema de Pagamentos Pix (Escrow), Split Financeiro, Motor Reativo de Workly Score e Telas In-App  
**Prioridade:** Alta / P0  

---

## 🎯 OBJETIVO DA SPRINT

Conectar de ponta a ponta o ciclo financeiro e reputacional da plataforma Workly diretamente dentro do aplicativo:
1. **Contratação com Custódia Segura (Escrow):** O contratante gera e paga uma cobrança Pix dinâmica. O valor fica retido na custódia do Workly.
2. **Split de Pagamento Automático:** Cálculo dinâmico da taxa da plataforma (8% a 15% de acordo com o Score do prestador) e provisão de 1,5% para o Fundo de Garantia.
3. **Liberação por Código de 6 Dígitos / QR Code:** No momento da conclusão presencial do serviço, o contratante valida o código de segurança, liberando o valor líquido instantaneamente para a carteira do prestador.
4. **Motor de Recálculo de Workly Score:** Cada avaliação (1 a 5 estrelas), pontualidade de entrega e ausência de disputas recalcula dinamicamente a pontuação (0 a 1000) e atualiza o tier do prestador (Bronze, Prata, Ouro, Diamante) com atualização visual imediata no app.

---

## 📦 ITENS A IMPLEMENTAR NA ESTEIRA

### 1. BACKEND: FINTECH, PIX & CUSTÓDIA
- [ ] **Gateway Pix & Webhook de Confirmação:**
  - Em `backend/src/services/pixService.ts`, implementar gerador de payload EMV (Pix Copia e Cola) compatível com o padrão Bacen e geração de QR Code.
  - Implementar endpoint `POST /api/v1/wallet/webhook-pix` para recepção assíncrona de status do gateway (`CONCLUIDA`, `PAGO`).
  - Ao receber o webhook, transicionar o contrato para `em_custodia` e registrar o crédito na tabela `transactions`.
- [ ] **Split e Retenção no Escrow:**
  - Em `backend/src/services/escrowService.ts`, aplicar a regra de comissão inversamente proporcional ao Workly Score do prestador:
    - Diamante (900-1000): 8% de taxa
    - Ouro (700-899): 10% de taxa
    - Prata (400-699): 12% de taxa
    - Bronze (0-399): 15% de taxa
    - Fundo de Garantia: 1,5% fixo retido em todas as transações
- [ ] **Liberação e Payout (Saque Pix):**
  - Implementar validação do código de 6 dígitos no endpoint `POST /api/v1/wallet/escrow/release`.
  - Implementar saque instantâneo para chaves Pix no endpoint `POST /api/v1/wallet/withdraw`, debitando do saldo disponível e gerando comprovante com protocolo.

### 2. BACKEND: MOTOR DINÂMICO DE REPUTAÇÃO (WORKLY SCORE)
- [ ] **Serviço de Recálculo Reativo:**
  - Em `backend/src/services/scoreService.ts`, criar método `recalcularScoreAposConclusao(userId, reviewData)`.
  - Pesos da fórmula: Pontualidade (35%), Qualidade/Estrelas (35%), Volume de Entregas (20%), Cursos Academy (10%).
  - Penalidades aplicáveis: Cancelamento após aceite (-60 pts), Disputa aberta com dolo comprovado (-150 pts).
- [ ] **Endpoint de Simulação e Detalhamento:**
  - Atualizar `GET /api/v1/score` e `GET /api/v1/score/breakdown` para retornar os dados dinâmicos do banco relacional com projeção de economia na comissão.

### 3. FRONTEND: TELAS E COMPONENTES IN-APP
- [ ] **Modal de Pagamento com Pix e Custódia:**
  - Card responsivo exibindo valor total, detalhamento da garantia e QR Code Pix renderizado com botão de "Copiar Código Pix".
  - Botão de simulação e feedback em tempo real de pagamento confirmado.
- [ ] **Input de Validação de Código de Conclusão:**
  - Campo com 6 dígitos no Chat Interno e no painel de propostas ativas para o contratante homologar o serviço.
- [ ] **Painel Workly Pay (`/pay` e Submenu Extrato):**
  - Indicadores em tempo real de Saldo Disponível vs. Saldo em Custódia.
  - Histórico de transações com filtros por tipo (crédito, custódia, saque Pix).
  - Modal funcional de saque com inserção de chave Pix.
- [ ] **Painel Workly Score (`/score` e Submenu):**
  - Medidor de pontuação estilo velocímetro/barra com faixa de nível atual e progresso para o próximo nível.
  - Simulador interativo: o usuário testa o impacto de 1 serviço no prazo e 1 avaliação 5 estrelas no seu score.

---

## 🧪 CRITÉRIOS DE ACEITAÇÃO
1. `npm run build` no backend compila com 0 erros de TypeScript (`tsc`).
2. Contratar um serviço gera um contrato no status `aguardando_pagamento` com código de liberação aleatório de 6 dígitos.
3. Simulação de pagamento Pix via webhook altera status para `em_custodia`.
4. Validação do código de segurança libera o valor líquido para o prestador e retém a taxa da plataforma.
5. Liberação dispara o recálculo do Workly Score e atualiza o nível do prestador em tempo real.
6. Código versionado e comitado com Conventional Commits na branch `main`.
