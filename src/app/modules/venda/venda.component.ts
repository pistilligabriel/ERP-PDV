import { registerLocaleData } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { ProdutoVenda } from '../../models/Interfaces/pedido/ProdutoVenda.interface';
import { Clientes } from '../../models/Interfaces/cadastro/clientes/Clientes.interface';
import { FormaPagamento } from '../../models/Enum/pedido/FormaPagamento.enum';
import { UsuarioPerfil } from '../../models/Interfaces/usuario/UsuarioPerfil.interface';
import { Config } from '../../models/Interfaces/config/config.interface';
import { Tipo } from '../../models/Enum/usuario/Tipo.enum';
import { ProdutoService } from '../../services/cadastro/produto/produto.service';
import { UsuarioService } from '../../services/cadastro/usuario/usuario.service';
import { ClienteService } from '../../services/cadastro/cliente/cliente.service';
import { VendaService } from '../../services/faturamento/venda/venda.service';
import { VendaContextService } from '../../services/faturamento/venda/venda-context.service';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { TipoProduto } from '../../models/Enum/pedido/TipoProduto.enum';
import { PedidoDto } from '../../models/Interfaces/pedido/PedidoDto.interface';
import { Status } from '../../models/Enum/Status.enum';
import { debounceTime, distinctUntilChanged } from 'rxjs';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-venda',
  standalone: false,
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.scss'],
})
export class VendaComponent implements OnInit {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private pesquisa$ = new Subject<string>();

  tipoVenda: 'ORÇAMENTO' | 'VENDA' | null = null;

  produtos: ProdutoVenda[] = [];

  resultadoPesquisa: ProdutoVenda[] = [];

  produtoSelecionado: ProdutoVenda | null = null;

  codigoBarras: string = '';

  lucro!: number;

  quantidade: number = 1;

  clientes!: Clientes[];

  cliente: Clientes | null = null;

  nomeCliente: string | null = null;

  total: number = 0;

  totalSemDesconto: number = 0;

  porcentagemDesconto: number = 0;

  mostrarDialogProdutos: boolean = false;

  mostrarDesconto: boolean = false;

  descontoAplicado: number = 0;

  mostrarDialogClientes: boolean = false;

  tipoFinalizacaoVenda!: FormaPagamento | null;

  mostrarDialogCartaoPrazo: boolean = false;

  parcelas!: number;

  mostrarDialogQuantidade: boolean = false;

  usuario!: UsuarioPerfil;

  empresa!: Config;

  Tipo = Tipo;

  FormaPagamento = FormaPagamento;

