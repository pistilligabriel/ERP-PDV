import { PedidoDto } from "./PedidoDto.interface";
import { PedidoResponseDto } from "./PedidoResponseDto.interface";

export interface ResponseModuloVendaDto {
   codigo: bigint;
  pedidoDto: PedidoResponseDto;
}