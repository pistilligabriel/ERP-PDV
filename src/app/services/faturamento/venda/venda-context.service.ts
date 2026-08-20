// src/app/services/venda-context.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VendaContextService {
<<<<<<< HEAD
  private tipoVendaSelecionado: 'ORÇAMENTO' | 'VENDA'| null = null;
  private clienteNome = ''
=======
  private tipoVendaSelecionado: 'ORÇAMENTO' | 'VENDA' | null = null;
  private nomeCliente: string | null = null;
>>>>>>> dd84da36cd6438252b9b16452b361f752ff08139

  setTipoVenda(tipo: 'ORÇAMENTO' | 'VENDA') {
    this.tipoVendaSelecionado = tipo;
  }

  getTipoVenda(): 'ORÇAMENTO' | 'VENDA' | null {
    return this.tipoVendaSelecionado;
  }

<<<<<<< HEAD
  setClienteNome(nome:string){
    this.clienteNome = nome;
  }

  getClienteNome(){
    return this.clienteNome;
=======
  setNomeCliente(nome: string | null): void {
    this.nomeCliente = nome?.trim() || null;
  }

  getNomeCliente(): string | null {
    return this.nomeCliente;
>>>>>>> dd84da36cd6438252b9b16452b361f752ff08139
  }

  clearTipoVenda() {
    this.tipoVendaSelecionado = null;
    this.nomeCliente = null;
  }
}
