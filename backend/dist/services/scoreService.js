"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreService = void 0;
class ScoreService {
    /**
     * Calcula a pontuação oficial do Workly Score (0 a 1000)
     * Fórmula: (Pontualidade * 35%) + (Qualidade * 35%) + (Volume * 20%) + (Academy * 10%)
     */
    static calcularScore(factors) {
        const pesoPontualidade = 0.35;
        const pesoQualidade = 0.35;
        const pesoVolume = 0.20;
        const pesoAcademy = 0.10;
        // Normaliza volume de serviços (máximo 100 serviços = 1000 pts)
        const pontuacaoVolume = Math.min(1000, factors.volumeConcluidos * 10);
        // Normaliza cursos da Academy (máximo 5 cursos = 1000 pts)
        const pontuacaoAcademy = Math.min(1000, factors.cursosAcademyConcluidos * 200);
        const scoreTotal = Math.round(factors.pontualidadeMedia * pesoPontualidade +
            factors.qualidadeAvaliacaoMedia * pesoQualidade +
            pontuacaoVolume * pesoVolume +
            pontuacaoAcademy * pesoAcademy);
        const scoreClamped = Math.max(0, Math.min(1000, scoreTotal));
        const tier = this.definirTier(scoreClamped);
        return {
            score: scoreClamped,
            tier
        };
    }
    static definirTier(score) {
        if (score >= 900)
            return 'diamante';
        if (score >= 700)
            return 'ouro';
        if (score >= 400)
            return 'prata';
        return 'bronze';
    }
    /**
     * Retorna os benefícios de comissão com base no Score
     */
    static obterTaxaComissao(tier, isElite) {
        if (isElite)
            return 6.0; // 6% para membros Elite verificados
        switch (tier) {
            case 'diamante': return 8.0; // 8%
            case 'ouro': return 10.0; // 10%
            case 'prata': return 12.0; // 12%
            case 'bronze':
            default: return 15.0; // 15%
        }
    }
}
exports.ScoreService = ScoreService;
