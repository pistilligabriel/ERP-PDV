import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Subject, takeUntil } from 'rxjs';
import { Config } from '../../models/Interfaces/config/config.interface';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { Table } from 'primeng/table';
import { Caixa } from '../../models/Interfaces/financeiro/caixa.interface';
import { Column } from '../../models/Interfaces/Column';
import { ExportColumn } from '../../models/Interfaces/ExportColumn';
import { Router } from '@angular/router';
import { CaixaService } from '../../services/financeiro/caixa.service';
import { AberturaDeCaixa } from '../../models/Interfaces/financeiro/AberturaDeCaixa.interface';

@Component({
  selector: 'app-caixa',
  standalone: false,
  templateUrl: './caixa.component.html',
  styleUrls: [],
})
export class CaixaComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @ViewChild('tabelaCaixa') tabelaCaixa: Table | undefined;

  public showForm = false;

  public caixaDatas: Array<Caixa> = [];

  public caixaSelecionado!: Caixa | null;

  valorPesquisa!: string;

  public fechamentoCaixa = false;

  public visualizar = false;

  /**
   * Limpa a seleção da tabela.
   *
   * @public
   * @memberof CaixaComponent
   * @param {Table} table - Instância da tabela a ser limpa.
   * @returns {void}
   */
  clear(table: Table) {
    this.valorPesquisa = '';
    table.clear();
  }

  atualizarTabela() {
    this.valorPesquisa = '';
    this.listarCaixas();
  }

  cols!: Column[];

  colunasSelecionadas!: Column[];

  exportColumns!: ExportColumn[];

  public caixaForm;

  constructor(
    private caixaService: CaixaService,
    private messageService: MessageService,
    private router: Router,
    private formBuilderCaixa: FormBuilder,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
  ) {
    this.caixaForm = this.formBuilderCaixa.group({
      codigo: [{ value: null as number | null, disabled: true }],
      dataAbertura: [{ value: null as Date | string | null, disabled: true }],
      dataFechamento: [{ value: null as Date | string | null, disabled: true }],
      saldoInicial: [null as number | null],
      saldoFinal: [{ value: null as number | null, disabled: true }],
      totalEntradas: [{ value: null as number | null, disabled: true }],
      totalSaidas: [{ value: null as number | null, disabled: true }],
      diferenca: [{ value: null as number | null, disabled: true }],
      status: [{ value: '', disabled: true }],
      usuarioId: [{ value: null as number | null, disabled: true }],
      observacao: [''],
    });
  }

  ngOnInit(): void {
    this.listarCaixas();

    this.cols = [
      { field: 'codigo', header: 'Código' },
      { field: 'status', header: 'Status' },
      { field: 'dataAbertura', header: 'Data Abertura' },
      { field: 'dataFechamento', header: 'Data Fechamento' },
    ];

    this.colunasSelecionadas = this.cols;
  }

  /**
   * Aplica um filtro global na tabela de caixas.
   *
   * @param $event O evento que acionou a função.
   * @param stringVal O valor da string para filtrar.
   */
  applyFilterGlobal($event: any, stringVal: any) {
    this.tabelaCaixa!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /**
   * Retorna a severidade com base no status fornecido.
   *
   * @param {string} status - Status a ser avaliado.
   * @returns {string} - Severidade correspondente.
   */
  getSeverity(status: string) {
    switch (status) {
      case 'ATIVO':
        return 'success';
      case 'DESATIVADO':
        return 'danger';
      default:
        return ''; // Add a default case that returns a default value
    }
  }

  /**
   * Manipulador de eventos para a seleção de uma linha na tabela.
   *
   * @param {*} event - Evento de seleção de linha.
   * @returns {void}
   */
  onRowSelect(event: any) {
    console.log('Row selected:', event.data);
    this.caixaSelecionado = event.data;
  }

  /**
   * Verifica se o formulário está em modo de edição.
   *
   * @returns {boolean} - Verdadeiro se estiver em modo de edição, falso caso contrário.
   */
  isEdicao(): boolean {
    return !!this.caixaForm.getRawValue().codigo;
  }

  visualizarCaixa(caixa: Caixa) {
    console.log(caixa);
    this.visualizar = true
    this.showForm = true;
    this.caixaService.getCaixa(caixa.codigo).subscribe({
      next: (caixa) => {
        this.caixaForm.patchValue({
          codigo: caixa.codigo,
          dataAbertura: caixa.dataAbertura,
          dataFechamento: caixa.dataFechamento,
          diferenca: caixa.diferenca,
          observacao: caixa.observacao,
          saldoInicial: caixa.saldoInicial,
          saldoFinal: caixa.saldoFinal,
          status: caixa.status,
          totalEntradas: caixa.totalEntradas,
          totalSaidas: caixa.totalSaidas,
        });
      },
    });
    this.caixaForm.get('saldoInicial')?.disable()
  }

  /**
   * Manipulador de eventos para o botão de adição de caixa.
   * Exibe o formulário de adição de caixa.
   */
  onAddButtonClick() {
    this.showForm = true;
    this.caixaForm.setValue({
      codigo: null,
      dataAbertura: null,
      dataFechamento: null,
      saldoInicial: null,
      saldoFinal: null,
      totalEntradas: null,
      totalSaidas: null,
      diferenca: null,
      status: null,
      usuarioId: null,
      observacao: null,
    });
  }

  onDisableButtonClick(caixa: Caixa): void {
    this.caixaForm.patchValue({
      codigo: caixa.codigo,
    });
    this.showForm = true
    this.fechamentoCaixa = true
    this.visualizarCaixa(caixa)
  }

  /**
   * Cancela o formulário de adição/editação e limpa os campos.
   */
  cancelarFormulario() {
    this.caixaForm.reset();
    this.showForm = false;
    this.listarCaixas();
  }

  listarCaixas() {
    this.caixaService
      .getAllCaixa()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.caixaDatas = response;
            this.cd.detectChanges();
          }
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao carregar lista de caixas',
            detail: error.message,
            life: 3000,
          });
        },
      });
  }

  cancelarVisualizacao() {
    this.showForm = false;
    this.listarCaixas();
  }

  /**
   * Abre um novo caixa.
   */
  abrirCaixa(): void {
    if (this.caixaForm.valid) {
      const aberturaCaixaRequest: AberturaDeCaixa = {
        saldoInicial: this.caixaForm.value.saldoInicial as number,
      };
      this.caixaService
        .abrirCaixa(aberturaCaixaRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Sucesso ao abrir caixa:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Caixa aberto com sucesso!',
              life: 3000,
            });

            // Resetar o formulário
            this.caixaForm.reset();

            // Voltar para a tabela
            this.showForm = false;

            // Recarregar os dados da tabela
            this.listarCaixas();
          },
          error: (error: any) => {
            console.error('Erro ao abrir caixa:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `${error.error}`,
              life: 3000,
            });
          },
        });
    } else {
      console.log('Formulário inválido. Preencha todos os campos.', this.caixaForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos!',
        life: 3000,
      });
    }
  }

  fecharCaixa() {
    if (this.caixaSelecionado != null) {
      this.caixaService
        .fecharCaixa(this.caixaSelecionado.codigo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            if (response) {
              console.log('Sucesso ao Alterar o Status!:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Status Alterado com sucesso!',
                life: 3000,
              });
            }
            this.listarCaixas();
          },
          error: (error: any) => {
            console.error('Erro ao Fechar Caixa!:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao Fechar Caixa!!',
              life: 3000,
            });
          },
        });
    } else {
      console.warn('Nenhum caixa selecionado.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione um caixa!',
        life: 3000,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
