import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { PedidoDto } from '../../../models/Interfaces/pedido/PedidoDto.interface';
import { ResponseModuloVendaDto } from '../../../models/Interfaces/pedido/ResponseModuloVenda.interface';


@Injectable({
  providedIn: 'root',
})
export class VendaService {
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
    private cookie: CookieService,
  ) {
    this.JWT_TOKEN = this.cookie.get('token');
  }

  criarPedido(requestVenda: PedidoDto): Observable<Array<PedidoDto>> {
    return this.http.post<Array<PedidoDto>>(
      `${this.API_URL}/pedidos`,
      requestVenda,
      this.httpOptions,
    );
  }

  getAllVendas(): Observable<Array<ResponseModuloVendaDto>> {
    return this.http.get<Array<ResponseModuloVendaDto>>(
      `${this.API_URL}/pedidos`,
      this.httpOptions,
    );
  }

  cancelarVenda(codigo: bigint): Observable<Array<PedidoDto>> {
    return this.http.post<Array<PedidoDto>>(
      `${this.API_URL}/pedidos/cancelar/${codigo}`,
      this.httpOptions,
    );
  }

  //     desativarCliente(CODIGO:bigint):Observable<Array<Clientes>>{
  //   return this.http.post<Array<Clientes>>(`${this.API_URL}/clientes/desativar/${CODIGO}`, this.httpOptions);
  // }
}
