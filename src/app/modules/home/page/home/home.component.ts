import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';

// Registra os dados para o português (o Angular usa 'pt' para abranger o pt-BR)
registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: [],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  dataInicio: Date = new Date();
  dataFim: Date = new Date();

  quantidadeVendas = 0;
  valorVendido = 0;
  quantidadeProdutos = 0;
  ticketMedio = 0;

  vendasPorPagamento = [
    {
      formaPagamento: 'PIX',
      valor: 0,
    },
    {
      formaPagamento: 'Cartão de Crédito',
      valor: 0,
    },
    {
      formaPagamento: 'Cartão de Débito',
      valor: 0,
    },
    {
      formaPagamento: 'Dinheiro',
      valor: 0,
    },
  ];

  graficoPagamentos: any;

  graficoOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit() {
    // Definir datas iniciais padrão (ex: primeiro dia do mês até hoje)
    const hoje = new Date();
    this.dataInicio = hoje;
    this.dataFim = hoje;

    this.buscarDados();
    this.inicializarConfiguracoesGrafico();
  }

  @HostListener('window:focus')
  onWindowFocus() {
    this.buscarDados();
  }

  buscarDados() {
    // Formata as datas para string no padrão ISO (YYYY-MM-DD) ou o que sua API exigir
    const dataInicioFormatada = this.formatarData(this.dataInicio);
    const dataFimFormatada = this.formatarData(this.dataFim);

    this.dashboardService
      .buscarDashboard(dataInicioFormatada, dataFimFormatada)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.quantidadeVendas = response.quantidadeVendas;
          this.valorVendido = response.valorVendido;
          this.quantidadeProdutos = response.quantidadeProdutos;
          this.ticketMedio = response.ticketMedio;
          this.vendasPorPagamento = response.vendasPorPagamento.map(item => ({
            ...item,
            formaPagamento: this.formatarFormaPagamento(item.formaPagamento)
          }));

          // Atualiza os dados do gráfico de rosca (Doughnut)
          this.atualizarGrafico(this.vendasPorPagamento);

          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error('Erro ao buscar dados do dashboard', err);
        },
      });
  }

private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private inicializarConfiguracoesGrafico() {
    this.graficoOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };
  }

  private formatarFormaPagamento(tipo: string): string {
    const nomesPagamento: { [key: string]: string } = {
      'CARTAO_CREDITO_A_VISTA': 'Cartão de Crédito à Vista',
      'CARTAO_PARCELADO': 'Cartão de Crédito Parcelado',
      'CARTAO_DEBITO': 'Cartão de Débito',
      'DINHEIRO': 'Dinheiro',
      'PIX': 'PIX',
      // Adicione outros enuns caso possua
    };

    return nomesPagamento[tipo] || tipo; // Se não achar, retorna o original formatado um pouco
  }
  
  private atualizarGrafico(
  dados: { formaPagamento: string; valor: number }[]
) {
  this.graficoPagamentos = {
    labels: dados.map(item => item.formaPagamento),
    datasets: [
      {
        data: dados.map(item => item.valor),

        backgroundColor: [
          '#22C55E', // Cartão de Débito
          '#3B82F6', // Crédito à Vista
          '#F59E0B', // Dinheiro
          '#EF4444', // PIX
          '#A855F7', // Crédito Parcelado
        ],

        hoverBackgroundColor: [
          '#16A34A',
          '#2563EB',
          '#D97706',
          '#DC2626',
          '#9333EA',
        ],
      },
    ],
  };
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
