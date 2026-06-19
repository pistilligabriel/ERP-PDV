import { Uf } from "../../../Enum/cadastro/Uf.enum";

export interface AddCliente {
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
}