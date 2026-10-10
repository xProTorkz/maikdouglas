"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixService = void 0;
const uuid_1 = require("uuid");
class PixService {
    /**
     * Gera uma cobrança Pix dinâmica para custódia ou recarga de saldo
     */
    static gerarCobrancaPix(valor, descricao) {
        const txid = (0, uuid_1.v4)().replace(/-/g, '').substring(0, 25);
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
    static processarWebhookPix(cobranca, statusRecebido) {
        if (statusRecebido === 'CONCLUIDA' || statusRecebido === 'PAGO') {
            cobranca.status = 'PAGO';
        }
        return cobranca;
    }
}
exports.PixService = PixService;
