"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = exports.mockWallets = void 0;
const pixService_1 = require("../services/pixService");
const escrowService_1 = require("../services/escrowService");
exports.mockWallets = {
    'user-001-prof': {
        saldoDisponivel: 1240.50,
        saldoCustodia: 350.00,
        chavePix: 'rafael@workly.com.br'
    }
};
class WalletController {
    static async getWallet(req, res) {
        const userId = req.user?.id || 'user-001-prof';
        const wallet = exports.mockWallets[userId] || { saldoDisponivel: 0, saldoCustodia: 0, chavePix: '' };
        return res.json({ wallet });
    }
    static async gerarDepositoPix(req, res) {
        const { valor } = req.body;
        if (!valor || Number(valor) <= 0) {
            return res.status(400).json({ error: 'Valor de recarga inválido.' });
        }
        const cobranca = pixService_1.PixService.gerarCobrancaPix(Number(valor), 'Recarga Carteira Workly Pay');
        return res.status(201).json({ cobranca });
    }
    static async contratarComCustodia(req, res) {
        const { jobId, prestadorId, valor } = req.body;
        const contratanteId = req.user?.id || 'anon-contratante';
        if (!jobId || !prestadorId || !valor) {
            return res.status(400).json({ error: 'jobId, prestadorId e valor são obrigatórios.' });
        }
        // Cria o contrato de custódia com código de segurança
        const contrato = escrowService_1.EscrowService.criarContratoCustodia(jobId, contratanteId, prestadorId, Number(valor), 'diamante', true);
        // Retém em custódia (Escrow)
        escrowService_1.EscrowService.reterEmCustodia(contrato);
        return res.status(201).json({
            message: 'Pagamento retido com segurança pelo Workly Garantia. O valor só será liberado após sua aprovação.',
            contrato
        });
    }
    static async liberarPagamento(req, res) {
        const { contrato, codigoSeguranca } = req.body;
        try {
            const resultado = escrowService_1.EscrowService.liberarPagamentoPrestador(contrato, codigoSeguranca);
            return res.json({
                message: 'Pagamento liberado com sucesso para a carteira do prestador!',
                resultado
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}
exports.WalletController = WalletController;
