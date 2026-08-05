import { TipoProduto } from "../../../Enum/pedido/TipoProduto.enum";

export interface EditarProduto {
  codigo: bigint,
  descricao: string,
  tipoProduto: TipoProduto,
  observacao: string,
  fabricante: bigint,
  modelo: string,
  unidadeVenda: bigint,
  precoCusto: number,
  estoque: number,
  codigoBarras:string,
  precoVenda: number,
  margemLucro: number,
  empresa: number,
  status: string;
}