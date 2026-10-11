import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { activePlans } from './planController';

export const mockJobs: any[] = [
  {
    id: 'job-101',
    contratanteId: 'user-carlos-contratante',
    contratanteNome: 'Carlos Mendes',
    contratanteAvatar: '🏢',
    titulo: 'Eletricista Predial para Instalação de Painel',
    descricao: 'Manutenção urgente em condomínio comercial no Centro de São Paulo. Necessário NR10 e ferramentas próprias.',
    orcamento: 350.00,
    modalidade: 'express',
    urgencia: 'imediata',
    categoria: 'Eletricista',
    status: 'aberto',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '11977665544',
    email: 'carlos@gmail.com',
    createdAt: new Date()
  },
  {
    id: 'job-102',
    contratanteId: 'user-lara-nubank',
    contratanteNome: 'Lara — RH Nubank',
    contratanteAvatar: '💼',
    titulo: 'Designer de Produto UX/UI Sênior',
    descricao: 'Reformulação completa do funil de onboarding do aplicativo mobile. Contrato inicial de 3 meses.',
    orcamento: 4500.00,
    modalidade: 'padrao',
    urgencia: 'media',
    categoria: 'Design',
    status: 'aberto',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '11988776655',
    email: 'lara@nubank.com.br',
    createdAt: new Date()
  },
  {
    id: 'job-103',
    contratanteId: 'user-marina',
    contratanteNome: 'Marina Souza',
    contratanteAvatar: '✨',
    titulo: 'Desenvolvedor React & Node.js para MVP',
    descricao: 'Criação de dashboard em tempo real integrado a pagamentos Pix e WebSockets.',
    orcamento: 3200.00,
    modalidade: 'padrao',
    urgencia: 'alta',
    categoria: 'Tecnologia',
    status: 'aberto',
    cidade: 'Campinas',
    estado: 'SP',
    telefone: '19981234567',
    email: 'marina@agenciadigital.com',
    createdAt: new Date()
  },
  {
    id: 'job-104',
    contratanteId: 'user-roberto',
    contratanteNome: 'Roberto Silva',
    contratanteAvatar: '🏗️',
    titulo: 'Pedreiro de Acabamento Fino para Porcelanato',
    descricao: 'Assentamento de 85m² de piso porcelanato 120x60 em apartamento residencial.',
    orcamento: 1800.00,
    modalidade: 'padrao',
    urgencia: 'media',
    categoria: 'Construção',
    status: 'aberto',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '11991223344',
    email: 'roberto.silva@gmail.com',
    createdAt: new Date()
  }
];

export class JobController {
  public static async listJobs(req: Request, res: Response) {
    const { modalidade, categoria, cidade } = req.query;
    let filtered = [...mockJobs];

    if (modalidade) {
      filtered = filtered.filter(j => j.modalidade === modalidade);
    }
    if (categoria) {
      filtered = filtered.filter(j => j.categoria?.toLowerCase() === (categoria as string).toLowerCase());
    }
    if (cidade) {
      filtered = filtered.filter(j => j.cidade.toLowerCase() === (cidade as string).toLowerCase());
    }

    return res.json({ total: filtered.length, jobs: filtered });
  }

  public static async createJob(req: Request, res: Response) {
    const { titulo, descricao, orcamento, modalidade, urgencia, cidade, estado, categoria, telefone, email, contratanteNome } = req.body;
    const contratanteId = req.user?.id || req.body.contratanteId || 'user-001-prof';

    if (!titulo || !orcamento) {
      return res.status(400).json({ error: 'Título e orçamento são obrigatórios.' });
    }

    const newJob = {
      id: 'job-' + uuidv4().slice(0, 8),
      contratanteId,
      contratanteNome: contratanteNome || 'Anunciante Workly',
      contratanteAvatar: '💼',
      titulo,
      descricao: descricao || '',
      orcamento: Number(orcamento),
      modalidade: modalidade || 'padrao',
      urgencia: urgencia || 'media',
      categoria: categoria || 'Geral',
      status: 'aberto',
      cidade: cidade || 'São Paulo',
      estado: estado || 'SP',
      telefone: telefone || '11999887766',
      email: email || 'contato@workly.com',
      createdAt: new Date()
    };

    mockJobs.unshift(newJob);
    return res.status(201).json({ job: newJob });
  }

  public static async createExpressJob(req: Request, res: Response) {
    const { titulo, descricao, orcamento, pacoteExpress, cidade, estado, categoria, telefone } = req.body;
    const contratanteId = req.user?.id || req.body.contratanteId || 'user-001-prof';

    let taxaExpress = 49.00;
    if (pacoteExpress === 'pro') taxaExpress = 149.00;
    if (pacoteExpress === 'max') taxaExpress = 299.00;

    const newExpressJob = {
      id: 'job-exp-' + uuidv4().slice(0, 8),
      contratanteId,
      contratanteNome: req.body.contratanteNome || 'Chamado Express',
      contratanteAvatar: '⚡',
      titulo: `[EXPRESS] ${titulo}`,
      descricao: descricao || 'Atendimento emergencial sob demanda',
      orcamento: Number(orcamento),
      modalidade: 'express',
      urgencia: 'imediata',
      categoria: categoria || 'Serviços Rápidos',
      taxaExpressPaga: taxaExpress,
      status: 'aberto',
      cidade: cidade || 'São Paulo',
      estado: estado || 'SP',
      telefone: telefone || '11999887766',
      createdAt: new Date()
    };

    mockJobs.unshift(newExpressJob);
    return res.status(201).json({
      message: 'Demanda Express disparada com sucesso para profissionais online!',
      job: newExpressJob
    });
  }

  /**
   * REGRA CENTRAL: OBTENÇÃO DE CONTATO DA VAGA
   * Se o usuário tem plano ativo, entrega dados reais (Telefone, WhatsApp direto e Chat).
   * Se NÃO tem plano, entrega dados mascarados e requer assinatura via Pushin Pay!
   */
  public static async getContact(req: Request, res: Response) {
    const { id } = req.params;
    const { userId = 'user-001-prof' } = req.query;

    const job = mockJobs.find(j => j.id === id);
    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    const plan = activePlans[String(userId)];
    const hasActivePlan = plan && plan.status === 'ativo';

    if (hasActivePlan) {
      // Contato 100% liberado!
      const cleanPhone = (job.telefone || '11999887766').replace(/\D/g, '');
      const whatsText = encodeURIComponent(`Olá ${job.contratanteNome}, vi sua vaga "${job.titulo}" no Workly e tenho interesse!`);
      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${whatsText}`;

      return res.json({
        bloqueado: false,
        contratanteId: job.contratanteId,
        contratanteNome: job.contratanteNome,
        telefone: job.telefone || '(11) 99988-7766',
        whatsapp: cleanPhone,
        whatsappUrl,
        email: job.email || 'contato@workly.com',
        mensagem: 'Contato liberado! Você possui o Plano Workly Pro ativo.'
      });
    }

    // Contato BLOQUEADO (Paywall):
    return res.json({
      bloqueado: true,
      contratanteNome: job.contratanteNome,
      telefoneMascarado: '(11) 9****-**44',
      whatsappMascarado: '(11) 9****-**44',
      motivo: 'Contato protegido. Para falar diretamente com o contratante via WhatsApp, telefone ou chat, assine o Plano Workly Pro.',
      valorAssinatura: 29.90,
      valorDesbloqueioAvulso: 9.90
    });
  }
}
