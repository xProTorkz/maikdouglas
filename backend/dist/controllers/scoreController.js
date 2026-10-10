"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreController = void 0;
const scoreService_1 = require("../services/scoreService");
class ScoreController {
    static async getScore(req, res) {
        // Fatores de pontuação do usuário logado
        const factors = {
            pontualidadeMedia: 950,
            qualidadeAvaliacaoMedia: 980,
            volumeConcluidos: 42,
            cursosAcademyConcluidos: 3
        };
        const resultado = scoreService_1.ScoreService.calcularScore(factors);
        const taxaComissao = scoreService_1.ScoreService.obterTaxaComissao(resultado.tier, true);
        return res.json({
            score: resultado.score,
            tier: resultado.tier,
            taxaComissao: `${taxaComissao}%`,
            fatores: factors,
            beneficios: [
                'Prioridade máxima no algoritmo do Workly Express',
                'Taxa de intermediação reduzida para apenas 6%',
                'Selo Diamante verificado em destaque no perfil',
                'Suporte VIP via WhatsApp 24/7'
            ]
        });
    }
}
exports.ScoreController = ScoreController;
