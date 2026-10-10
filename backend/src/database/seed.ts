/**
 * SEED OFICIAL DA PRAÇA PILOTO (GOIATUBA, RIO VERDE & GOIÂNIA / GO)
 * Popula categorias, profissionais selecionados, demandas ativas e histórico financeiro
 */

export const seedCategories = [
  { id: 'cat-01', nome: 'Elétrica & Padrão de Energia', slug: 'eletrica', icone: '⚡', descricao: 'Instalações, chuveiros, disjuntores e quadros trifásicos' },
  { id: 'cat-02', nome: 'Hidráulica & Desentupimento', slug: 'hidraulica', icone: '💧', descricao: 'Vazamentos, torneiras, caixas d água e desentupimento emergencial' },
  { id: 'cat-03', nome: 'Gastronomia & Eventos', slug: 'eventos', icone: '🍽️', descricao: 'Garçons, churrasqueiros, bartenders e ajudantes de cozinha' },
  { id: 'cat-04', nome: 'Diaristas & Limpeza Pós-Obra', slug: 'limpeza', icone: '🧹', descricao: 'Higienização residencial, comercial e pós-reforma' },
  { id: 'cat-05', nome: 'Climatização & Ar-Condicionado', slug: 'ar-condicionado', icone: '❄️', descricao: 'Instalação, carga de gás e manutenção preventiva de splits' },
  { id: 'cat-06', nome: 'Chaveiro & Travas 24 Horas', slug: 'chaveiro', icone: '🔑', descricao: 'Abertura residencial, veicular e cópias de chaves codificadas' },
  { id: 'cat-07', nome: 'Montagem de Móveis & Reparos', slug: 'marcenaria', icone: '🔨', descricao: 'Montagem de guarda-roupas, estantes e pequenos reparos' },
  { id: 'cat-08', nome: 'Tecnologia & Suporte Cloud', slug: 'tecnologia', icone: '💻', descricao: 'Desenvolvimento de software, redes e suporte técnico' }
];

export const seedProviders = [
  {
    id: 'user-001-prof',
    nome: 'Lucas Vinícius',
    email: 'lucas@workly.com',
    telefone: '(64) 99234-5678',
    cidade: 'Goiatuba',
    estado: 'GO',
    profissao: 'Especialista em Elétrica & Full-Stack',
    worklyScore: 885,
    scoreTier: 'ouro',
    verificado: true,
    eliteMember: true,
    totalServicos: 42,
    avaliacaoMedia: 4.95,
    chavePix: 'lucas@workly.com'
  },
  {
    id: 'user-002-marcos',
    nome: 'Marcos Eletricista',
    email: 'marcos.eletro@gmail.com',
    telefone: '(64) 98112-3344',
    cidade: 'Goiatuba',
    estado: 'GO',
    profissao: 'Eletricista Residencial e Industrial',
    worklyScore: 920,
    scoreTier: 'diamante',
    verificado: true,
    eliteMember: true,
    totalServicos: 68,
    avaliacaoMedia: 5.0,
    chavePix: '012.345.678-99'
  },
  {
    id: 'user-003-ana',
    nome: 'Ana Paula Gastronomia',
    email: 'anapaula.eventos@outlook.com',
    telefone: '(64) 99988-7711',
    cidade: 'Rio Verde',
    estado: 'GO',
    profissao: 'Chefe de Salão e Garçonete de Eventos',
    worklyScore: 780,
    scoreTier: 'ouro',
    verificado: true,
    eliteMember: false,
    totalServicos: 27,
    avaliacaoMedia: 4.88,
    chavePix: 'ana.eventos@pix.com.br'
  },
  {
    id: 'user-004-roberto',
    nome: 'Roberto Encanador Express',
    email: 'roberto.hidro@gmail.com',
    telefone: '(62) 99345-6789',
    cidade: 'Goiânia',
    estado: 'GO',
    profissao: 'Encanador e Caça-Vazamentos',
    worklyScore: 940,
    scoreTier: 'diamante',
    verificado: true,
    eliteMember: true,
    totalServicos: 112,
    avaliacaoMedia: 4.98,
    chavePix: 'roberto@caçavazamentos.com'
  }
];

export const seedJobs = [
  {
    id: 'job-101',
    titulo: 'Revisão e Instalação de Quadro Elétrico Trifásico',
    categoriaSlug: 'eletrica',
    cidade: 'Goiatuba',
    estado: 'GO',
    orcamento: 350.00,
    modalidade: 'express',
    urgencia: 'imediata',
    status: 'aberto',
    descricao: 'Disjuntor geral desarmando após chuva. Necessário troca de disjuntor bipolar e balanceamento de carga.'
  },
  {
    id: 'job-102',
    titulo: 'Desenvolvedor Full-Stack Sênior (Node.js/React)',
    categoriaSlug: 'tecnologia',
    cidade: 'Remoto / São Paulo',
    estado: 'SP',
    orcamento: 4500.00,
    modalidade: 'padrao',
    urgencia: 'alta',
    status: 'em_andamento',
    descricao: 'Estruturação de arquitetura backend com autenticação JWT, integração com Pix e WebSockets.'
  },
  {
    id: 'job-103',
    titulo: 'Equipe de 3 Garçons para Casamento no Sábado',
    categoriaSlug: 'eventos',
    cidade: 'Rio Verde',
    estado: 'GO',
    orcamento: 750.00,
    modalidade: 'padrao',
    urgencia: 'media',
    status: 'aberto',
    descricao: 'Evento para 120 convidados das 18h às 00h. Traje social preto completo. Pagamento com garantia Workly Escrow.'
  },
  {
    id: 'job-104',
    titulo: 'Desentupimento Urgente de Ralo e Caixa de Gordura',
    categoriaSlug: 'hidraulica',
    cidade: 'Goiatuba',
    estado: 'GO',
    orcamento: 280.00,
    modalidade: 'express',
    urgencia: 'imediata',
    status: 'aberto',
    descricao: 'Ralo da área de serviço transbordando. Precisa de atendimento com maquinário rotativo em até 40 minutos.'
  }
];

export function runSeed(): void {
  console.log('🌱 Inicializando Seed da Praça Piloto do Workly...');
  console.log(`✅ ${seedCategories.length} Categorias prioritárias carregadas.`);
  console.log(`✅ ${seedProviders.length} Profissionais verificados semeados em Goiás.`);
  console.log(`✅ ${seedJobs.length} Demandas ativas com garantia de custódia.`);
  console.log('🚀 Base de dados pronta para testes de contratação e despacho!');
}

if (require.main === module) {
  runSeed();
}
