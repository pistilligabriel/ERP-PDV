import { TipoProduto } from "../../../Enum/pedido/TipoProduto.enum";

export interface AdicionarProduto {
  descricao: string,
  tipoProduto: TipoProduto | null,
  observacao: string,
  // fabricante: bigint,
  // modelo: string,
  // unidadeVenda: bigint,
  precoCusto: number,
  estoque: number,
  codigoBarras:string,
  precoVenda: number,
  margemLucro: number,
  empresa: number
}