import { v4 as uuidv4 } from 'uuid';

export interface PixCharge {
  txid: string;
  valor: number;
  qrCodeUrl: string;
  pixCopiaECola: string;
  expiraEm: Date;
  status: 'PENDENTE' | 'PAGO' | 'EXPIRADO';
}

export class PixService {
  /**
   * Gera uma cobrança Pix dinâmica para custódia ou recarga de saldo
   */
  public static gerarCobrancaPix(valor: number, descricao: string): PixCharge {
    const txid = uuidv4().replace(/-/g, '').substring(0, 25);
    const expiraEm = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Formato padrão BRCode simulado para ambiente local / produção
    const pixCopiaECola = `00020126580014br.gov.bcb.pix0136workly-financeiro@workly.com.br520400005303986540${valor.toFixed(2)}5802BR5918WORKLY BRASIL LTDA6009SAO PAULO62070503***6304ABCD`;
    
    // Gerador de QR Code URL (via API pública de renderização rápida de SVG/PNG)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopiaECola)}`;

    return {
      txid,
      valor,
      qrCodeUrl,
      pixCopiaECola,
      expiraEm,
      status: 'PENDENTE'
    };
  }

  /**
   * Processa webhook de confirmação de pagamento emitido pelo banco/gateway
   */
  public static processarWebhookPix(cobranca: PixCharge, statusRecebido: string): PixCharge {
    if (statusRecebido === 'CONCLUIDA' || statusRecebido === 'PAGO') {
      cobranca.status = 'PAGO';
    }
    return cobranca;
  }
}
