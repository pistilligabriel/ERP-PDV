import { TipoProduto } from "../../../Enum/pedido/TipoProduto.enum";

export interface AdicionarProduto {
  descricao: string,
  observacao: string,
<<<<<<< HEAD
  // fabricante: bigint,
  // modelo: string,
  // unidadeVenda: bigint,
=======
>>>>>>> dd84da36cd6438252b9b16452b361f752ff08139
  precoCusto: number,
  estoque: number,
  codigoBarras:string,
  precoVenda: number,
  margemLucro: number,
  empresa: number
}