  constructor(
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private pedidoService: VendaService,
    private messageService: MessageService,
    private router: Router,
    private vendaContext: VendaContextService,
    private configService: ConfigurationService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.tipoVenda = 'VENDA';
    this.nomeCliente = this.vendaContext.getNomeCliente();
    console.log('Nome cliente:', this.nomeCliente);

    if (!this.tipoVenda) {
      // Redirecione ou exiba alerta, se desejar
      console.warn('Tipo da venda não selecionado.');
    }

    this.carregarClientes();

    this.total = this.produtos.reduce((sum, p) => sum + p.precoVenda * p.quantidade, 0);

    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (err) => {
        console.log('Não foi possível obter usuario logado', err);
      },
    });

    this.configService
      .getConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          this.empresa = config;
        },
        error: (e) => {
          console.log('Não foi possível obter a configuração da empresa', e);
        },
      });

    this.pesquisa$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termo) => this.produtoService.pesquisar(termo)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (produtos) => {
          this.resultadoPesquisa = produtos as ProdutoVenda[];
          this.cd.detectChanges();
        },
        error: () => {
          this.resultadoPesquisa = [];
        },
      });
  }

  valorPesquisa: string = '';

  valorDesconto!: number | null;

  adicionarProduto(produto: ProdutoVenda): void {
    const existente = this.produtos.find((p) => p.codigo === produto.codigo);

    if (existente) {
      const novaQuantidade = existente.quantidade + this.quantidade;

      if (produto.estoque != null && novaQuantidade > produto.estoque) {
        alert('Quantidade maior que o estoque disponível.');

        return;
      }

      existente.quantidade = novaQuantidade;
    } else {
      if (produto.estoque != null && this.quantidade > produto.estoque) {
        alert('Quantidade maior que o estoque disponível.');

        return;
      }
      this.produtos.push({
        ...produto,
        quantidade: this.quantidade,
      });
    }

    this.atualizarTotal();
  }

  removerProduto(codigo: bigint) {
    this.produtos = this.produtos.filter((p) => p.codigo !== codigo);
    this.atualizarTotal();
  }

  atualizarTotal() {
    const totalBruto = this.produtos.reduce((sum, p) => sum + p.precoVenda * p.quantidade, 0);
    this.total = totalBruto - this.descontoAplicado;
    this.totalSemDesconto = totalBruto; //Atualiza o total sem desconto
  }

  cartaoAPrazo(): void {
    if (!this.parcelas || this.parcelas < 2) {
      alert('Informe uma quantidade válida de parcelas.');
      return;
    }

    const pedido = this.montarPedido(FormaPagamento.CARTAO_PARCELADO);

    this.pedidoService.salvarPedido(pedido).subscribe({
      next: () => {
        this.mostrarDialogCartaoPrazo = false;
        this.limparVenda();
        this.messageService.add({
          summary:'Venda realizada com sucesso!',
          severity:'success',
          life:3000
        })
      },
      error: () => {
        this.messageService.add({
          summary:'Erro ao finalizar venda!',
          severity:'warn',
          life:3000
        })
      },
    });
  }

  private validarVenda(): boolean {
    if (!this.produtos.length) {
      this.messageService.add({
        severity: 'warn',

        summary: 'Venda',

        detail: 'Adicione produtos.',
      });

      return false;
    }

    if (!this.cliente && (!this.nomeCliente || !this.nomeCliente.trim())) {
      this.messageService.add({
        severity: 'warn',

        summary: 'Venda',

        detail: 'Selecione um cliente.',
      });

      return false;
    }

    return true;
  }

  private limparVenda(): void {
    this.produtos = [];

    this.total = 0;

    this.descontoAplicado = 0;

    this.valorDesconto = 0;

    this.cliente = null;

    this.parcelas = 1;

    this.codigoBarras = '';

    this.quantidade = 1;

    this.produtoSelecionado = null;

    this.mostrarDialogProdutos = false;

    this.mostrarDialogClientes = false;

    this.mostrarDialogCartaoPrazo = false;

    this.mostrarDialogQuantidade = false;
    this.resultadoPesquisa = [];

    this.valorPesquisa = '';

    this.totalSemDesconto = 0;

    this.porcentagemDesconto = 0;
  }

  finalizarCondicional(): void {
    if (!this.validarVenda()) {
      return;
    }

    const request = this.montarPedido(FormaPagamento.CONDICIONAL);

    this.concluirVenda(request);
  }

  private concluirVenda(request: PedidoDto): void {
    this.pedidoService
      .salvarPedido(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',

            summary: 'Venda',

            detail: 'Venda realizada com sucesso.',
          });

          this.limparVenda();
        },

        error: () => {
          this.messageService.add({
            severity: 'error',

            summary: 'Erro',

            detail: 'Erro ao finalizar venda.',
          });
        },
      });
  }

  finalizarPorPagamento(forma: FormaPagamento): void {
    if (!this.validarVenda()) {
      return;
    }

    const request = this.montarPedido(forma);

    this.concluirVenda(request);

    this.router.navigate(['/home']);

  }

  private montarPedido(formaPagamento: FormaPagamento): PedidoDto {
    const nomeCliente = this.nomeCliente?.trim() || null;

    if (!this.cliente && !nomeCliente) {
      throw new Error('Informe o nome do cliente ou selecione um cliente cadastrado.');
    }

    return {
      clienteId: this.cliente?.codigo ?? null,

      nomeCliente: nomeCliente,

      formaPagamento,

      tipoVenda: 'VENDA',

      parcelas: formaPagamento === FormaPagamento.CARTAO_PARCELADO ? this.parcelas : null,

      itens: this.produtos.map((produto) => ({
        produtoId: produto.codigo,
        quantidade: produto.quantidade,
        observacao: null,
      })),
    };
  }

  carregarProdutos() {
    this.produtoService
      .getAllProdutosVenda()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.resultadoPesquisa = response;
            this.cd.detectChanges();
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Produto',
            detail: 'ProdutoS não encontrados.',
          });
        },
      });
  }

  pesquisarProduto(event: Event): void {
    console.log(this.produtos);
    const termo = (event.target as HTMLInputElement).value.trim();

    this.valorPesquisa = termo;

    if (termo.length < 2) {
      this.resultadoPesquisa = [];
      return;
    }

    this.pesquisa$.next(termo);
  }

  buscarProduto(): void {
    this.valorPesquisa = '';

    this.resultadoPesquisa = [];

    this.mostrarDialogProdutos = true;

    this.carregarProdutos();
  }

  selecionarProduto(produto: ProdutoVenda): void {
    this.produtoSelecionado = produto;

    this.quantidade = 1;

    this.mostrarDialogProdutos = false;

    this.mostrarDialogQuantidade = true;
  }

  quantidadeItem(): void {
    if (!this.produtoSelecionado) {
      return;
    }

    this.adicionarProduto(this.produtoSelecionado);

    this.produtoSelecionado = null;
    this.quantidade = 1;
    this.mostrarDialogQuantidade = false;
  }

  mostrarTelaDesconto() {
    this.mostrarDesconto = true;
  }

  mostrarTelaCartaoPrazo() {
    this.mostrarDialogCartaoPrazo = true;
  }

  aplicarDesconto() {
    // Aplica o desconto ao confirmar
    const totalBruto = this.produtos.reduce((sum, p) => sum + p.precoVenda * p.quantidade, 0);
    this.descontoAplicado = this.valorDesconto ? totalBruto * (this.valorDesconto / 100) : 0;
    this.porcentagemDesconto = (this.descontoAplicado / totalBruto) * 100;
    this.mostrarDesconto = false;
    this.atualizarTotal();
  }

  mostrarTelaCliente(): void {
    // Se existe cliente informado manualmente,
    // não permite selecionar cliente cadastrado.
    if (this.nomeCliente?.trim()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cliente',
        detail: 'Esta venda já possui um cliente informado.',
      });

      return;
    }

    this.mostrarDialogClientes = true;
  }

  carregarClientes() {
    this.clienteService
      .getAllCliente()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.clientes = response;
            this.cd.detectChanges();
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Clientes',
            detail: 'Clientes não encontrado.',
          });
        },
      });
  }

  selecionarCliente(cliente: Clientes): void {
    this.cliente = cliente;

    // Se selecionar um cliente cadastrado,
    // não deve existir nome de cliente avulso.
    this.nomeCliente = '';

    this.mostrarDialogClientes = false;
  }

  reset() {
    this.limparVenda();
  }

  cancelarVenda(): void {
    this.limparVenda();

    this.tipoVenda = null;

    this.router.navigate(['/home']);
  }

  clearPesquisa(): void {
    this.valorPesquisa = '';

    this.resultadoPesquisa = [];
  }

  buscarProdutoPorCodigoBarras(): void {
    if (!this.codigoBarras.trim()) {
      return;
    }

    this.produtoService
      .buscarPorCodigoBarras(this.codigoBarras)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (produto) => {
          this.quantidade = 1;

          this.adicionarProduto(produto);

          this.codigoBarras = '';

          this.cd.detectChanges();
        },

        error: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Produto',
            detail: 'Produto não encontrado.',
          });
        },
      });
  }
}
