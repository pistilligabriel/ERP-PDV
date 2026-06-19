import { FormaPagamento } from "../../Enum/pedido/FormaPagamento.enum";
import { ItemVendaDto } from "./ItemDto.interface";

export interface PedidoDto {
clienteId: bigint;
formaPagamento: FormaPagamento;
tipoVenda: 'VENDA' | 'ORÇAMENTO';
parcelas?: number | null;
itens: ItemVendaDto[];
}