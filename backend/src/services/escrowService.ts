import { v4 as uuidv4 } from 'uuid';
import { ScoreService, ScoreTier } from './scoreService';

export interface ContractData {
  id: string;
  jobId: string;
  contratanteId: string;
  prestadorId: string;
  valorBruto: number;
  taxaPercentual: number;
  valorTaxaPlataforma: number;
  fundoGarantiaTaxa: number;
  valorLiquidoPrestador: number;
  codigoSeguranca: string;
  status: 'aguardando_pagamento' | 'em_custodia' | 'liberado' | 'em_disputa' | 'estornado';
  createdAt: Date;
}

export class EscrowService {
  /**
   * Cria um contrato de custódia seguro entre Contratante e Prestador
   */
  public static criarContratoCustodia(
    jobId: string,
    contratanteId: string,
    prestadorId: string,
    valorBruto: number,
    tierPrestador: ScoreTier,
    isElitePrestador: boolean
  ): ContractData {
    const taxaPercentual = ScoreService.obterTaxaComissao(tierPrestador, isElitePrestador);
    const taxaFundoGarantiaPercentual = 1.5; // 1.5% para o fundo de proteção mútua

    const valorTaxaPlataforma = Number(((valorBruto * taxaPercentual) / 100).toFixed(2));
    const fundoGarantiaTaxa = Number(((valorBruto * taxaFundoGarantiaPercentual) / 100).toFixed(2));
    const valorLiquidoPrestador = Number((valorBruto - valorTaxaPlataforma - fundoGarantiaTaxa).toFixed(2));

    // Código de 6 dígitos que o cliente entrega presencialmente ao prestador ao término do trabalho
    const codigoSeguranca = Math.floor(100000 + Math.random() * 900000).toString();

    return {
      id: uuidv4(),
      jobId,
      contratanteId,
      prestadorId,
      valorBruto,
      taxaPercentual,
      valorTaxaPlataforma,
      fundoGarantiaTaxa,
      valorLiquidoPrestador,
      codigoSeguranca,
      status: 'aguardando_pagamento',
      createdAt: new Date()
    };
  }

  /**
   * Confirma recebimento do Pix e retém o valor em custódia (Escrow Ativo)
   */
  public static reterEmCustodia(contrato: ContractData): ContractData {
    if (contrato.status !== 'aguardando_pagamento') {
      throw new Error(`Contrato inválido para retenção. Status atual: ${contrato.status}`);
    }
    contrato.status = 'em_custodia';
    return contrato;
  }

  /**
   * Valida código de segurança de conclusão e libera os fundos líquidos para o prestador
   */
  public static liberarPagamentoPrestador(
    contrato: ContractData,
    codigoInformado: string
  ): { contrato: ContractData; valorLiberado: number } {
    if (contrato.status !== 'em_custodia') {
      throw new Error('O pagamento não está em custódia ou já foi liberado/disputado.');
    }

    if (contrato.codigoSeguranca !== codigoInformado) {
      throw new Error('Código de segurança de conclusão inválido. Verifique com o contratante.');
    }

    contrato.status = 'liberado';
    return {
      contrato,
      valorLiberado: contrato.valorLiquidoPrestador
    };
  }
}
