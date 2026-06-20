import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Config } from '../../models/Interfaces/config/config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
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
  
    private empresaSubject = new BehaviorSubject<Config | null>(null);
    empresa$ = this.empresaSubject.asObservable()

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {
  }

  atualizarEmpresa(config: Config){
        this.empresaSubject.next(config);
    }

    getConfig(): Observable<Config> {
        return this.http.get<Config>(`${this.API_URL}/empresa/1`, this.getHttpOptions());
    }

    getLogo(): Observable<Blob> {
        return this.http.get(`${this.API_URL}/empresa/1/logo`, { responseType: 'blob', headers: this.getHttpOptions().headers });
    }

    salvarConfig(formData: FormData): Observable<Config> {
        return this.http.post<Config>(`${this.API_URL}/empresa/upload`, formData);
    }
}
