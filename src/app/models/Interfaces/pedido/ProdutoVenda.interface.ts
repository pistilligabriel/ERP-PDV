import { TipoProduto } from "../../Enum/pedido/TipoProduto.enum";

export interface ProdutoVenda {
  codigo: bigint;
  descricao: string;
  tipoProduto: TipoProduto;
  observacao: string | null;
  unidadeVenda: number | null; // alterado aqui
  fabricante: number | null; // alterado aqui
  modelo: string;
  precoVenda: number;
  precoCusto: number;
  estoque: number | null;
  quantidade: number;
}