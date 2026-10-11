"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushinPayService = void 0;
const https_1 = __importDefault(require("https"));
const PUSHINPAY_API_URL = 'https://api.pushinpay.com.br/api';
const PUSHINPAY_TOKEN = '72179|WDsO2AbUCxx80h9Q0os5q1Co6mcoboqdhIr10CCQbd8e78db';
class PushinPayService {
    /**
     * Executa requisição HTTP segura com suporte a ambientes locais/macOS
     */
    static request(url, method, data) {
        return new Promise((resolve, reject) => {
            const u = new URL(url);
            const postData = data ? JSON.stringify(data) : null;
            const options = {
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
            const req = https_1.default.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseBody);
                        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsed);
                        }
                        else {
                            reject(new Error(`PushinPay Error [${res.statusCode}]: ${responseBody}`));
                        }
                    }
                    catch (e) {
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
    static async criarPix(valorReais, webhookUrl) {
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
    static async consultarTransacao(transacaoId) {
        const url = `${PUSHINPAY_API_URL}/transactions/${transacaoId}`;
        return await this.request(url, 'GET');
    }
}
exports.PushinPayService = PushinPayService;
