import { Tipo } from "../../Enum/usuario/Tipo.enum";

export interface UsuarioPerfil {
  codigo: bigint;
  nomeCompleto: string;
  login: string;
  tipo: Tipo;
}