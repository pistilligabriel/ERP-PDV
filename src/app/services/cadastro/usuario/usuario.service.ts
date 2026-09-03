import { Injectable } from "@angular/core";
import { environment } from "../../../../environment/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { Usuario } from "../../../models/Interfaces/usuario/Usuario.interface";
import { Tipo } from "../../../models/Enum/usuario/Tipo.enum";
import { AuthRequest } from "../../../models/Interfaces/usuario/auth/AuthRequest.interface";
import { AuthResponse } from "../../../models/Interfaces/usuario/auth/AuthResponse.interface";
import { AdicionarUsuario } from "../../../models/Interfaces/usuario/AdicionarUsuario.interface";
import { EditarUsuario } from "../../../models/Interfaces/usuario/EditarUsuario.interface";
import { IAlterarSenha } from "../../../models/Interfaces/usuario/auth/IAlterarSenha.interface";

@Injectable({
    providedIn:'root'
})

export class UsuarioService{
     private API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  // signupUser(usuario: SignupUserRequest): Observable<string> {
  //   return this.http.post<string>(`${this.API_URL}usuarios`, usuario);
  // }

  loginUser(usuario: AuthRequest): Observable<AuthResponse> {
    console.log(usuario);
    return this.http.post<AuthResponse>(`${this.API_URL}/autenticar`, usuario);
  }

  isLoggedIn() {
    const token = this.cookie.get('token');
    return token ? true : false;
  }

  getUsuarioEspecifico(codigo: bigint): Observable<Usuario> {
    return this.http.get<Usuario>(
      `${this.API_URL}/usuarios/${codigo}`,
      this.getHttpOptions()
    );
  }

  getAllUsuarios(): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(
      `${this.API_URL}/usuarios`,
      this.getHttpOptions()
    );
  }

  addUsuario(requestDatas: AdicionarUsuario): Observable<Array<Usuario>> {
    return this.http.post<Array<Usuario>>(
      `${this.API_URL}/usuarios`,
      requestDatas,
      this.getHttpOptions()
    );
  }

  editUsuario(requestDatas: EditarUsuario): Observable<Array<Usuario>> {
    return this.http.put<Array<Usuario>>(
      `${this.API_URL}/usuarios`,
      requestDatas,
      this.getHttpOptions()
    );
  }

  alterarTipo(codigo: bigint, tipo:Tipo):Observable<Usuario>{
    return this.http.patch<Usuario>(`${this.API_URL}/usuarios/alterar-tipo/${codigo}`,JSON.stringify(tipo),this.getHttpOptions())
  }
  

  desativarUsuario(codigo: bigint): Observable<Array<Usuario>> {
    return this.http.put<Array<Usuario>>(
      `${this.API_URL}/usuarios/alterar-status/${codigo}`,
      {},
      this.getHttpOptions()
    );
  }

   getUsuarioLogado(): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/perfil`, this.getHttpOptions())
  }

  logoutUser(codigo: bigint): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/usuarios/logout/${codigo}`, null, this.getHttpOptions());
  }

  alterarSenha(payload:IAlterarSenha):Observable<{message:string}>{
    return this.http.post<{message:string}>(`${this.API_URL}/usuarios/alterar-senha`,payload,this.getHttpOptions())
  }

  /**
   * Método para obter headers HTTP atualizados com o token mais recente
   */
  private getHttpOptions() {
    const token = this.cookie.get('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }
}