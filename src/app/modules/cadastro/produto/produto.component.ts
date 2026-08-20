import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Table } from 'primeng/table';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Produto } from '../../../models/Interfaces/cadastro/produto/Produto.interface';
import { DropDownOptions } from '../../../models/Interfaces/cadastro/produto/DropDownOptions.interface';
import { DropDownTipoProduto } from '../../../models/Interfaces/cadastro/produto/DropDownTipoProduto.interface';
import { TipoProduto } from '../../../models/Enum/pedido/TipoProduto.enum';
import { Marca } from '../../../models/Interfaces/cadastro/marca/Marca.interface';
import { Tipo } from '../../../models/Enum/usuario/Tipo.enum';
import { EntradaAcertoEstoque } from '../../../models/Interfaces/cadastro/produto/EntradaAcertoEstoque.interface';
import { ProdutoService } from '../../../services/cadastro/produto/produto.service';
import { UsuarioService } from '../../../services/cadastro/usuario/usuario.service';
import { Router } from '@angular/router';
import { UnidadeMedidaService } from '../../../services/cadastro/unidade-medida/unidade-medida.service';
import { MarcaService } from '../../../services/cadastro/marca/marca.service';
import { ConfigurationService } from '../../../services/configuration/configuration.service';
import { Column } from '../../../models/Interfaces/Column';
import { ExportColumn } from '../../../models/Interfaces/ExportColumn';
import { Status } from '../../../models/Enum/Status.enum';
import { AdicionarProduto } from '../../../models/Interfaces/cadastro/produto/AddProduto.interface';
import { EditarProduto } from '../../../models/Interfaces/cadastro/produto/EditProduto.interface';
import { format } from 'date-fns';
import { Config } from '../../../models/Interfaces/config/config.interface';
import { UnidadeMedida } from '../../../models/Interfaces/cadastro/unidade-medida/UnidadeMedida.interface';
import { Usuario } from '../../../models/Interfaces/usuario/Usuario.interface';
import { ProdutoVenda } from '../../../models/Interfaces/pedido/ProdutoVenda.interface';
import { ImpressaoEtiquetaRequest } from '../../../models/Interfaces/cadastro/produto/Impressao/ImpressaoEtiquetaRequest.interface';

