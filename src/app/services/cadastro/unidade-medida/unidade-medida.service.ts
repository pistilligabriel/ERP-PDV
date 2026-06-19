import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { AdicionarUnidade } from '../../../models/Interfaces/cadastro/unidade-medida/AddUnidade.interface';
import { UnidadeMedida } from '../../../models/Interfaces/cadastro/unidade-medida/UnidadeMedida.interface';
import { EditarUnidade } from '../../../models/Interfaces/cadastro/unidade-medida/EditUnidade.interface';


@Injectable({
  providedIn: 'root'
})
export class UnidadeMedidaService {
private API_URL = environment.apiUrl;
private JWT_TOKEN = ''
private httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.JWT_TOKEN}`,
  }),
};

constructor(
  private http: HttpClient,
  private cookie: CookieService
) { 
  this.JWT_TOKEN = this.cookie.get('token');
}

  addUnidade(unidade: AdicionarUnidade):Observable<Array<UnidadeMedida>>{
    return this.http.post<Array<UnidadeMedida>>(`${this.API_URL}/unidade-medida`,unidade,this.httpOptions)
  }
  
  editUnidade(requestData:EditarUnidade):Observable<UnidadeMedida>{
    return this.http.put<UnidadeMedida>(`${this.API_URL}/unidade-medida`,requestData,this.httpOptions)
  }

  desativarUnidade(codigo:bigint):Observable<UnidadeMedida>{
  return this.http.post<UnidadeMedida>(`${this.API_URL}/unidade-medida/alterar-status/${codigo}`, this.httpOptions);
 }

 getAllUnidades():Observable<Array<UnidadeMedida>>{
  return this.http.get<Array<UnidadeMedida>>(`${this.API_URL}/unidade-medida`, this.httpOptions);
 }

  getUnidadeEspecifica(codigo: bigint):Observable<UnidadeMedida>{
  return this.http.get<UnidadeMedida>(`${this.API_URL}/unidade-medida/${codigo}`, this.httpOptions);
 }
}
