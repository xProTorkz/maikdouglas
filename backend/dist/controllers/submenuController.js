"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmenuController = void 0;
class SubmenuController {
    // 1. Minhas Propostas & Contratos Ativos
    static listProposals(req, res) {
        const proposals = [
            {
                id: 'prop-001',
                jobId: 'job-102',
                jobTitle: 'Desenvolvedor Full-Stack Sênior',
                contratanteNome: 'Lara — RH Nubank',
                valor: 4500,
                status: 'em_andamento',
                dataInicio: '2026-10-08',
                previsaoEntrega: '2026-10-23',
                escrowGarantido: true,
                progressoPercentual: 65
            },
            {
                id: 'prop-002',
                jobId: 'job-101',
                jobTitle: 'Instalação de Painel Elétrico',
                contratanteNome: 'Carlos Mendes',
                valor: 350,
                status: 'aguardando_aprovacao',
                dataEnvio: '2026-10-09',
                escrowGarantido: true,
                progressoPercentual: 0
            },
            {
                id: 'prop-003',
                jobId: 'job-099',
                jobTitle: 'Configuração de Servidor Cloud',
                contratanteNome: 'Agência Digital Alpha',
                valor: 1200,
                status: 'concluido',
                dataConclusao: '2026-10-04',
                avaliacao: 5.0,
                comentario: 'Serviço entregue com perfeição e antes do prazo!',
                escrowGarantido: true,
                progressoPercentual: 100
            }
        ];
        return res.json({ total: proposals.length, proposals });
    }
    // 2. Extrato Detalhado da Carteira Workly Pay
    static getWalletStatement(req, res) {
        const transactions = [
            {
                id: 'tx-01',
                tipo: 'credito_servico',
                descricao: 'Serviço Concluído: Servidor Cloud (Agência Alpha)',
                valor: 1080.00, // R$ 1200 - 10% taxa score diamante
                taxaWorkly: 120.00,
                status: 'disponivel',
                data: '2026-10-04 18:30'
            },
            {
                id: 'tx-02',
                tipo: 'retencao_escrow',
                descricao: 'Garantia Retida: Desenvolvedor Full-Stack (Nubank)',
                valor: 4050.00, // R$ 4500 - 10%
                status: 'em_custodia',
                data: '2026-10-08 10:42'
            },
            {
                id: 'tx-03',
                tipo: 'saque_pix',
                descricao: 'Transferência Pix para Chave CPF: ***.456.789-**',
                valor: -500.00,
                status: 'concluido',
                data: '2026-10-05 09:15'
            }
        ];
        return res.json({
            saldoDisponivel: 1450.00,
            saldoEmCustodia: 4050.00,
            totalGanhosMes: 5530.00,
            chavePixCadastrada: 'lucas@workly.com (Aleatória)',
            transactions
        });
    }
    // Saque Pix
    static requestWithdraw(req, res) {
        const { valor, chavePix } = req.body;
        if (!valor || valor <= 0) {
            return res.status(400).json({ error: 'Informe um valor válido para saque.' });
        }
        return res.json({
            success: true,
            protocolo: 'PIX-SAQUE-' + Date.now().toString().slice(-6),
            valorSolicitado: valor,
            chavePix: chavePix || 'Cadastrada no Perfil',
            mensagem: `Saque de R$ ${Number(valor).toFixed(2)} processado com sucesso via Pix instantâneo!`,
            data: new Date().toISOString()
        });
    }
    // 3. Detalhamento Matemático do Workly Score
    static getScoreBreakdown(req, res) {
        return res.json({
            scoreAtual: 885,
            nivel: 'Ouro / Quase Diamante',
            posicaoRanking: 'Top 3% na categoria Tecnologia & Elétrica',
            vantagensAtivas: [
                'Taxa de intermediação reduzida para 10% (padrão é 15%)',
                'Selo de Confiança Verificada no Perfil',
                'Prioridade máxima no feed de Vagas Express'
            ],
            pilares: [
                { nome: 'Pontualidade nas Entregas', peso: '25%', pontuacao: 98, status: 'Excelente' },
                { nome: 'Avaliações de Clientes (Média 4.9)', peso: '30%', pontuacao: 96, status: 'Excelente' },
                { nome: 'Tempo Médio de Resposta (< 10 min)', peso: '15%', pontuacao: 90, status: 'Muito Bom' },
                { nome: 'Taxa de Conclusão sem Disputas', peso: '20%', pontuacao: 100, status: 'Perfeito' },
                { nome: 'Verificação de Documentos (CPF/CNPJ)', peso: '10%', pontuacao: 100, status: 'Concluído' }
            ],
            dicaDoWex: 'Conclua mais 1 serviço 5 estrelas nesta semana para alcançar 900+ pontos e atingir a faixa Diamante!'
        });
    }
    // 4. Suporte Inteligente com Wex AI (Mascote)
    static chatWithWex(req, res) {
        const { message } = req.body;
        const msgLower = (message || '').toLowerCase();
        let resposta = 'Olá! Eu sou o Wex, mascote inteligente do Workly! Como posso ajudar você hoje com seus trabalhos, contratações ou pagamentos?';
        if (msgLower.includes('pix') || msgLower.includes('pagamento') || msgLower.includes('saque')) {
            resposta = '💳 Sobre pagamentos: Com a garantia Workly Pay, os valores ficam seguros em custódia Pix e são liberados instantaneamente para sua conta assim que o serviço for concluído!';
        }
        else if (msgLower.includes('score') || msgLower.includes('pontos') || msgLower.includes('reputacao')) {
            resposta = '⭐ Seu Workly Score varia de 0 a 1000. Profissionais acima de 850 pontos têm taxa reduzida de 10% e recebem 3x mais notificações de vagas urgentes.';
        }
        else if (msgLower.includes('express') || msgLower.includes('urgente')) {
            resposta = '⚡ O Workly Express permite contratação imediata em 15 a 45 minutos com preço tabelado e profissional despachado na hora!';
        }
        else if (msgLower.includes('garantia') || msgLower.includes('calote') || msgLower.includes('seguranca')) {
            resposta = '🛡️ Nossa proteção contra calote funciona via Escrow: o contratante antecipa o valor que fica blindado pelo Workly. Só é liberado com validação por QR Code presencial.';
        }
        return res.json({
            sender: 'Wex AI (Suporte Oficial)',
            avatar: '🦁',
            reply: resposta,
            timestamp: new Date().toISOString()
        });
    }
}
exports.SubmenuController = SubmenuController;
