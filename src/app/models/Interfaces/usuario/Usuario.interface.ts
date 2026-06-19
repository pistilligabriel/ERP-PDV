import { Tipo } from "../../Enum/usuario/Tipo.enum";

export interface Usuario {
  codigo: bigint;
  dataCadastro: string;
  nomeCompleto: string;
  tipo: Tipo;
  telefone: string;
  email: string;
  documento: string;
  login: string;
  password: string;
  status: string;
  empresa: number;
  versao: string;
}