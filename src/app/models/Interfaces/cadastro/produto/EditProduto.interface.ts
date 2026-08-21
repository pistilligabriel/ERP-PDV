import { TipoProduto } from "../../../Enum/pedido/TipoProduto.enum";

export interface EditarProduto {
  codigo: bigint,
  descricao: string,
  observacao: string,
  precoCusto: number,
  estoque: number,
  codigoBarras:string,
  precoVenda: number,
  margemLucro: number,
  empresa: number,
  status: string;
}