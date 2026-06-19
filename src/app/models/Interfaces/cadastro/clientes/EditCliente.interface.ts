import { Uf } from "../../../Enum/cadastro/Uf.enum";

export interface EditCliente {
  codigo: bigint;
  nomeCompleto: string;
  status: string;
  telefone: string;
  email: string;
  tipoDocumento: string;
  documento: string;
  cep: string;
  logradouro: string;
  numero: number;
  bairro: string;
  municipio: string;
  uf: Uf;
  complemento: string;
  versao: string;
  empresa: number
}