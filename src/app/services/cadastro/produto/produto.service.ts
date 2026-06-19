import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Produto } from '../../../models/Interfaces/cadastro/produto/Produto.interface';
import { ProdutoVenda } from '../../../models/Interfaces/pedido/ProdutoVenda.interface';
import { AdicionarProduto } from '../../../models/Interfaces/cadastro/produto/AddProduto.interface';
import { EditarProduto } from '../../../models/Interfaces/cadastro/produto/EditProduto.interface';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
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
) {this.JWT_TOKEN = this.cookie.get('token');}


 getAllProdutos():Observable<Array<Produto>>{
  return this.http.get<Array<Produto>>(`${this.API_URL}/produtos`, this.httpOptions);
 }

 getAllProdutosVenda():Observable<Array<ProdutoVenda>>{
  return this.http.get<Array<ProdutoVenda>>(`${this.API_URL}/produtos`, this.httpOptions);
 }

 getProdutoEspecifico(codigo: bigint):Observable<Produto>{
  return this.http.get<Produto>(`${this.API_URL}/produtos/${codigo}`, this.httpOptions);
 }

 getProdutoEspecificoProduto(codigo: bigint):Observable<Produto>{
  return this.http.get<Produto>(`${this.API_URL}/produtos/${codigo}`, this.httpOptions);
 }

 adicionarProduto(requestDatas: AdicionarProduto):Observable<Array<Produto>>{
  return this.http.post<Array<Produto>>(`${this.API_URL}/produtos`, requestDatas, this.httpOptions);
 }

 editarProduto(requestDatas: EditarProduto):Observable<Array<Produto>>{
  return this.http.put<Array<Produto>>(`${this.API_URL}/produtos`, requestDatas, this.httpOptions);
 }

 desativarProduto(CODIGO:bigint):Observable<Array<Produto>>{
  return this.http.post<Array<Produto>>(`${this.API_URL}/produtos/alterar-status/${CODIGO}`, this.httpOptions);
 }

 removerProduto(CODIGO:bigint):Observable<Array<Produto>>{
  return this.http.delete<Array<Produto>>(`${this.API_URL}/produtos/${CODIGO}`, this.httpOptions);
 }

 acertoEstoque(codigo:bigint,estoque:number):Observable<Produto>{
  return this.http.patch<Produto>(`${this.API_URL}/produtos/acerto/${codigo}`,{estoque},this.httpOptions)
 }
}
