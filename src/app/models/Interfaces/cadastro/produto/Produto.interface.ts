import { TipoProduto } from "../../../Enum/pedido/TipoProduto.enum";
import { Marca } from "../marca/Marca.interface";
import { UnidadeMedida } from "../unidade-medida/UnidadeMedida.interface";

export interface Produto {
  codigo: bigint,
  descricao: string,
  tipoProduto: TipoProduto | null,
  observacao: string,
  fabricante: Marca,
  modelo: string,
  unidadeVenda?: UnidadeMedida,
  precoCusto: number,
  estoque: number,
  quantidade: number,
  desconto: number,
  precoVenda: number,
  margemLucro: number,
  status: string;
  empresa: number;
  versao: string;
  dataCadastro: string;
}