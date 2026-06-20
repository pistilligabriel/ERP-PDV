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
 private getHttpOptions(){
    const token = this.cookie.get('token')
    
    return {
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        Authorization: `Bearer ${token}` 
      })
    }
  }
constructor(
    private http: HttpClient,
    private cookie: CookieService
) { 
}


getAllCliente():Observable<Array<Clientes>>{
  return this.http.get<Array<Clientes>>(`${this.API_URL}/clientes`, this.getHttpOptions());
}

getCliente(CODIGO:bigint):Observable<Clientes>{
  return this.http.get<Clientes>(`${this.API_URL}/clientes/${CODIGO}`, this.getHttpOptions());
}

addCliente(requestDatas: AddCliente): Observable<Array<Clientes>>{
  return this.http.post<Array<Clientes>>(`${this.API_URL}/clientes`, requestDatas, this.getHttpOptions());
}

editCliente(requestDatas: EditCliente): Observable<Array<Clientes>>{
  return this.http.put<Array<Clientes>>(`${this.API_URL}/clientes`, requestDatas, this.getHttpOptions());
}

desativarCliente(CODIGO:bigint):Observable<Array<Clientes>>{
  return this.http.post<Array<Clientes>>(`${this.API_URL}/clientes/desativar/${CODIGO}`, this.getHttpOptions());
}

}
