import { Uf } from "../../../Enum/cadastro/Uf.enum";

export interface Clientes {
  codigo: bigint;
  tipoIntegrante: string;
  nomeCompleto: string;
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
  status: string;
  empresa: number;
  versao: string;
}