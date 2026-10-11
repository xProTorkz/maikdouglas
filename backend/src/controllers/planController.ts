import { Request, Response } from 'express';
import { PushinPayService } from '../services/pushinPayService';

export interface UserPlan {
  userId: string;
  planName: 'pro' | 'verified' | 'avulso';
  status: 'ativo' | 'pendente' | 'inativo';
  transacaoId?: string;
  pixQrCode?: string;
  pixCopiaECola?: string;
  valor: number;
  expiraEm: string;
}

// Armazenamento em memória das assinaturas
export const activePlans: Record<string, UserPlan> = {
  // Lucas já tem plano ativo como prestador verificado
  'user-001-prof': {
    userId: 'user-001-prof',
    planName: 'pro',
    status: 'ativo',
    valor: 29.90,
    expiraEm: '2026-12-31T23:59:59.000Z'
  }
};

export class PlanController {
  // Gera uma cobrança Pix real na Pushin Pay para assinar o plano ou desbloquear contato
  public static async subscribe(req: Request, res: Response) {
    try {
      const { userId = 'user-001-prof', planType = 'pro', valor = 29.90 } = req.body;

      // Chama a Pushin Pay oficial
      const pix = await PushinPayService.criarPix(Number(valor));

      activePlans[userId] = {
        userId,
        planName: planType,
        status: 'pendente',
        transacaoId: pix.id,
        pixQrCode: pix.qr_code_base64,
        pixCopiaECola: pix.qr_code,
        valor: Number(valor),
        expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      return res.json({
        success: true,
        transacaoId: pix.id,
        valor: Number(valor),
        qrCodeBase64: pix.qr_code_base64,
        copiaECola: pix.qr_code,
        status: pix.status
      });
    } catch (error: any) {
      console.error('Erro ao gerar Pix na Pushin Pay:', error?.response?.data || error?.message);
      return res.status(500).json({
        error: 'Erro ao conectar à gateway Pushin Pay',
        details: error?.response?.data || error?.message
      });
    }
  }

  // Consulta se o pagamento foi confirmado na Pushin Pay
  public static async checkPayment(req: Request, res: Response) {
    try {
      const { transacaoId } = req.params;
      const { userId } = req.query;

      const data = await PushinPayService.consultarTransacao(transacaoId);

      const isPaid = data.status === 'paid' || data.status === 'completed';

      if (isPaid && userId) {
        if (!activePlans[String(userId)]) {
          activePlans[String(userId)] = {
            userId: String(userId),
            planName: 'pro',
            status: 'ativo',
            transacaoId,
            valor: Number(data.value) / 100,
            expiraEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        } else {
          activePlans[String(userId)].status = 'ativo';
        }
      }

      return res.json({
        transacaoId,
        status: data.status,
        isPaid,
        data
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao consultar transação', details: error?.message });
    }
  }

  // Verifica status do plano do usuário
  public static getPlanStatus(req: Request, res: Response) {
    const userId = req.params.userId || req.user?.id || 'user-001-prof';
    const plan = activePlans[userId];

    const hasActivePlan = plan && plan.status === 'ativo';

    return res.json({
      userId,
      hasActivePlan: !!hasActivePlan,
      plan: plan || null
    });
  }

  // Ativação direta para demonstração
  public static activateManual(req: Request, res: Response) {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

    activePlans[userId] = {
      userId,
      planName: 'pro',
      status: 'ativo',
      valor: 29.90,
      expiraEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return res.json({ success: true, message: 'Plano ativado com sucesso!', plan: activePlans[userId] });
  }
}
