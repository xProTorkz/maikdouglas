import { Request, Response } from 'express';
import { PixService } from '../services/pixService';
import { EscrowService } from '../services/escrowService';

export const mockWallets: Record<string, { saldoDisponivel: number; saldoCustodia: number; chavePix: string }> = {
  'user-001-prof': {
    saldoDisponivel: 1240.50,
    saldoCustodia: 350.00,
    chavePix: 'rafael@workly.com.br'
  }
};

export class WalletController {
  public static async getWallet(req: Request, res: Response) {
    const userId = req.user?.id || 'user-001-prof';
    const wallet = mockWallets[userId] || { saldoDisponivel: 0, saldoCustodia: 0, chavePix: '' };
    return res.json({ wallet });
  }

  public static async gerarDepositoPix(req: Request, res: Response) {
    const { valor } = req.body;
    if (!valor || Number(valor) <= 0) {
      return res.status(400).json({ error: 'Valor de recarga inválido.' });
    }

    const cobranca = PixService.gerarCobrancaPix(Number(valor), 'Recarga Carteira Workly Pay');
    return res.status(201).json({ cobranca });
  }

  public static async contratarComCustodia(req: Request, res: Response) {
    const { jobId, prestadorId, valor } = req.body;
    const contratanteId = req.user?.id || 'anon-contratante';

    if (!jobId || !prestadorId || !valor) {
      return res.status(400).json({ error: 'jobId, prestadorId e valor são obrigatórios.' });
    }

    // Cria o contrato de custódia com código de segurança
    const contrato = EscrowService.criarContratoCustodia(
      jobId,
      contratanteId,
      prestadorId,
      Number(valor),
      'diamante',
      true
    );

    // Retém em custódia (Escrow)
    EscrowService.reterEmCustodia(contrato);

    return res.status(201).json({
      message: 'Pagamento retido com segurança pelo Workly Garantia. O valor só será liberado após sua aprovação.',
      contrato
    });
  }

  public static async liberarPagamento(req: Request, res: Response) {
    const { contrato, codigoSeguranca } = req.body;
    try {
      const resultado = EscrowService.liberarPagamentoPrestador(contrato, codigoSeguranca);
      return res.json({
        message: 'Pagamento liberado com sucesso para a carteira do prestador!',
        resultado
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
