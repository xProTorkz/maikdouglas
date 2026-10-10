# RELATÓRIO DE AUDITORIA FORENSE & TÉCNICA
## Projeto: Workly — Trabalho que Conecta
**Data:** 10 de Outubro de 2026  
**Identificador Original:** `f39b6425-3b2d-43d8-94f3-e998c479c235` (ID Lovable: `lovp_5g7deccfz88stvb6d3m6tseypt`)  
**Commit/Artifact SHA:** `430bcd43505be7f38537984d626745423b2457ab`  
**Diretório Canônico Local:** `/Users/lucasvinicius/projetos/APLICAÇÕES/maikdouglas`  
**Auditor Responsável:** Sentinela Guardião de Projetos / Antigravity  

---

## 1. RESUMO EXECUTIVO & INTUITO DO APLICATIVO

### Qual é o intuito deste aplicativo?
O **Workly** é uma **plataforma digital de intermediação de mão de obra e serviços (SuperApp / Two-Sided Marketplace)** no modelo *Gig Economy* e recrutamento B2B/B2C, desenhado com foco no mercado brasileiro ("*Trabalho que Conecta*").

O aplicativo foi projetado para operar como um ecossistema completo conectando dois públicos principais:
1. **Trabalhadores e Prestadores de Serviços:**
   - Profissionais operacionais autônomos (eletricistas, garçons, motoristas, pedreiros).
   - Profissionais corporativos/digitais (designers UX/UI, desenvolvedores, social media, marketing digital).
2. **Contratantes e Empresas:**
   - Pessoas físicas contratando reparos ou eventos.
   - Empresas e startups buscando contratações rápidas, urgentes ou recrutamento em massa.

### Pilares de Negócio e Monetização Mapeados:
* **Workly Express (`/express` e `/express-empresas`):** Módulo de contratação ultrarrápida com precificação dinâmica por urgência (planos de R$ 49 a R$ 499: *Express Start*, *Express Pro*, *Express Max*).
* **Workly Score (`/score`):** Algoritmo de reputação gamificado que analisa pontualidade, avaliações de clientes e serviços concluídos, ranqueando os melhores prestadores até o nível *Diamante*.
* **Workly Verified & Elite (`/verified`):** Modelo de assinatura mensal para profissionais que compram selo dourado de verificação, suporte prioritário, menor taxa de comissão e posicionamento no topo das buscas.
* **Workly Academy (`/academy`):** Hub de cursos e capacitação profissional (UX Design, Atendimento, Vendas, Marketing 360) para qualificar a base de trabalhadores.
* **Workly Pay (`/pay`):** Carteira digital embutida para recebimento de serviços, pagamentos instantâneos via **PIX**, extrato financeiro e retenção de saldo na plataforma.
* **Painel Admin (`/admin`):** Dashboard gerencial com acompanhamento de MRR (Receita Mensal), volume de usuários ativos, conversão de empresas e churn.

---

## 2. ARQUITETURA DE SOFTWARE & STACK TECNOLÓGICA

| Camada | Tecnologia Identificada | Detalhes |
| :--- | :--- | :--- |
| **Framework Base** | **React 18+** | SPA (Single Page Application) em JavaScript moderno ES2022 |
| **Bundler / Build** | **Vite** | Compilação modular em 49 chunks com carregamento sob demanda |
| **Roteamento** | **@tanstack/react-router** | Roteador declarativo de alta performance com 17 rotas mapeadas |
| **Design System** | **Tailwind CSS + Radix UI** | Interface responsiva inspirada em Mobile-First (MobileShell PWA) |
| **Tipografia** | **Sora + Manrope** | Fontes importadas do Google Fonts |
| **Ícones** | **Lucide React** | Conjunto completo de ícones SVG otimizados |
| **Persistência Atual**| **Client-Side Mock / LocalStorage** | Protótipo funcional de alta fidelidade sem backend SQL conectado |

---

## 3. MAPEAMENTO COMPLETO DE ROTAS E TELAS

O aplicativo possui 17 rotas ativas totalmente estruturadas:

1. **`/` e `/home` (`home-CZo4fhKu.js`):**  
   Feed principal com busca de vagas, profissionais em destaque, categorias em alta e atalhos rápidos.
2. **`/oportunidades` (`oportunidades-Cd4YyynX.js`):**  
   Painel de vagas abertas com filtros de remuneração, localização e tipo de vaga (ex.: *Dev React Sênior R$ 18k-24k*, *Eletricista Predial*).
