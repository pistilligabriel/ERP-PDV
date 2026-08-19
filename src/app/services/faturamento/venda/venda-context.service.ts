// src/app/services/venda-context.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VendaContextService {
  private tipoVendaSelecionado: 'ORÇAMENTO' | 'VENDA' | null = null;
  private nomeCliente: string | null = null;

  setTipoVenda(tipo: 'ORÇAMENTO' | 'VENDA') {
    this.tipoVendaSelecionado = tipo;
  }

  getTipoVenda(): 'ORÇAMENTO' | 'VENDA' | null {
    return this.tipoVendaSelecionado;
  }

  setNomeCliente(nome: string | null): void {
    this.nomeCliente = nome?.trim() || null;
  }

  getNomeCliente(): string | null {
    return this.nomeCliente;
  }

  clearTipoVenda() {
    this.tipoVendaSelecionado = null;
    this.nomeCliente = null;
  }
}
