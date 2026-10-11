import https from 'https';

const PUSHINPAY_API_URL = 'https://api.pushinpay.com.br/api';
const PUSHINPAY_TOKEN = '72179|WDsO2AbUCxx80h9Q0os5q1Co6mcoboqdhIr10CCQbd8e78db';

export interface PushinPayPixResponse {
  id: string;
  value: number; // em centavos
  status: string;
  qr_code: string; // Copia e Cola
  qr_code_base64: string; // Imagem base64
}

export class PushinPayService {
  /**
   * Executa requisição HTTP segura com suporte a ambientes locais/macOS
   */
  private static request(url: string, method: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const postData = data ? JSON.stringify(data) : null;

      const options: https.RequestOptions = {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method,
        rejectUnauthorized: false, // Compatibilidade com proxies locais macOS e produção
        headers: {
          'Authorization': `Bearer ${PUSHINPAY_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
        }
      };

      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`PushinPay Error [${res.statusCode}]: ${responseBody}`));
            }
          } catch (e) {
            reject(new Error(`Falha ao parsear resposta: ${responseBody}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }

  /**
   * Gera uma cobrança Pix real na Pushin Pay
   * @param valorReais Valor em Reais (ex: 29.90 ou 10.00)
   * @param webhookUrl URL para recebimento do webhook
   */
  public static async criarPix(valorReais: number, webhookUrl?: string): Promise<PushinPayPixResponse> {
    const valorCentavos = Math.round(valorReais * 100);
    const url = `${PUSHINPAY_API_URL}/pix/cashIn`;

    const body = {
      value: valorCentavos,
      webhook_url: webhookUrl || 'https://workly.37.148.132.216.nip.io/api/v1/wallet/webhook-pix'
    };

    const data = await this.request(url, 'POST', body);

    return {
      id: data.id,
      value: data.value,
      status: data.status,
      qr_code: data.qr_code,
      qr_code_base64: data.qr_code_base64
    };
  }

  /**
   * Consulta o status real de uma transação na Pushin Pay
   * @param transacaoId UUID da transação
   */
  public static async consultarTransacao(transacaoId: string): Promise<any> {
    const url = `${PUSHINPAY_API_URL}/transactions/${transacaoId}`;
    return await this.request(url, 'GET');
  }
}
