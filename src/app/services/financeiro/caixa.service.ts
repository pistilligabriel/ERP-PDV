import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Caixa } from "../../models/Interfaces/financeiro/caixa.interface";
import { AberturaDeCaixa } from "../../models/Interfaces/financeiro/AberturaDeCaixa.interface";

@Injectable({
  providedIn: 'root'
})
export class CaixaService {
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
) { }

  getCaixa(codigo:number):Observable<Caixa>{
    return this.http.get<Caixa>(`${this.API_URL}/caixas/${codigo}`,this.getHttpOptions())
  }

  getAllCaixa():Observable<Array<Caixa>>{
    return this.http.get<Array<Caixa>>(`${this.API_URL}/caixas`,this.getHttpOptions())
  }

  abrirCaixa(aberturaCaixa: AberturaDeCaixa):Observable<Array<Caixa>>{
    return this.http.post<Array<Caixa>>(`${this.API_URL}/caixas`,aberturaCaixa,this.getHttpOptions())
  }
  
  fecharCaixa(codigo:number):Observable<Array<Caixa>>{
    return this.http.post<Array<Caixa>>(`${this.API_URL}/caixas/fecharCaixa/${codigo}`,this.getHttpOptions())
  }
}