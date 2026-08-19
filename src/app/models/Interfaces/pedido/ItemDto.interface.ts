export interface ItemVendaDto {
  produtoId: bigint;
  quantidade: number;
  observacao?: string | null;
}