@Component({
  selector: 'app-produto',
  standalone: false,
  templateUrl: './produto.component.html',
  styleUrls: [],
})
export class ProdutoComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private pesquisa$ = new Subject<string>();

  @ViewChild('tabelaProduto') tabelaProduto: Table | undefined;

  @ViewChild('cm') cm!: ContextMenu;

  items: MenuItem[] | undefined;

  /**
   * Flag para exibir ou ocultar o formulário de produto.
   */
  public showForm = false;

  empresa!: Config;

  isEdicao: boolean = false;

  /**
   * Lista de dados de produtos.
   */
  public produtoDatas: Array<Produto> = [];

  public produtoSelecionado!: Produto[] | null;

  public produto!: Produto;

  resultadoPesquisa: ProdutoVenda[] = [];

  quantidadesEtiquetas = new Map<number, number>();

  // MODO SISTEMA AVANÇADO
  // unidadeMedidas!: DropDownOptions[];
  // unidadeMedidaSelecionada!: UnidadeMedida;
  // marca!: DropDownOptions[];
  // marcaSelecionada!: Marca;

  usuario!: Usuario;

  Tipo = Tipo;

  mostrarTelaAcaoEntradaEstoque: boolean = false;

  mostrarTelaAcaoSaidaEstoque: boolean = false;

  mostrarTelaModuloImpressaoEtiquetas: boolean = false;

  quantidadeSaidaEstoque!: EntradaAcertoEstoque;

  public produtoForm;

  public produtoAcertoEstoqueForm;

  constructor(
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router,
    private formBuilderProduto: FormBuilder,
    private confirmationService: ConfirmationService,
    private configService: ConfigurationService,
    private cd: ChangeDetectorRef,
  ) {
    this.produtoForm = this.formBuilderProduto.group({
      codigo: [{ value: null as bigint | null, disabled: true }],
      descricao: ['', [Validators.required]],
      observacao: [''],
      codigoBarras: [''],
      precoCusto: [null as number | null],
      estoque: [null as number | null, [Validators.required]],
      precoVenda: [null as number | null, [Validators.required]],
      margemLucro: [{ value: 0, disabled: true }],
      status: [{ value: '', disabled: true }],
      empresa: [{ value: 1, disabled: true }],
      dataCadastro: [{ value: null as Date | string | null, disabled: true }],
      versao: [{ value: null as Date | string | null, disabled: true }],
    });

    this.produtoAcertoEstoqueForm = this.formBuilderProduto.group({
      codigo: [{ value: null as bigint | null, disabled: true }],
      estoque: [null, [Validators.required]],
    });
  }

  valorPesquisa!: string;

  /**
   * Limpa a seleção da tabela.
   *
   * @public
   * @memberof ProdutoComponent
   * @param {Table} table - Instância da tabela a ser limpa.
   * @returns {void}
   */
  clear(table: Table) {
    this.valorPesquisa = '';
    table.clear();
  }

  atualizarTabela() {
    this.valorPesquisa = '';
    this.listarProdutos();
  }

  cols!: Column[];

  colunasSelecionadas!: Column[];

  exportColumns!: ExportColumn[];

  /**
   * Formulário reativo para adicionar/editar grupos de usuários.
   */

  ngOnInit() {
    this.listarProdutos();
    this.cols = [
      { field: 'status', header: 'Status' },
      { field: 'descricao', header: 'Descrição' },
      { field: 'estoque', header: 'Quantidade Estoque' },
      { field: 'unidadeVenda', header: 'Unidade Venda' },
      { field: 'precoVenda', header: 'Valor Unitário' },
      { field: 'codigoBarras', header: 'Código de Barras' },
    ];
    this.colunasSelecionadas = this.cols;

    this.pesquisa$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termo) => this.produtoService.pesquisar(termo)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (produtos) => {
          this.produtoDatas = produtos as Produto[];
          this.cd.detectChanges();
        },
        error: () => {
          this.resultadoPesquisa = [];
        },
      });

    // MODO SISTEMA AVANÇADO

    // this.unidadeService.getAllUnidades().subscribe({
    //   next: (unidades) => {
    //     this.unidadeMedidas = unidades
    //     .filter(u => u.status === Status.ATIVO)
    //     .map(u => ({
    //       label: `${u.descricao} - (${u.simbolo})`,
    //       value: u.codigo // ou u.codigo, dependendo do que você salva no produto
    //     }));
    //   },
    //   error: (err) => {
    //     this.unidadeMedidas = [];
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Erro',
    //       detail: 'Erro ao carregar unidades de medida!',
    //       life: 3000,
    //     });
    //   }
    // });

    // this.marcaService.getAllMarca().subscribe({
    //   next: (marca) => {
    //     this.marca = marca
    //     .filter(m => m.status === Status.ATIVO)
    //     .map(m => ({
    //       label: `${m.descricao}`,
    //       value: m.codigo // ou u.codigo, dependendo do que você salva no produto
    //     }));
    //   },
    //   error: (err) => {
    //     this.marca = [];
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Erro',
    //       detail: 'Erro ao carregar marcas!',
    //       life: 3000,
    //     });
    //   }
    // });

    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log(this.usuario);
      },
      error: (e) => {
        console.log('Não foi possível obter o usuário logado', e);
      },
    });

    this.items = [
      {
        label: 'Entrada de produtos',
        icon: 'pi pi-plus',
        command: () => this.acaoEntradaEstoque(),
      },
      {
        label: 'Saída de produtos',
        icon: 'pi pi-wrench',
        command: () => this.acaoSaidaEstoque(),
      },
      {
        label: 'Imprimir etiquetas',
        icon: 'pi pi-ticket',
        command: () => this.telaImpressaoEtiquetas(),
      },
    ];

    this.configService
      .getConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          this.empresa = config;
        },
        error: (e) => {
          console.log('Não foi possível obter as configurações da empresa', e);
        },
      });
  }

  /**
   * Aplica um filtro global na tabela de grupos de usuários.
   *
   * @param $event O evento que acionou a função.
   * @param stringVal O valor da string para filtrar.
   */
  applyFilterGlobal($event: any, stringVal: any) {
    this.tabelaProduto!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
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
    this.produtoSelecionado = event.data;
  }

  adicionarEstoque(produto: Produto) {
    const estoque = this.produtoAcertoEstoqueForm.get('estoque')?.value;
    console.log(estoque);
    if (this.produto?.status === Status.DESATIVADO) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Produto desativado, não é possível realizar Entrada.',
        life: 5000,
      });
      return;
    }
    console.log('adicionarEstoque inicio');
    if (estoque != null) {
      console.log('verificou se estoque é null');
      this.produtoService
        .entradaEstoque(produto?.codigo, estoque)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Entrada feita com sucesso!',
                life: 5000,
              });
              this.mostrarTelaAcaoEntradaEstoque = false;
              this.listarProdutos();
            }
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.error,
              life: 5000,
            });
            console.error(e);
          },
        });
    }
  }

  saidaEstoque(produto: Produto) {
    const estoque = this.produtoAcertoEstoqueForm.get('estoque')?.value;
    console.log(estoque);
    if (this.produto?.status === Status.DESATIVADO) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Produto desativado, não é possível realizar acerto de estoque.',
        life: 5000,
      });
      return;
    }
    console.log('adicionarEstoque inicio');
    if (estoque != null) {
      console.log('verificou se estoque é null');
      this.produtoService
        .saidaEstoque(produto?.codigo, estoque)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Acerto de estoque feito com sucesso!',
                life: 5000,
              });
              this.quantidadeSaidaEstoque.estoque = null;
              this.mostrarTelaAcaoSaidaEstoque = false;
              this.listarProdutos();
            }
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.error,
              life: 5000,
            });
            console.error(e);
          },
        });
    }
  }

  visualizarProduto(produto: Produto) {
    this.showForm = true;
    this.produtoService.getProdutoEspecificoProduto(produto.codigo).subscribe({
      next: (p) => {
        let lucro = ((p.precoVenda - p.precoCusto) / p.precoVenda) * 100;
        this.produtoForm.patchValue({
          codigo: p.codigo,
          descricao: p.descricao,
          observacao: p.observacao,
          precoCusto: p.precoCusto,
          estoque: p.estoque,
          precoVenda: p.precoVenda,
          margemLucro: lucro,
          status: p.status,
          empresa: 1,
          versao: p.versao,
          dataCadastro: p.dataCadastro,
        });
        console.log(p);
      },
    });
    this.produtoForm.get('descricao')?.disable();
    this.produtoForm.get('observacao')?.disable();
    this.produtoForm.get('precoCusto')?.disable();
    this.produtoForm.get('estoque')?.disable();
    this.produtoForm.get('precoVenda')?.disable();
    this.produtoForm.get('margemLucro')?.disable();
  }

  /**
   * Manipulador de eventos para o botão de adição de grupo.
   * Exibe o formulário de adição de grupo.
   */
  onAddButtonClick() {
    this.isEdicao = false;
    const formattedDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    this.showForm = true;
    this.produtoForm.setValue({
      codigo: null,
      descricao: null,
      observacao: null,
      precoCusto: null,
      estoque: null,
      codigoBarras: null,
      precoVenda: null,
      margemLucro: null,
      status: 'ATIVO',
      empresa: 1,
      versao: null,
      dataCadastro: formattedDate,
    });

    this.produtoForm.get('precoVenda')?.valueChanges.subscribe(() => {
      this.atualizarMargemLucro();
    });

    this.atualizarMargemLucro();
  }
  verificarCusto() {
    console.log(this.produtoForm.value.precoCusto);
  }

  atualizarMargemLucro() {
    const precoCusto = this.produtoForm.get('precoCusto')?.value as number;
    const precoVenda = this.produtoForm.get('precoVenda')?.value as number;
    if (precoCusto != null && precoVenda != null) {
      const newMargemLucro = ((precoVenda - precoCusto) / precoCusto) * 100;
      this.produtoForm.patchValue({
        margemLucro: newMargemLucro,
      });
    } else {
      this.produtoForm.patchValue({
        margemLucro: null,
      });
    }
  }

  onEditButtonClick(produto: Produto): void {
    this.isEdicao = true;

    if (produto.status === 'DESATIVADO') {
      this.confirmationService.confirm({
        header: 'Aviso',
        message: 'Não é permitido editar um usuário desativado.',
      });
    } else {
      this.showForm = true;
      this.produtoService.getProdutoEspecificoProduto(produto.codigo).subscribe((data) => {
        this.produtoForm.patchValue({
          codigo: data.codigo,
          descricao: data.descricao,
          observacao: data.observacao,
          precoCusto: data.precoCusto,
          estoque: data.estoque,
          codigoBarras: data.codigoBarras,
          precoVenda: data.precoVenda,
          margemLucro: data.margemLucro,
          status: data.status,
          empresa: data.empresa,
          versao: data.versao,
          dataCadastro: data.dataCadastro,
        });
        this.produtoForm.get('precoVenda')?.valueChanges.subscribe(() => {
          this.atualizarMargemLucro();
        });

        this.atualizarMargemLucro();
      });
    }
  }

  onDisableButtonClick(produto: Produto): void {
    this.produtoForm.patchValue({
      codigo: produto.codigo,
    });
    this.desativarProduto(produto.codigo as bigint);
  }

  desativarProdutosSelecionados() {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja desativar os produtos selecionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.produtoDatas = this.produtoDatas.filter(
          (val) => !this.produtoSelecionado?.includes(val),
        );
        this.produtoSelecionado = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produtos Desativados',
          life: 3000,
        });
      },
    });
  }
  /**
   * Cancela o formulário de adição/editação e limpa os campos.
   */
  cancelarFormulario() {
    this.produtoForm.reset();
    this.showForm = false;
    this.listarProdutos();
  }

  carregarProdutoEspecifico(codigo: bigint) {
    this.produtoService
      .getProdutoEspecificoProduto(codigo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.produtoForm.patchValue({
              codigo: response.codigo,
              descricao: response.descricao,
              precoCusto: response.precoCusto,
              estoque: response.estoque,
              codigoBarras: response.codigoBarras,
              precoVenda: response.precoVenda,
              margemLucro: response.margemLucro,
              status: response.status,
              empresa: response.empresa,
              versao: response.versao,
            });
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * Lista os produtos chamando o serviço correspondente.
   */
  listarProdutos() {
    this.produtoService
      .getAllProdutos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.produtoDatas = response;
            this.cd.detectChanges();
          }
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao carregar os produtos',
            detail: error.message,
            life: 3000,
          });
          this.router.navigate(['/home']);
        },
      });
  }

  /**
   * Adiciona ou edita um produto com base no estado do formulário.
   */
  adicionarOuEditarProduto(): void {
    if (this.isEdicao) {
      this.editarProduto();
    } else {
      this.adicionarProduto();
    }
  }

  /**
   * Adiciona um novo produto.
   */
  adicionarProduto(): void {
    if (this.produtoForm.valid) {
      const requestCreateproduto: AdicionarProduto = {
        descricao: this.produtoForm.value.descricao as string,
        observacao: this.produtoForm.value.observacao as string,
        // fabricante: this.produtoForm.value.fabricante as bigint,
        // modelo: this.produtoForm.value.modelo as string,
        // unidadeVenda: this.produtoForm.value.unidadeVenda as bigint,
        precoCusto: this.produtoForm.value.precoCusto as number,
        estoque: this.produtoForm.value.estoque as number,
        codigoBarras: this.produtoForm.value.codigoBarras as string,
        precoVenda: this.produtoForm.value.precoVenda as number,
        margemLucro: this.produtoForm.getRawValue().margemLucro as number,
        empresa: this.produtoForm.getRawValue().empresa as number,
      };

      console.log(requestCreateproduto);

      this.produtoService
        .adicionarProduto(requestCreateproduto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Sucesso ao cadastrar produto:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso!',
              life: 3000,
            });

            // Resetar o formulário
            this.produtoForm.reset();

            // Voltar para a tabela
            this.showForm = false;

            // Recarregar os dados da tabela
            this.listarProdutos();
          },
          error: (error) => {
            console.error('Erro ao cadastrar produto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 3000,
            });
          },
        });
    } else {
      console.log('Formulário inválido. Preencha todos os campos.', this.produtoForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos!',
        life: 3000,
      });
    }
  }

  /**
   * Edita um produto existente.
   */
  editarProduto(): void {
    if (this.produtoForm?.valid) {
      const requestEditProduto: EditarProduto = {
        codigo: this.produtoForm.getRawValue().codigo as bigint,
        descricao: this.produtoForm.value.descricao as string,
        observacao: this.produtoForm.value.observacao as string,
        precoCusto: this.produtoForm.value.precoCusto as number,
        estoque: this.produtoForm.value.estoque as number,
        codigoBarras: this.produtoForm.value.codigoBarras as string,
        precoVenda: this.produtoForm.value.precoVenda as number,
        margemLucro: this.produtoForm.getRawValue().margemLucro as number,
        status: this.produtoForm.getRawValue().status as string,
        empresa: this.produtoForm.getRawValue().empresa as number,
      };

      console.log(requestEditProduto);
      // Chamar o serviço para editar o produto
      this.produtoService
        .editarProduto(requestEditProduto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              console.log('Sucesso ao editar usuário:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário editado com sucesso!',
                life: 3000,
              });
              this.produtoForm.reset();
              this.showForm = false;
              this.listarProdutos();
            }
          },
          error: (error) => {
            console.error('Erro ao editar produto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 3000,
            });
          },
        });
    } else {
      console.warn('Formulário inválido. Preencha todos os campos.', this.produtoForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos!',
        life: 3000,
      });
    }
  }

  /**
   * Desativa um usuário com o código fornecido.
   *
   * @param {bigint} codigo - Código do usuário a ser desativado.
   * @returns {void}
   */
  desativarProduto(codigo: bigint): void {
    console.log('Alterar o Status!:', codigo);
    if (codigo) {
      this.produtoService
        .desativarProduto(codigo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              console.log('Sucesso ao Alterar o Status!:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Status Alterado com sucesso!',
                life: 3000,
              });
              this.listarProdutos();
            }
          },
          error: (error) => {
            console.error('Erro ao Alterar o Status!:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.error,
              life: 3000,
            });
          },
        });
    } else {
      console.warn('Nenhum produto selecionado.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione um usuário!',
        life: 3000,
      });
    }
  }

  gerarCodigoBarras(): void {
    this.produtoService.gerarCodigoBarras().subscribe({
      next: (codigo) => {
        this.produtoForm.patchValue({
          codigoBarras: codigo,
        });
      },

      error: (error) => {
        console.error('>>> ERRO AO GERAR CÓDIGO:', error);
      },
    });
  }

  //ABERTURA DAS DIALOGS
  acaoEntradaEstoque() {
    console.log(this.produto?.codigo);
    this.mostrarTelaAcaoEntradaEstoque = true;
  }

  acaoSaidaEstoque() {
    console.log(this.produto?.codigo);
    this.mostrarTelaAcaoSaidaEstoque = true;
  }

  telaImpressaoEtiquetas(): void {
    this.mostrarTelaModuloImpressaoEtiquetas = true;
    this.listarProdutos();
  }

  pesquisarProduto(event: Event): void {
    console.log(this.produtoDatas);
    const termo = (event.target as HTMLInputElement).value.trim();

    this.valorPesquisa = termo;

    if (termo.length < 2) {
      this.resultadoPesquisa = [];
      return;
    }

    this.pesquisa$.next(termo);
  }

  imprimirEtiquetas(): void {
    const etiquetas: { [codigo: number]: number } = {};

    this.quantidadesEtiquetas.forEach((quantidade, codigo) => {
      if (quantidade > 0) {
        etiquetas[codigo] = quantidade;
      }
    });

    const request: ImpressaoEtiquetaRequest = {
      etiquetas,
    };

    this.produtoService.imprimirEtiquetas(request).subscribe({
      next: () => {
        console.log('Etiquetas enviadas para impressão');
        this.mostrarTelaModuloImpressaoEtiquetas = false;
      },
      error: (error) => {
        console.error('Erro ao imprimir etiquetas', error.error);
      },
    });
  }

  onContextMenu(event: any, produto: any) {
    this.produto = produto;
    this.cm.show(event);
  }

  onHide() {
    this.produtoSelecionado = null;
  }

  /**
   * Manipulador de eventos OnDestroy. Completa o subject de destruição.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
