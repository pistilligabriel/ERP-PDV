export interface ItemVendaResponseDto {
produtoId: bigint;
descricao: string;
modelo: string | null;
quantidade: number;
precoVenda: number;
totalItem: number;
}