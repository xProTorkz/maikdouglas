/**
 * WORKLY — DESKTOP ENHANCER & RESPONSIVE CONTROLLER
 * Injeta a Sidebar de navegação Desktop, Topbar com alternador de visualização
 * e otimiza a experiência em telas de computador e laptops.
 */

(function () {
  const STORAGE_KEY = 'workly_view_mode';

  // Determina o modo inicial
  function getInitialMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'desktop' || saved === 'mobile-sim') return saved;
    // Se a tela for de computador (>= 1024px), modo desktop padrão
    return window.innerWidth >= 1024 ? 'desktop' : 'desktop';
  }

  let currentMode = getInitialMode();

  function setViewMode(mode) {
    currentMode = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    document.body.classList.remove('desktop-view', 'mobile-sim-view');
    if (mode === 'desktop') {
      document.body.classList.add('desktop-view');
    } else if (mode === 'mobile-sim') {
      document.body.classList.add('mobile-sim-view');
    }

    // Atualiza botões
    const btnDesktop = document.getElementById('workly-btn-mode-desktop');
    const btnMobile = document.getElementById('workly-btn-mode-mobile');
    if (btnDesktop && btnMobile) {
      if (mode === 'desktop') {
        btnDesktop.classList.add('active');
        btnMobile.classList.remove('active');
      } else {
        btnMobile.classList.add('active');
        btnDesktop.classList.remove('active');
      }
    }
  }

  // Monta a Topbar Desktop
  function renderTopbar() {
    if (document.getElementById('workly-desktop-topbar')) return;

    const topbar = document.createElement('header');
    topbar.id = 'workly-desktop-topbar';
    topbar.innerHTML = `
      <a href="/home" class="workly-topbar-brand">
        <img src="/__l5e/assets-v1/8ecfe286-e5fa-4906-99b5-be4b72dfe1e7/wex.png" alt="Wex Mascot" style="width: 38px; height: 38px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(15,111,255,0.4));">
        <span style="background: linear-gradient(135deg, #fff 0%, #93c5fd 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Workly Desktop</span>
        <span style="font-size: 11px; background: rgba(15,111,255,0.2); color: #60a5fa; padding: 2px 8px; border-radius: 9999px; font-weight: 700; border: 1px solid rgba(15,111,255,0.3);">PRO</span>
      </a>

      <!-- ALTERNADOR DE MODO DE VISUALIZAÇÃO -->
      <div class="workly-view-switcher">
        <button id="workly-btn-mode-desktop" class="workly-view-btn ${currentMode === 'desktop' ? 'active' : ''}" onclick="window.worklySetMode('desktop')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
          Computador (Expandido)
        </button>
        <button id="workly-btn-mode-mobile" class="workly-view-btn ${currentMode === 'mobile-sim' ? 'active' : ''}" onclick="window.worklySetMode('mobile-sim')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
          Simulador Celular
        </button>
      </div>

      <!-- STATUS E APRESENTAÇÃO -->
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.25);">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 8px #10b981;"></span>
          API Online (Porta 4000)
        </div>
        <button onclick="toggleWorklyPres(true)" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s;">
          ✨ Apresentação
        </button>
      </div>
    `;

    document.body.prepend(topbar);
  }

  // Monta a Sidebar Desktop
  function renderSidebar() {
    if (document.getElementById('workly-desktop-sidebar')) return;

    const pathname = window.location.pathname;

    const navItems = [
      { to: '/home', icon: '🏠', label: 'Início', group: 'Principal' },
      { to: '#vagas', action: "window.worklyOpenSubmenu('vagas')", icon: '💼', label: 'Vagas & Oportunidades', badge: '2.1k', group: 'Principal' },
      { to: '/express', icon: '⚡', label: 'Workly Express', badge: 'Urgente', group: 'Principal' },
      { to: '#chat', action: "window.worklyOpenChat('conv-01')", icon: '💬', label: 'Chat Interno Real', badge: 'Ativo', group: 'Principal' },
      { to: '/perfil', icon: '👤', label: 'Meu Perfil', group: 'Principal' },

      { to: '#propostas', action: "window.worklyOpenSubmenu('propostas')", icon: '📋', label: 'Minhas Propostas', group: 'Finanças & Garantia' },
      { to: '#extrato', action: "window.worklyOpenSubmenu('extrato')", icon: '💳', label: 'Extrato & Saque Pix', group: 'Finanças & Garantia' },
      { to: '#pagar-pix', action: "window.worklyShowPixEscrowModal()", icon: '⚡', label: 'Pagar com Custódia Pix', badge: 'Escrow', group: 'Finanças & Garantia' },
      { to: '#validar-codigo', action: "window.worklyValidateCodeModal()", icon: '🔑', label: 'Liberar com Código', group: 'Finanças & Garantia' },
      { to: '#score', action: "window.worklyOpenSubmenu('score')", icon: '⭐', label: 'Pilares & Simulador Score', group: 'Finanças & Garantia' },
      { to: '/verified', icon: '🛡️', label: 'Workly Verified', badge: 'Selo Pro', group: 'Finanças & Garantia' },

      { to: '#publicar-vaga', action: "window.worklyOpenSubmenu('publicar_vaga')", icon: '➕', label: 'Publicar Vaga', badge: 'Novo', group: 'Gestão de Vagas' },
      { to: '#meus-anuncios', action: "window.worklyOpenSubmenu('meus_anuncios')", icon: '📢', label: 'Meus Anúncios', group: 'Gestão de Vagas' },

      { to: '#wex-ai', action: "window.worklyOpenSubmenu('wex_ai')", icon: '🦁', label: 'Suporte Wex AI', badge: '24/7', group: 'Assistência & Ajustes' },
      { to: '#instalar-app', action: "window.worklyTriggerInstall()", icon: '📲', label: 'Instalar App (PWA)', badge: 'App', group: 'Assistência & Ajustes' },
      { to: '#conta', action: "window.worklyShowAccountSwitcher()", icon: '⚙️', label: 'Trocar Conta / Login', group: 'Assistência & Ajustes' },
      { to: '/empresas', icon: '🏢', label: 'Para Empresas', group: 'Negócios' },
      { to: '/notificacoes', icon: '🔔', label: 'Notificações', group: 'Negócios' }
    ];

    let currentGroup = '';
    let navHtml = '';

    navItems.forEach(item => {
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        navHtml += `<div class="workly-nav-group-title">${currentGroup}</div>`;
      }
      const isActive = pathname === item.to || (item.to !== '/home' && !item.to.startsWith('#') && pathname.startsWith(item.to));
      const badgeHtml = item.badge ? `<span class="workly-nav-badge" style="background: ${item.badge === 'Urgente' ? 'rgba(239, 68, 68, 0.2); color: #f87171;' : item.badge === 'Ativo' ? 'rgba(16, 185, 129, 0.2); color: #34d399;' : 'rgba(15, 111, 255, 0.2); color: #60a5fa;'}">${item.badge}</span>` : '';

      const clickAttr = item.action ? `onclick="${item.action}; return false;"` : '';

      navHtml += `
        <a href="${item.to}" class="workly-nav-item ${isActive ? 'active' : ''}" ${clickAttr}>
          <span style="font-size: 16px;">${item.icon}</span>
          <span>${item.label}</span>
          ${badgeHtml}
        </a>
      `;
    });

    const sidebar = document.createElement('aside');
    sidebar.id = 'workly-desktop-sidebar';
    sidebar.innerHTML = `
      <div style="flex: 1;">
        ${navHtml}
      </div>

      <!-- FOOTER DA SIDEBAR COM PERFIL & SCORE -->
      <div class="workly-user-card" style="margin-top: 16px;">
        <div style="position: relative;">
          <img src="/__l5e/assets-v1/8ecfe286-e5fa-4906-99b5-be4b72dfe1e7/wex.png" alt="Avatar" style="width: 36px; height: 36px; object-fit: contain; border-radius: 50%; background: rgba(15,111,255,0.15); padding: 2px;">
          <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #10b981; border-radius: 50%; border: 2px solid #0b1530;"></span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 12px; font-weight: 700; color: #fff; truncate;">Lucas (Profissional)</div>
          <div style="font-size: 10px; color: #94a3b8;">Score: <strong style="color: #60a5fa;">885 pts</strong> · Nível Ouro</div>
        </div>
        <a href="/login" style="font-size: 14px; text-decoration: none; color: #94a3b8;" title="Sair / Trocar Conta">🚪</a>
      </div>
    `;

    document.body.prepend(sidebar);
  }

  function updateRouteState() {
    const isLogin = window.location.pathname.includes('/login') || window.location.pathname === '/';
    document.body.classList.toggle('route-login', isLogin);

    // Atualiza classes ativas na sidebar
    const links = document.querySelectorAll('.workly-nav-item');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        const isActive = window.location.pathname === href || (href !== '/home' && window.location.pathname.startsWith(href));
        a.classList.toggle('active', isActive);
      }
    });
  }

  // Inicialização global
  window.worklySetMode = function (mode) {
    setViewMode(mode);
  };

  function init() {
    renderTopbar();
    renderSidebar();
    setViewMode(currentMode);
    updateRouteState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Intercepta mudanças de histórico e cliques de navegação interna
  window.addEventListener('popstate', updateRouteState);
  window.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.getAttribute('href')?.startsWith('/')) {
      setTimeout(updateRouteState, 150);
    }

    // Intercepta botões nativos do template de oportunidade para acionar o Paywall/Contato Real
    const btn = e.target.closest('button, a');
    if (btn && !btn.closest('.workly-sub-modal') && !btn.closest('#workly-desktop-sidebar') && !btn.closest('#workly-desktop-topbar')) {
      const text = (btn.innerText || btn.textContent || '').trim().toLowerCase();
      if (text.includes('candidatar') || text.includes('entrar em contato') || text.includes('falar com') || text.includes('quero essa vaga') || text.includes('proposta')) {
        if (!btn.getAttribute('data-workly-handled')) {
          e.preventDefault();
          e.stopPropagation();
          const card = btn.closest('[data-job-id]') || btn.closest('.card, article, div');
          const jobId = card?.getAttribute('data-job-id') || 'job-001';
          if (typeof window.worklyContactJob === 'function') {
            window.worklyContactJob(jobId);
          }
        }
      }
    }
  }, true);
})();
