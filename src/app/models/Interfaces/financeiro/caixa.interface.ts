export interface Caixa {
    codigo: number;
    dataAbertura: string;
    dataFechamento?: string;

    saldoInicial: number;
    saldoFinal?: number;

    totalEntradas: number;
    totalSaidas: number;

    diferenca?: number;

    status: 'ABERTO' | 'FECHADO';

    usuarioId: number;

    observacao?: string;
}