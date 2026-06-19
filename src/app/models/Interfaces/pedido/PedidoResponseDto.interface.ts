import { FormaPagamento } from "../../Enum/pedido/FormaPagamento.enum";
import { Status } from "../../Enum/Status.enum";
import { ClienteResumoDto } from "./ClienteResumoDto.interface";
import { ItemVendaResponseDto } from "./ItemVendaResponseDto.interface";

export interface PedidoResponseDto {
codigo: bigint;
dataEmissao: Date;
status: Status;
integrante: ClienteResumoDto;
formaPagamento: FormaPagamento;
parcelas: number | null;
tipoVenda: 'VENDA' | 'ORÇAMENTO';
desconto: number;
totalSemDesconto: number;
total: number;
lucro: number;
lucroTotal: number;
produtos: ItemVendaResponseDto[];
}