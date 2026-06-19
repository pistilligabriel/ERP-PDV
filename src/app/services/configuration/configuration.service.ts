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
  private JWT_TOKEN: string = '';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  
    private empresaSubject = new BehaviorSubject<Config | null>(null);
    empresa$ = this.empresaSubject.asObservable()

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
  ) {
    this.JWT_TOKEN = this.cookies.get('Token');
  }

  atualizarEmpresa(config: Config){
        this.empresaSubject.next(config);
    }

    getConfig(): Observable<Config> {
        return this.http.get<Config>(`${this.API_URL}/empresa/1`, this.httpOptions);
    }

    getLogo(): Observable<Blob> {
        return this.http.get(`${this.API_URL}/empresa/1/logo`, { responseType: 'blob', headers: this.httpOptions.headers });
    }

    salvarConfig(formData: FormData): Observable<Config> {
        return this.http.post<Config>(`${this.API_URL}/empresa/upload`, formData);
    }
}
