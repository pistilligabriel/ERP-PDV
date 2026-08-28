import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { DashboardVendasResponse } from '../../models/Interfaces/dashboard/DashboardVendasResponse.interface';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
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
  ) {}

  public buscarDashboard(dataInicio: string, dataFim: string): Observable<DashboardVendasResponse> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<DashboardVendasResponse>(
      `${this.API_URL}/pedidos/dashboard`, 
      { 
        headers: this.getHttpOptions().headers,
        params: params 
      }
    );
  }
}