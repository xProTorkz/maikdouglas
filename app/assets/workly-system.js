/**
 * WORKLY SYSTEM CORE
 * Sistema completo de:
 * 1. Autenticação e Login Real (com alternância entre Contratante e Prestador)
 * 2. Chat Interno em Tempo Real entre Contratante e Prestador com Escrow
 * 3. Submenus (Propostas, Extrato Pay, Score Detalhado, Suporte Wex AI, Configurações)
 */

(function () {
  const API_BASE = '/api/v1';

  // 1. GESTÃO DE USUÁRIO E SESSÃO
  const defaultUser = {
    id: 'user-001-prof',
    nome: 'Lucas Vinícius',
    email: 'lucas@workly.com',
    role: 'profissional',
    tipoPessoa: 'pf',
    profissao: 'Especialista Elétrica & Full-Stack',
    worklyScore: 885,
    scoreTier: 'ouro',
    avatar: '🧑‍💻',
    saldo: 1450.00
  };

  function getCurrentUser() {
    try {
      const saved = localStorage.getItem('workly_user');
      return saved ? JSON.parse(saved) : defaultUser;
    } catch (e) {
      return defaultUser;
    }
  }

  function setCurrentUser(user, token) {
    localStorage.setItem('workly_user', JSON.stringify(user));
    if (token) localStorage.setItem('workly_token', token);
    updateInterfaceUser();
  }

  function updateInterfaceUser() {
    const user = getCurrentUser();
    // Atualiza card na sidebar se existir
    const userCard = document.querySelector('.workly-user-card');
    if (userCard) {
      userCard.innerHTML = `
        <div style="position: relative;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(15,111,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px;">
            ${user.avatar || '👤'}
          </div>
          <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #10b981; border-radius: 50%; border: 2px solid #0b1530;"></span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 12px; font-weight: 700; color: #fff; truncate;">${user.nome}</div>
          <div style="font-size: 10px; color: #94a3b8;">${user.role === 'empresa' || user.role === 'contratante' ? '🏢 Contratante' : 'Score: <strong style="color: #60a5fa;">' + (user.worklyScore || 885) + ' pts</strong>'}</div>
        </div>
        <button onclick="window.worklyShowAccountSwitcher()" style="background: none; border: none; font-size: 14px; cursor: pointer; color: #94a3b8;" title="Trocar Perfil">🔄</button>
      `;
    }
  }

  // 2. FUNÇÕES DE AUTENTICAÇÃO PÚBLICAS
  window.worklySwitchDemo = async function (type) {
    let email = 'lucas@workly.com';
    if (type === 'contratante_pj') email = 'lara@nubank.com.br';
    if (type === 'contratante_pf') email = 'carlos@gmail.com';

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: '123456' })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user, data.token);
        alert(`Logado com sucesso como: ${data.user.nome} (${data.user.role.toUpperCase()})`);
        window.location.href = data.user.role === 'empresa' ? '/empresas' : '/home';
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.worklyLogout = function () {
    localStorage.removeItem('workly_user');
    localStorage.removeItem('workly_token');
    alert('Você saiu da sua conta.');
    window.location.href = '/login';
  };

  window.worklyShowAccountSwitcher = function () {
    const overlay = document.createElement('div');
    overlay.className = 'workly-sub-modal';
    overlay.innerHTML = `
      <div class="workly-sub-card" style="max-width: 440px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 800;">Alternar Perfil Ativo</h3>
          <button onclick="this.closest('.workly-sub-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">Escolha com qual perfil você deseja operar na plataforma:</p>
        
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button onclick="window.worklySwitchDemo('prestador'); this.closest('.workly-sub-modal').remove();" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(15,111,255,0.15); border: 1px solid rgba(15,111,255,0.4); border-radius: 16px; color: #fff; text-align: left; cursor: pointer;">
            <span style="font-size: 26px;">🧑‍💻</span>
            <div>
              <div style="font-weight: 700; font-size: 14px;">Lucas Vinícius (Prestador)</div>
              <div style="font-size: 11px; color: #60a5fa;">Especialista · Score 885 · Saldo R$ 1.450</div>
            </div>
          </button>

          <button onclick="window.worklySwitchDemo('contratante_pj'); this.closest('.workly-sub-modal').remove();" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(138,63,252,0.15); border: 1px solid rgba(138,63,252,0.4); border-radius: 16px; color: #fff; text-align: left; cursor: pointer;">
            <span style="font-size: 26px;">💼</span>
            <div>
              <div style="font-weight: 700; font-size: 14px;">Lara — RH Nubank (Empresa PJ)</div>
              <div style="font-size: 11px; color: #c084fc;">Contratante Corporativo · Vagas Ativas</div>
            </div>
          </button>

          <button onclick="window.worklySwitchDemo('contratante_pf'); this.closest('.workly-sub-modal').remove();" style="display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; color: #fff; text-align: left; cursor: pointer;">
            <span style="font-size: 26px;">🏢</span>
            <div>
              <div style="font-weight: 700; font-size: 14px;">Carlos Mendes (Contratante PF)</div>
              <div style="font-size: 11px; color: #94a3b8;">Contratante Residencial · 2 Chamados</div>
            </div>
          </button>

          <button onclick="window.worklyLogout(); this.closest('.workly-sub-modal').remove();" style="margin-top: 6px; padding: 10px; background: transparent; border: 1px solid rgba(239,68,68,0.4); color: #f87171; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
            🚪 Sair da Conta (Logout)
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  };

  // 3. SISTEMA DE CHAT INTERNO EM TEMPO REAL
  let activeConversationId = 'conv-01';

  window.worklyOpenChat = async function (convId = 'conv-01') {
    activeConversationId = convId;
    // Remove chat anterior se existir
    const existing = document.getElementById('workly-chat-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'workly-chat-modal';
    overlay.className = 'workly-chat-overlay';

    overlay.innerHTML = `
      <div class="workly-chat-window">
        <!-- SIDEBAR DE CONVERSAS -->
        <div class="workly-chat-sidebar">
          <div class="workly-chat-sidebar-header">
            <span style="font-weight: 800; font-size: 15px; color: #fff;">💬 Conversas</span>
            <button onclick="document.getElementById('workly-chat-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
          </div>
          <div id="workly-conv-list" class="workly-chat-conv-list">
            <div style="color: #64748b; font-size: 12px; text-align: center; padding: 20px;">Carregando conversas...</div>
          </div>
        </div>

        <!-- JANELA PRINCIPAL DE MENSAGENS -->
        <div class="workly-chat-main">
          <div id="workly-chat-header" class="workly-chat-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span id="chat-header-avatar" style="font-size: 24px;">💼</span>
              <div>
                <div id="chat-header-title" style="font-weight: 700; font-size: 15px; color: #fff;">Lara — RH Nubank</div>
                <div id="chat-header-subtitle" style="font-size: 11px; color: #10b981;">🟢 Online · Garantia Workly Escrow Ativa</div>
              </div>
            </div>
            <div id="chat-header-actions" style="display: flex; gap: 8px;">
              <button onclick="window.worklyReleaseEscrow()" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; cursor: pointer;">
                🛡️ Liberar Pix Escrow
              </button>
            </div>
          </div>

          <div id="workly-messages-box" class="workly-chat-messages-container">
            <div style="color: #64748b; font-size: 13px; text-align: center; margin: auto;">Carregando histórico...</div>
          </div>

          <!-- INPUT DE MENSAGEM -->
          <div class="workly-chat-input-area">
            <input id="workly-chat-input" type="text" placeholder="Digite sua mensagem ou proposta..." style="flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 12px 18px; border-radius: 9999px; outline: none; font-size: 14px;" onkeydown="if(event.key==='Enter') window.worklySendChatMessage()">
            <button onclick="window.worklySendProposalPrompt()" style="background: rgba(138,63,252,0.2); border: 1px solid rgba(138,63,252,0.4); color: #c084fc; padding: 10px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; cursor: pointer;">
              💼 Proposta
            </button>
            <button onclick="window.worklySendChatMessage()" style="background: linear-gradient(135deg, #0F6FFF 0%, #8A3FFC 100%); border: none; color: #fff; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(15,111,255,0.4);">
              ➤
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    await loadConversationsList();
    await loadMessages(activeConversationId);
  };

  async function loadConversationsList() {
    try {
      const res = await fetch(`${API_BASE}/conversations`);
      const data = await res.json();
      const listEl = document.getElementById('workly-conv-list');
      if (!listEl) return;

      listEl.innerHTML = '';
      data.conversations.forEach(c => {
        const item = document.createElement('div');
        item.className = `workly-conv-card ${c.id === activeConversationId ? 'active' : ''}`;
        item.onclick = () => {
          activeConversationId = c.id;
          document.querySelectorAll('.workly-conv-card').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
          loadMessages(c.id);
        };

        item.innerHTML = `
          <div style="font-size: 24px; width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center;">
            ${c.interlocutorAvatar || '👤'}
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #fff;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.interlocutorNome}</span>
              <span style="font-size: 10px; color: #94a3b8;">${c.lastMessageTime}</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">
              ${c.lastMessage}
            </div>
          </div>
        `;
        listEl.appendChild(item);
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function loadMessages(convId) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${convId}/messages`);
      const data = await res.json();
      const box = document.getElementById('workly-messages-box');
      if (!box) return;

      const user = getCurrentUser();
      const interlocutorNome = data.conversation.contratanteId === user.id ? data.conversation.prestadorNome : data.conversation.contratanteNome;
      const interlocutorAvatar = data.conversation.contratanteId === user.id ? data.conversation.prestadorAvatar : data.conversation.contratanteAvatar;

      // Atualiza header
      document.getElementById('chat-header-title').textContent = interlocutorNome;
      document.getElementById('chat-header-avatar').textContent = interlocutorAvatar;
      document.getElementById('chat-header-subtitle').textContent = `🟢 Vaga: ${data.conversation.jobTitle || 'Serviço'} · Status: ${data.conversation.status.toUpperCase()}`;

      box.innerHTML = '';

      data.messages.forEach(m => {
        const isMe = m.senderId === user.id || (user.role === 'profissional' && m.senderRole === 'prestador') || (user.role !== 'profissional' && m.senderRole === 'contratante');

        if (m.type === 'escrow_release') {
          const sys = document.createElement('div');
          sys.className = 'workly-msg-bubble workly-msg-system';
          sys.innerHTML = m.content;
          box.appendChild(sys);
        } else if (m.type === 'proposal') {
          const prop = document.createElement('div');
          prop.className = 'workly-msg-bubble workly-msg-proposal-card';
          prop.innerHTML = `
            <div style="font-weight: 800; font-size: 14px; color: #c084fc; margin-bottom: 4px;">💼 Proposta Formal de Prestação de Serviço</div>
            <div style="font-size: 13px; color: #e2e8f0; margin-bottom: 8px;">${m.content}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 12px;">
              <span style="font-size: 12px; color: #94a3b8;">Valor Garantido (Escrow):</span>
              <span style="font-size: 15px; font-weight: 800; color: #34d399;">R$ ${Number(m.metadata?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          `;
          box.appendChild(prop);
        } else {
          const bubble = document.createElement('div');
          bubble.className = `workly-msg-bubble ${isMe ? 'workly-msg-sent' : 'workly-msg-received'}`;
          bubble.innerHTML = `
            <div style="font-size: 10px; opacity: 0.8; margin-bottom: 2px;">${isMe ? 'Você' : m.senderName}</div>
            <div>${m.content}</div>
          `;
          box.appendChild(bubble);
        }
      });

      box.scrollTop = box.scrollHeight;
    } catch (e) {
      console.error(e);
    }
  }

  window.worklySendChatMessage = async function () {
    const input = document.getElementById('workly-chat-input');
    if (!input || !input.value.trim()) return;

    const content = input.value.trim();
    input.value = '';

    const user = getCurrentUser();

    try {
      const res = await fetch(`${API_BASE}/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          senderId: user.id,
          senderName: user.nome
        })
      });

      if (res.ok) {
        await loadMessages(activeConversationId);
        await loadConversationsList();
        // Recarrega após 1.4s para mostrar a resposta do interlocutor
        setTimeout(() => {
          loadMessages(activeConversationId);
          loadConversationsList();
        }, 1400);
      }
    } catch (e) {
      console.error(e);
    }
  };

  window.worklySendProposalPrompt = function () {
    const valor = prompt('Informe o valor da proposta em R$:', '350');
    if (!valor) return;
    const desc = prompt('Descrição breve do escopo:', 'Serviço completo com entrega em 48h e garantia');

    const user = getCurrentUser();
    fetch(`${API_BASE}/conversations/${activeConversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: desc || 'Proposta de serviço',
        type: 'proposal',
        metadata: { valor: parseFloat(valor) }
      })
    }).then(() => {
      loadMessages(activeConversationId);
      loadConversationsList();
    });
  };

  window.worklyReleaseEscrow = async function () {
    if (!confirm('Deseja liberar o pagamento em custódia Pix para o prestador? Esta ação confirma a conclusão do serviço.')) return;
    try {
      const res = await fetch(`${API_BASE}/conversations/${activeConversationId}/release-escrow`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Pagamento liberado com sucesso!');
        loadMessages(activeConversationId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. SISTEMA DE SUBMENUS
  window.worklyOpenSubmenu = async function (type) {
    const existing = document.getElementById('workly-submenu-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'workly-submenu-modal';
    overlay.className = 'workly-sub-modal';

    let contentHtml = '';

    if (type === 'propostas') {
      const res = await fetch(`${API_BASE}/proposals`);
      const data = await res.json();
      contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800;">📋 Minhas Propostas & Contratos</h2>
          <button onclick="document.getElementById('workly-submenu-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${data.proposals.map(p => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-weight: 700; font-size: 15px; color: #fff;">${p.jobTitle}</div>
                  <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Contratante: ${p.contratanteNome}</div>
                </div>
                <div style="font-size: 16px; font-weight: 800; color: #34d399;">R$ ${p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 11px; padding: 3px 10px; border-radius: 9999px; background: ${p.status === 'concluido' ? 'rgba(16,185,129,0.2); color: #34d399;' : 'rgba(15,111,255,0.2); color: #60a5fa;'}; font-weight: 700;">
                  ${p.status.toUpperCase()}
                </span>
                <span style="font-size: 11px; color: #94a3b8;">🛡️ Garantia Pix Ativa</span>
                <button onclick="window.worklyOpenChat('conv-01'); document.getElementById('workly-submenu-modal').remove();" style="background: linear-gradient(135deg, #0F6FFF, #8A3FFC); border: none; color: #fff; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; cursor: pointer;">
                  Abrir no Chat
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'extrato') {
      const res = await fetch(`${API_BASE}/wallet/statement`);
      const data = await res.json();
      contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800;">💳 Workly Pay — Extrato & Saque Pix</h2>
          <button onclick="document.getElementById('workly-submenu-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15)); border: 1px solid rgba(16,185,129,0.3); padding: 16px; border-radius: 18px;">
            <div style="font-size: 11px; color: #94a3b8;">Saldo Disponível</div>
            <div style="font-size: 22px; font-weight: 800; color: #34d399; margin-top: 4px;">R$ ${data.saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 16px; border-radius: 18px;">
            <div style="font-size: 11px; color: #94a3b8;">Retido em Custódia (Escrow)</div>
            <div style="font-size: 22px; font-weight: 800; color: #60a5fa; margin-top: 4px;">R$ ${data.saldoEmCustodia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <button onclick="window.worklyShowPixEscrowModal()" style="padding: 12px; background: rgba(16,185,129,0.18); border: 1px solid #10b981; color: #34d399; font-weight: 700; border-radius: 14px; cursor: pointer; font-size: 12px;">
            ⚡ Pagar com Custódia Pix
          </button>
          <button onclick="window.worklyValidateCodeModal()" style="padding: 12px; background: rgba(15,111,255,0.18); border: 1px solid #3b82f6; color: #60a5fa; font-weight: 700; border-radius: 14px; cursor: pointer; font-size: 12px;">
            🔑 Liberar com Código
          </button>
        </div>
        <button onclick="window.worklyWithdrawPrompt()" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #0F6FFF, #8A3FFC); border: none; color: #fff; font-weight: 700; border-radius: 14px; cursor: pointer; margin-bottom: 20px;">
          ⚡ Solicitar Saque Pix Instantâneo
        </button>
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">Últimas Transações</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${data.transactions.map(t => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 14px;">
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #fff;">${t.descricao}</div>
                <div style="font-size: 10px; color: #94a3b8;">${t.data}</div>
              </div>
              <div style="font-weight: 700; font-size: 14px; color: ${t.valor > 0 ? '#34d399' : '#f87171'};">
                ${t.valor > 0 ? '+' : ''} R$ ${Math.abs(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'score') {
      const res = await fetch(`${API_BASE}/score/breakdown`);
      const data = await res.json();
      contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800;">⭐ Workly Score — Pilares de Reputação</h2>
          <button onclick="document.getElementById('workly-submenu-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(15,111,255,0.15), rgba(138,63,252,0.15)); border-radius: 20px; margin-bottom: 20px;">
          <div style="font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${data.scoreAtual}</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff;">Nível ${data.nivel}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">${data.posicaoRanking}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          ${data.pilares.map(p => `
            <div style="background: rgba(255,255,255,0.04); padding: 12px 16px; border-radius: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                <span style="font-weight: 600; color: #fff;">${p.nome} (Peso ${p.peso})</span>
                <span style="color: #60a5fa; font-weight: 700;">${p.pontuacao}/100</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;">
                <div style="width: ${p.pontuacao}%; height: 100%; background: linear-gradient(90deg, #0F6FFF, #8A3FFC); border-radius: 9999px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 14px; padding: 14px; font-size: 12px; color: #fcd34d;">
          🦁 <strong>Dica do Wex:</strong> ${data.dicaDoWex}
        </div>
        <div style="margin-top: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 14px;">
          <div style="font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 6px;">🎮 Simulador de Impacto no Score & Taxa</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">Veja como cada entrega pontual e avaliação afeta seu Score e reduz a taxa de intermediação:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.worklySimulateScoreChange(15, 'Serviço Concluído no Prazo')" style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              +15 pts no Prazo
            </button>
            <button onclick="window.worklySimulateScoreChange(25, 'Avaliação 5 Estrelas')" style="background: rgba(15,111,255,0.12); border: 1px solid rgba(15,111,255,0.3); color: #60a5fa; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              +25 pts 5 Estrelas
            </button>
            <button onclick="window.worklySimulateScoreChange(20, 'Curso Workly Academy')" style="background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); color: #c084fc; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              +20 pts Academy
            </button>
            <button onclick="window.worklySimulateScoreChange(-60, 'Cancelamento Injustificado')" style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              -60 pts Cancelamento
            </button>
          </div>
        </div>
      `;
    } else if (type === 'wex_ai') {
      contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 28px;">🦁</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 800;">Wex AI — Suporte & Guia Oficial</h3>
              <span style="font-size: 11px; color: #10b981;">🟢 Inteligência Artificial Ativa 24/7</span>
            </div>
          </div>
          <button onclick="document.getElementById('workly-submenu-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <div id="wex-ai-chat-box" style="height: 280px; overflow-y: auto; background: rgba(0,0,0,0.25); border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 14px;">
          <div style="align-self: flex-start; max-width: 85%; background: rgba(255,255,255,0.06); padding: 10px 14px; border-radius: 16px; font-size: 13px; color: #fff;">
            Olá! Sou o <strong>Wex</strong>. Pergunte-me qualquer dúvida sobre como funciona a garantia de pagamento, o Workly Score, a contratação Express ou taxas!
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <input id="wex-ai-input" type="text" placeholder="Ex: Como funciona o pagamento garantido via Pix?" style="flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 10px 16px; border-radius: 12px; font-size: 13px; outline: none;" onkeydown="if(event.key==='Enter') window.worklyAskWex()">
          <button onclick="window.worklyAskWex()" style="background: linear-gradient(135deg, #0F6FFF, #8A3FFC); border: none; color: #fff; padding: 10px 18px; border-radius: 12px; font-weight: 700; cursor: pointer;">
            Perguntar
          </button>
        </div>
      `;
    }

    overlay.innerHTML = `<div class="workly-sub-card">${contentHtml}</div>`;
    document.body.appendChild(overlay);
  };

  window.worklyAskWex = async function () {
    const input = document.getElementById('wex-ai-input');
    const box = document.getElementById('wex-ai-chat-box');
    if (!input || !box || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    const userBubble = document.createElement('div');
    userBubble.style.cssText = 'align-self: flex-end; max-width: 85%; background: #0F6FFF; color: #fff; padding: 10px 14px; border-radius: 16px; font-size: 13px;';
    userBubble.textContent = userText;
    box.appendChild(userBubble);
    box.scrollTop = box.scrollHeight;

    try {
      const res = await fetch(`${API_BASE}/support/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      const botBubble = document.createElement('div');
      botBubble.style.cssText = 'align-self: flex-start; max-width: 85%; background: rgba(255,255,255,0.08); color: #fff; padding: 10px 14px; border-radius: 16px; font-size: 13px;';
      botBubble.innerHTML = `🦁 <strong>Wex:</strong> ${data.reply}`;
      box.appendChild(botBubble);
      box.scrollTop = box.scrollHeight;
    } catch (e) {
      console.error(e);
    }
  };

  window.worklyWithdrawPrompt = function () {
    const valor = prompt('Informe o valor para saque Pix imediato em R$:', '500');
    if (!valor) return;
    const chave = prompt('Informe sua chave Pix (CPF/Email/Telefone):', 'lucas@workly.com');

    fetch(`${API_BASE}/wallet/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: parseFloat(valor), chavePix: chave })
    })
      .then(r => r.json())
      .then(d => {
        alert(d.mensagem || 'Saque processado com sucesso!');
        window.worklyOpenSubmenu('extrato');
      });
  };

  // 4.1. MODAL DE CUSTÓDIA PIX (ESCROW IN-APP)
  window.worklyShowPixEscrowModal = async function () {
    const valorPadrao = 350;
    try {
      const res = await fetch(`${API_BASE}/wallet/escrow/generate-pix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: valorPadrao, titulo: 'Serviço com Garantia Workly Escrow' })
      });
      const data = await res.json();

      const existing = document.getElementById('workly-escrow-pix-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'workly-escrow-pix-modal';
      modal.className = 'workly-sub-modal';
      modal.innerHTML = `
        <div class="workly-sub-card" style="max-width: 440px; text-align: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #fff;">🛡️ Pagamento Seguro com Custódia Pix</h3>
            <button onclick="document.getElementById('workly-escrow-pix-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
            O valor fica blindado no <strong>Workly Escrow</strong> e só é liberado para o prestador quando você validar o código de conclusão no local.
          </div>
          <div style="font-size: 26px; font-weight: 800; color: #34d399; margin-bottom: 12px;">
            R$ ${Number(data.valor).toFixed(2)}
          </div>
          <div style="background: #fff; padding: 12px; border-radius: 16px; display: inline-block; margin-bottom: 14px;">
            <img src="${data.qrCodeUrl}" alt="QR Code Pix" style="width: 180px; height: 180px; display: block;" />
          </div>
          <div style="background: rgba(255,255,255,0.06); padding: 10px; border-radius: 12px; font-family: monospace; font-size: 10px; color: #cbd5e1; word-break: break-all; margin-bottom: 12px; text-align: left;">
            ${data.pixCopiaECola}
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 14px;">
            <button onclick="navigator.clipboard.writeText('${data.pixCopiaECola}'); alert('Código Pix Copia e Cola copiado com sucesso!');" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
              📋 Copiar Código Pix
            </button>
            <button onclick="window.worklySimulatePixConfirm('${data.txid}', ${data.valor}, '${data.codigoSeguranca}')" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #10b981, #059669); border: none; color: #fff; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
              ⚡ Simular Confirmação Pix
            </button>
          </div>
          <div id="escrow-pix-status-feedback" style="font-size: 11px; color: #f59e0b;">
            ⏳ Aguardando leitura do QR Code ou pagamento via Pix...
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar cobrança Pix.');
    }
  };

  window.worklySimulatePixConfirm = async function (txid, valor, codigo) {
    try {
      const res = await fetch(`${API_BASE}/wallet/escrow/simulate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txid, valor, codigoSeguranca: codigo })
      });
      const data = await res.json();
      const feedback = document.getElementById('escrow-pix-status-feedback');
      if (feedback) {
        feedback.innerHTML = `
          <div style="background: rgba(16,185,129,0.2); border: 1px solid #10b981; border-radius: 12px; padding: 12px; margin-top: 10px; text-align: left;">
            <div style="color: #34d399; font-weight: 700; font-size: 13px;">✅ Pagamento Confirmado em Custódia!</div>
            <div style="color: #fff; font-size: 11px; margin-top: 4px;">Código de Liberação do Cliente:</div>
            <div style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #60a5fa; text-align: center; margin: 8px 0; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 8px;">
              ${data.codigoSeguranca}
            </div>
            <div style="color: #94a3b8; font-size: 10px;">Forneça este código ao prestador apenas após a finalização do serviço.</div>
          </div>
        `;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4.2. VALIDADOR DE CÓDIGO DE LIBERAÇÃO
  window.worklyValidateCodeModal = function () {
    const existing = document.getElementById('workly-validate-code-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'workly-validate-code-modal';
    modal.className = 'workly-sub-modal';
    modal.innerHTML = `
      <div class="workly-sub-card" style="max-width: 400px; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #fff;">🔑 Liberar Pagamento com Código</h3>
          <button onclick="document.getElementById('workly-validate-code-modal').remove()" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">
          Digite o código de 6 dígitos fornecido pelo contratante para liberar o saldo retido em custódia.
        </p>
        <input id="workly-escrow-code-input" type="text" maxlength="6" placeholder="Ex: 849201" style="width: 100%; text-align: center; font-size: 24px; letter-spacing: 6px; font-weight: 800; padding: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: #fff; margin-bottom: 16px; outline: none;" />
        <button onclick="window.worklyExecuteCodeValidation()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #0F6FFF, #8A3FFC); border: none; color: #fff; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer;">
          Validar e Liberar Pagamento
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.worklyExecuteCodeValidation = async function () {
    const input = document.getElementById('workly-escrow-code-input');
    if (!input || input.value.trim().length !== 6) {
      alert('Por favor, informe o código de 6 dígitos completo.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/wallet/escrow/validate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: input.value.trim(), valorBruto: 350 })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.mensagem);
        const modal = document.getElementById('workly-validate-code-modal');
        if (modal) modal.remove();

        // Aumenta pontuação do usuário e atualiza sessão
        const user = getCurrentUser();
        user.worklyScore = Math.min(1000, (user.worklyScore || 885) + 25);
        if (user.worklyScore >= 900) user.scoreTier = 'diamante';
        setCurrentUser(user);
        window.worklyOpenSubmenu('score');
      } else {
        alert(data.error || 'Código inválido.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao validar código.');
    }
  };

  // 4.3. SIMULADOR REATIVO DE SCORE (IN-APP)
  window.worklySimulateScoreChange = function (delta, motivo) {
    const user = getCurrentUser();
    const anterior = user.worklyScore || 885;
    const novo = Math.max(0, Math.min(1000, anterior + delta));
    user.worklyScore = novo;
    if (novo >= 900) user.scoreTier = 'diamante';
    else if (novo >= 700) user.scoreTier = 'ouro';
    else if (novo >= 400) user.scoreTier = 'prata';
    else user.scoreTier = 'bronze';

    setCurrentUser(user);
    alert(`${delta > 0 ? '🎉 +' : '⚠️ '}${delta} pontos no Workly Score (${motivo})\nNovo Score: ${novo} pts (Nível ${user.scoreTier.toUpperCase()})`);
    window.worklyOpenSubmenu('score');
  };

  // 5. INICIALIZAÇÃO E INTERCEPTADORES NA INTERFACE
  function initEnhancements() {
    updateInterfaceUser();

    // Se estiver na rota /chat, abre o chat interno automaticamente!
    if (window.location.pathname.includes('/chat')) {
      setTimeout(() => {
        window.worklyOpenChat();
      }, 300);
    }

    // Na tela de login, injeta os botões de demo rápidos e formulário
    if (window.location.pathname.includes('/login')) {
      injectLoginShortcuts();
    }
  }

  function injectLoginShortcuts() {
    if (document.getElementById('workly-login-shortcuts')) return;
    const form = document.querySelector('form');
    if (form) {
      const shortcuts = document.createElement('div');
      shortcuts.id = 'workly-login-shortcuts';
      shortcuts.style.cssText = 'background: rgba(15,111,255,0.1); border: 1px solid rgba(15,111,255,0.3); border-radius: 18px; padding: 14px; margin-bottom: 16px;';
      shortcuts.innerHTML = `
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #60a5fa; margin-bottom: 8px;">
          ⚡ Acesso Rápido com Contas Reais (1 Clique):
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button type="button" onclick="window.worklySwitchDemo('prestador')" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px; border-radius: 12px; font-size: 11px; font-weight: 700; cursor: pointer; text-align: left;">
            🧑‍💻 Prestador Demo<br><span style="font-size: 9px; color: #94a3b8;">Lucas · Score 885</span>
          </button>
          <button type="button" onclick="window.worklySwitchDemo('contratante_pj')" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px; border-radius: 12px; font-size: 11px; font-weight: 700; cursor: pointer; text-align: left;">
            💼 Contratante PJ<br><span style="font-size: 9px; color: #94a3b8;">Lara · Nubank</span>
          </button>
        </div>
      `;
      form.parentNode.insertBefore(shortcuts, form);
    }
  }

  // Intercepta rotas e cliques
  window.addEventListener('popstate', () => {
    if (window.location.pathname.includes('/chat')) {
      window.worklyOpenChat();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
  } else {
    initEnhancements();
  }
})();
