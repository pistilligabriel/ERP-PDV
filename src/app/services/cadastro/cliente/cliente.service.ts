import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Clientes } from '../../../models/Interfaces/cadastro/clientes/Clientes.interface';
import { AddCliente } from '../../../models/Interfaces/cadastro/clientes/AddCliente.interface';
import { EditCliente } from '../../../models/Interfaces/cadastro/clientes/EditCliente.interface';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private API_URL = environment.apiUrl;
  private JWT_TOKEN = '';
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
  this.JWT_TOKEN = this.cookie.get('Token')
}


getAllCliente():Observable<Array<Clientes>>{
  return this.http.get<Array<Clientes>>(`${this.API_URL}/clientes`, this.httpOptions);
}

getCliente(CODIGO:bigint):Observable<Clientes>{
  return this.http.get<Clientes>(`${this.API_URL}/clientes/${CODIGO}`, this.httpOptions);
}

addCliente(requestDatas: AddCliente): Observable<Array<Clientes>>{
  return this.http.post<Array<Clientes>>(`${this.API_URL}/clientes`, requestDatas, this.httpOptions);
}

editCliente(requestDatas: EditCliente): Observable<Array<Clientes>>{
  return this.http.put<Array<Clientes>>(`${this.API_URL}/clientes`, requestDatas, this.httpOptions);
}

desativarCliente(CODIGO:bigint):Observable<Array<Clientes>>{
  return this.http.post<Array<Clientes>>(`${this.API_URL}/clientes/desativar/${CODIGO}`, this.httpOptions);
}

}
