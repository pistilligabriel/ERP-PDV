import { VendaPorPagamento } from "./VendaPorPagamento.interface";

export interface DashboardVendasResponse {
  quantidadeVendas: number;
  valorVendido: number;
  quantidadeProdutos: number;
  ticketMedio: number;
  vendasPorPagamento: VendaPorPagamento[];
}