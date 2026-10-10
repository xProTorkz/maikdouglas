import { Request, Response } from 'express';
import { ScoreService } from '../services/scoreService';

export class ScoreController {
  public static async getScore(req: Request, res: Response) {
    // Fatores de pontuação do usuário logado
    const factors = {
      pontualidadeMedia: 950,
      qualidadeAvaliacaoMedia: 980,
      volumeConcluidos: 42,
      cursosAcademyConcluidos: 3
    };

    const resultado = ScoreService.calcularScore(factors);
    const taxaComissao = ScoreService.obterTaxaComissao(resultado.tier, true);

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
