import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { EscrowService } from '../services/escrowService';

export const mockJobs: any[] = [
  {
    id: 'job-101',
    contratanteId: 'user-002-empresa',
    titulo: 'Eletricista Predial para Instalação de Painel',
    descricao: 'Manutenção urgente em condomínio comercial no Centro.',
    orcamento: 350.00,
    modalidade: 'express',
    urgencia: 'imediata',
    status: 'aberto',
    cidade: 'Goiânia',
    estado: 'GO',
    createdAt: new Date()
  },
  {
    id: 'job-102',
    contratanteId: 'user-002-empresa',
    titulo: 'Designer de Produto UX/UI Sênior',
    descricao: 'Reformulação completa do funil de onboarding do aplicativo mobile.',
    orcamento: 4500.00,
    modalidade: 'padrao',
    urgencia: 'media',
    status: 'aberto',
    cidade: 'Remoto',
    estado: 'BR',
    createdAt: new Date()
  }
];

export class JobController {
  public static async listJobs(req: Request, res: Response) {
    const { modalidade, cidade } = req.query;
    let filtered = [...mockJobs];

    if (modalidade) {
      filtered = filtered.filter(j => j.modalidade === modalidade);
    }
    if (cidade) {
      filtered = filtered.filter(j => j.cidade.toLowerCase() === (cidade as string).toLowerCase());
    }

    return res.json({ total: filtered.length, jobs: filtered });
  }

  public static async createJob(req: Request, res: Response) {
    const { titulo, descricao, orcamento, modalidade, urgencia, cidade, estado } = req.body;
    const contratanteId = req.user?.id || 'anon-user';

    if (!titulo || !orcamento) {
      return res.status(400).json({ error: 'Título e orçamento são obrigatórios.' });
    }

    const newJob = {
      id: uuidv4(),
      contratanteId,
      titulo,
      descricao: descricao || '',
      orcamento: Number(orcamento),
      modalidade: modalidade || 'padrao',
      urgencia: urgencia || 'media',
      status: 'aberto',
      cidade: cidade || 'Goiânia',
      estado: estado || 'GO',
      createdAt: new Date()
    };

    mockJobs.unshift(newJob);
    return res.status(201).json({ job: newJob });
  }

  public static async createExpressJob(req: Request, res: Response) {
    const { titulo, descricao, orcamento, pacoteExpress } = req.body;
    const contratanteId = req.user?.id || 'anon-user';

    // Pacotes express: Start (R$ 49), Pro (R$ 149), Max (R$ 299)
    let taxaExpress = 49.00;
    if (pacoteExpress === 'pro') taxaExpress = 149.00;
    if (pacoteExpress === 'max') taxaExpress = 299.00;

    const newExpressJob = {
      id: uuidv4(),
      contratanteId,
      titulo: `[EXPRESS] ${titulo}`,
      descricao,
      orcamento: Number(orcamento),
      modalidade: 'express',
      urgencia: 'imediata',
      taxaExpressPaga: taxaExpress,
      status: 'aberto',
      cidade: req.body.cidade || 'Goiânia',
      estado: req.body.estado || 'GO',
      createdAt: new Date()
    };

    mockJobs.unshift(newExpressJob);
    return res.status(201).json({
      message: 'Demanda Express disparada com sucesso para os melhores profissionais próximos!',
      job: newExpressJob
    });
  }
}
