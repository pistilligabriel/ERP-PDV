// src/app/services/venda-context.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VendaContextService {
  private tipoVendaSelecionado: 'ORÇAMENTO' | 'VENDA'| null = null;
  private clienteNome:string | null = ''

  setTipoVenda(tipo: 'ORÇAMENTO' | 'VENDA') {
    this.tipoVendaSelecionado = tipo;
  }

  getTipoVenda(): 'ORÇAMENTO' | 'VENDA' | null {
    return this.tipoVendaSelecionado;
  }

  setClienteNome(nome:string){
    this.clienteNome = nome;
  }

  getClienteNome(){
    return this.clienteNome;
  }

  clearTipoVenda() {
    this.tipoVendaSelecionado = null;
    this.clienteNome = null;
  }
}
