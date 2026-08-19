import { TipoProduto } from "../../../Enum/pedido/TipoProduto.enum";

export interface AdicionarProduto {
  descricao: string,
  observacao: string,
  precoCusto: number,
  estoque: number,
  codigoBarras:string,
  precoVenda: number,
  margemLucro: number,
  empresa: number
}