"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = exports.mockJobs = void 0;
const uuid_1 = require("uuid");
exports.mockJobs = [
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
class JobController {
    static async listJobs(req, res) {
        const { modalidade, cidade } = req.query;
        let filtered = [...exports.mockJobs];
        if (modalidade) {
            filtered = filtered.filter(j => j.modalidade === modalidade);
        }
        if (cidade) {
            filtered = filtered.filter(j => j.cidade.toLowerCase() === cidade.toLowerCase());
        }
        return res.json({ total: filtered.length, jobs: filtered });
    }
    static async createJob(req, res) {
        const { titulo, descricao, orcamento, modalidade, urgencia, cidade, estado } = req.body;
        const contratanteId = req.user?.id || 'anon-user';
        if (!titulo || !orcamento) {
            return res.status(400).json({ error: 'Título e orçamento são obrigatórios.' });
        }
        const newJob = {
            id: (0, uuid_1.v4)(),
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
        exports.mockJobs.unshift(newJob);
        return res.status(201).json({ job: newJob });
    }
    static async createExpressJob(req, res) {
        const { titulo, descricao, orcamento, pacoteExpress } = req.body;
        const contratanteId = req.user?.id || 'anon-user';
        // Pacotes express: Start (R$ 49), Pro (R$ 149), Max (R$ 299)
        let taxaExpress = 49.00;
        if (pacoteExpress === 'pro')
            taxaExpress = 149.00;
        if (pacoteExpress === 'max')
            taxaExpress = 299.00;
        const newExpressJob = {
            id: (0, uuid_1.v4)(),
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
        exports.mockJobs.unshift(newExpressJob);
        return res.status(201).json({
            message: 'Demanda Express disparada com sucesso para os melhores profissionais próximos!',
            job: newExpressJob
        });
    }
}
exports.JobController = JobController;
