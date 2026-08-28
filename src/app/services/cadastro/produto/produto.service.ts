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
  providedIn: 'root',
})
export class ProdutoService {
  private API_URL = environment.apiUrl;

  private getHttpOptions() {
    const token = this.cookie.get('token');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {}

  getAllProdutos(): Observable<Array<Produto>> {
    return this.http.get<Array<Produto>>(`${this.API_URL}/produtos`, this.getHttpOptions());
  }

  getAllProdutosVenda(): Observable<Array<ProdutoVenda>> {
    return this.http.get<Array<ProdutoVenda>>(
      `${this.API_URL}/produtos/venda`,
      this.getHttpOptions(),
    );
  }

  getProdutoEspecifico(codigo: bigint): Observable<ProdutoVenda> {
    return this.http.get<ProdutoVenda>(`${this.API_URL}/produtos/${codigo}`, this.getHttpOptions());
  }

  getProdutoEspecificoProduto(codigo: bigint): Observable<Produto> {
    return this.http.get<Produto>(`${this.API_URL}/produtos/${codigo}`, this.getHttpOptions());
  }

  buscarPorCodigoBarras(codigobarras: string): Observable<ProdutoVenda> {
    return this.http.get<ProdutoVenda>(
      `${this.API_URL}/produtos/codigo-barras/${codigobarras}`,
      this.getHttpOptions(),
    );
  }

  adicionarProduto(requestDatas: AdicionarProduto): Observable<Array<Produto>> {
    return this.http.post<Array<Produto>>(
      `${this.API_URL}/produtos`,
      requestDatas,
      this.getHttpOptions(),
    );
  }

  editarProduto(requestDatas: EditarProduto): Observable<Array<Produto>> {
    return this.http.put<Array<Produto>>(
      `${this.API_URL}/produtos`,
      requestDatas,
      this.getHttpOptions(),
    );
  }

  desativarProduto(CODIGO: bigint): Observable<Array<Produto>> {
    return this.http.post<Array<Produto>>(
      `${this.API_URL}/produtos/alterar-status/${CODIGO}`,
      this.getHttpOptions(),
    );
  }

  removerProduto(CODIGO: bigint): Observable<Array<Produto>> {
    return this.http.delete<Array<Produto>>(
      `${this.API_URL}/produtos/${CODIGO}`,
      this.getHttpOptions(),
    );
  }

  entradaEstoque(codigo: bigint, quantidade: number): Observable<Produto> {
    return this.http.patch<Produto>(
      `${this.API_URL}/produtos/entrada/${codigo}/${quantidade}`,
      this.getHttpOptions(),
    );
  }

  saidaEstoque(codigo: bigint, quantidade: number): Observable<Produto> {
    return this.http.patch<Produto>(
      `${this.API_URL}/produtos/saida/${codigo}/${quantidade}`,
      this.getHttpOptions(),
    );
  }

  pesquisar(termo: string): Observable<ProdutoVenda[] |Produto[] > {
    return this.http.get<ProdutoVenda[]>(`${this.API_URL}/produtos/pesquisar`, {
      ...this.getHttpOptions(),
      params: {
        termo,
      },
    });
  }

  

  gerarCodigoBarras(): Observable<string> {
    console.log('Chamando gerar código de barras');

    const url = `${this.API_URL}/produtos/gerar-codigo-barras`;

    console.log('URL:', url);

    return this.http.get(url, {
      responseType: 'text',
    });
  }

  imprimirEtiquetas(request: any) {
    return this.http.post(`${this.API_URL}/impressao/imprimir-etiquetas`, request);
  }
}