3. **`/publicar-servico` (`publicar-servico-CvEeZwxA.js`):**  
   Formulário para prestadores anunciarem novas habilidades, preços e disponibilidade.
4. **`/express` (`express-ii5_FSXM.js`):**  
   Fluxo de contratação imediata com seleção de urgência, geolocalização e pacotes rápidos.
5. **`/express-empresas` (`express-empresas-CnZQsdUa.js`):**  
   Painel de recrutamento express para empresas impulsionarem vagas para centenas de candidatos próximos.
6. **`/empresas` (`empresas-MRbF2POu.js`):**  
   Vitrine de talentos com busca por filtros inteligentes e visualização de Workly Score.
7. **`/score` (`score-DKfA6qkU.js`):**  
   Métricas individuais de reputação do profissional e metas para progressão de nível.
8. **`/academy` (`academy-BnE5HFO0.js`):**  
   Plataforma de cursos rápidos voltados ao aprimoramento do profissional.
9. **`/verified` (`verified-BPlrQf0e.js`):**  
   Página de checkout de assinaturas e selos de validação de identidade profissional (*Workly Elite*).
10. **`/pay` (`pay-Cam2bXa9.js`):**  
    Interface de carteira digital, extrato de transações Pix, saldo disponível e histórico de payouts.
11. **`/anuncios` (`anuncios-dLjr7wsq.js`):**  
    Gerenciamento de anúncios criados pelo usuário com badges de destaque.
12. **`/chat` (`chat-cZBjwmqU.js`):**  
    Módulo de conversação direta entre contratante e trabalhador.
13. **`/notificacoes` (`notificacoes-CRK7xyfq.js`):**  
    Central de avisos de novas propostas, mensagens e pagamentos.
14. **`/perfil` (`perfil-D1DdNq8p.js`):**  
    Visualização pública e privada do perfil, bio, avaliações e portfólio.
15. **`/login` (`login-9hS3vxMb.js`):**  
    Onboarding inicial com segmentação dupla: *Buscando trabalho* vs *Contratando*, e *PF* vs *PJ*.
16. **`/admin` (`admin-DYKkBrLZ.js`):**  
    Painel de controle com gráficos de faturamento, novos cadastros e moderação.

---

## 4. AUDITORIA DE SEGURANÇA E VULNERABILIDADES (AppSec)

| Vetor de Segurança | Status | Análise Forense |
| :--- | :---: | :--- |
| **Vazamento de Chaves Privadas** | **SEGURO** | Nenhuma credencial sensível (AWS, Stripe Secret, Supabase Service Role) foi encontrada exposta nos bundles JS compilados. |
| **Validação de Inputs** | **MODERADO** | Os formulários atuais possuem validação básica de front-end. Ao plugar uma API real, será obrigatório adotar validação com Zod no back-end. |
| **Fluxo de Pagamento Pix** | **SIMULADO** | O módulo `/pay` atual opera com mock de dados (não realiza cobrança real em banco). Requer gateway de pagamento real (ex.: Asaas, Efí, Mercado Pago). |
| **Autenticação e Permissões** | **CLIENT-SIDE** | O controle de acesso atual é baseado no estado do front-end. O painel `/admin` precisa de proteção obrigatória por middleware com JWT e RBAC quando conectado ao banco de dados. |

---

## 5. INVENTÁRIO DE ARQUIVOS EXTRAÍDOS LOCALMENTE

Todos os arquivos da aplicação foram baixados diretamente para:
`/Users/lucasvinicius/projetos/APLICAÇÕES/maikdouglas/app/`

* `index.html`: Arquivo principal da aplicação com meta tags e injeção dos bundles.
* `assets/styles-Bhn7USoS.css` (95 KB): Folha de estilo completa com design system Tailwind.
* `assets/index-DVuQEhEY.js` (636 KB): Bundle principal da aplicação e núcleo de rotas.
* `assets/*.js` (49 arquivos): Módulos e páginas da aplicação (Home, Pay, Admin, Login, Chat, etc.).
* `__l5e/assets-v1/.../wex.png` (571 KB): Identidade visual oficial e logotipo do Workly.

---

## 6. COMO EXECUTAR O APLICATIVO LOCALMENTE

Para abrir e navegar por todas as telas do Workly no seu computador localmente:

Execute no terminal:
```bash
cd "/Users/lucasvinicius/projetos/APLICAÇÕES/maikdouglas/app"
python3 -m http.server 4000
```
Em seguida, acesse no navegador: `http://localhost:4000`

---
*Relatório emitido e registrado pelo Sentinela Guardião de Projetos.*
