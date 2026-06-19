import { registerLocaleData } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
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
import { Produto } from '../../models/Interfaces/cadastro/produto/Produto.interface';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-venda',
  standalone: false,
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.scss'],
})
export class VendaComponent implements OnInit {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @ViewChild('tabelaProdutoDialog') tabelaProdutoDialog: Table | undefined;

  tipoVenda: 'ORÇAMENTO' | 'VENDA' | null = null;

  produtos: ProdutoVenda[] = [];

  codigoProduto!: bigint | null;

  lucro!: number;

  quantidade: number = 1;

  clientes!: Clientes[];

  cliente: Clientes | null = null;

  total: number = 0;

  totalSemDesconto: number = 0;

  porcentagemDesconto: number = 0;

  mostrarDialogProdutos: boolean = false;

  mostrarDesconto: boolean = false;

  descontoAplicado: number = 0;

  mostrarDialogClientes: boolean = false;

  tipoFinalizacaoVenda!: FormaPagamento | null;

  mostrarDialogCartaoPrazo: boolean = false;

  parcelas!: number | null;

  mostrarDialogQuantidade: boolean = false;

  usuario!: UsuarioPerfil;

  empresa!: Config;

  Tipo = Tipo;

  constructor(
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private pedidoService: VendaService,
    private messageService: MessageService,
    private router: Router,
    private vendaContext: VendaContextService,
    private configService: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.tipoVenda = this.vendaContext.getTipoVenda();

    if (!this.tipoVenda) {
      // Redirecione ou exiba alerta, se desejar
      console.warn('Tipo da venda não selecionado.');
    }

    this.clienteService.getAllCliente().subscribe((c) => {
      this.clientes = c;
    });

    this.produtoService.getAllProdutosVenda().subscribe((produtos) => {
      this.catalogo = produtos;
    });

    this.total = this.produtos.reduce((sum, p) => sum + p.precoVenda * p.quantidade, 0);

    console.log(this.catalogo);

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
  }

  valorPesquisa!: string;

  applyFilterGlobal($event: any, stringVal: any) {
    this.tabelaProdutoDialog!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Simulação de banco de produtos
  catalogo: ProdutoVenda[] = [];

  valorDesconto!: number | null;

  adicionarProduto() {
    if (!this.codigoProduto) return;

    const produtoCatalogo = this.catalogo?.find((p) => p.codigo === this.codigoProduto);

    if (produtoCatalogo) {
      const existente = this.produtos.find((p) => p.descricao === produtoCatalogo.descricao);
      if (existente) {
        const novaQuantidade = existente.quantidade + this.quantidade;
        if (produtoCatalogo.estoque !== null && novaQuantidade > produtoCatalogo.estoque) {
          alert('Quantidade solicitada maior que o estoque disponível!');
          return;
        }
        existente.quantidade = novaQuantidade;
      } else {
        const produtoConvertido = this.converterProdutoParaDto(produtoCatalogo);
        if (produtoConvertido.estoque !== null && produtoConvertido.estoque < this.quantidade) {
          alert('Quantidade solicitada maior que o estoque disponível!');
          return;
        } else {
          this.produtos.push(produtoConvertido);
        }
      }
      this.codigoProduto = null;
      this.quantidade = 1;
      this.atualizarTotal();
    } else {
      alert('Produto não encontrado!');
    }
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

  dinheiro() {
    this.tipoFinalizacaoVenda = FormaPagamento.DINHEIRO;
    this.finalizarVenda();
  }

  pix() {
    this.tipoFinalizacaoVenda = FormaPagamento.PIX;
    this.finalizarVenda();
  }

  cartaoCreditoAVista() {
    ((this.tipoFinalizacaoVenda = FormaPagamento.CARTAO_CREDITO_A_VISTA), this.finalizarVenda());
  }

  cartaoAPrazo() {
    ((this.tipoFinalizacaoVenda = FormaPagamento.CARTAO_PARCELADO),
      (this.mostrarDialogCartaoPrazo = false));
    setTimeout(() => {
      this.finalizarVenda();
    }, 500);
  }

  finalizarCondicional() {
    this.tipoFinalizacaoVenda = FormaPagamento.CONDICIONAL;
    this.finalizarVenda();
  }

  finalizarVenda() {
    if (this.produtos.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Adicione pelo menos um produto para finalizar a venda!',
        life: 4000,
      });
      return;
    }
    if (!this.cliente) {
      alert('Selecione um cliente para finalizar a venda!');
      return;
    }

    const produtosCorrigidos: ProdutoVenda[] = this.produtos.map((produto) => ({
      codigo: produto.codigo,
      descricao: produto.descricao,
      tipoProduto: produto.tipoProduto,
      observacao: produto.observacao ?? null,
      unidadeVenda: produto.unidadeVenda ?? null,
      fabricante: produto.fabricante ?? null,
      modelo: produto.modelo ?? '',
      precoVenda: produto.precoVenda ?? null,
      precoCusto: produto.precoCusto ?? null,
      estoque: produto.estoque ?? null,
      quantidade: produto.quantidade ?? 1,
    }));

    console.log(
      'Venda finalizada:',
      produtosCorrigidos,
      this.cliente,
      this.tipoFinalizacaoVenda,
      this.parcelas,
    );

    const pedido: PedidoDto = {
      clienteId: this.cliente!.codigo,
      formaPagamento: this.tipoFinalizacaoVenda!,
      tipoVenda: this.tipoVenda!,
      parcelas: this.parcelas,
      itens: this.produtos.map((p) => ({
        produtoId: Number(p.codigo),
        quantidade: p.quantidade,
        observacao: p.observacao ?? null,
      })),
    };
    this.pedidoService.criarPedido(pedido).subscribe(
      (response) => {
        console.log('Pedido criado com sucesso:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Pedido criado com sucesso!',
        });
        this.router.navigate(['/faturamento/modulo-vendas']);
        this.reset();
      },
      (error) => {
        console.error('Erro ao criar pedido:', error, pedido);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar pedido!',
        });
        this.reset();
      },
    );

    alert('Venda finalizada com sucesso!');
  }

  buscarProduto() {
    this.mostrarDialogProdutos = true; // ABRE O DIALOG
  }

  selecionarProduto(produto: Produto) {
    this.codigoProduto = produto.codigo;
    this.mostrarDialogProdutos = false;
    this.mostrarDialogQuantidade = true;
  }

  quantidadeItem() {
    this.adicionarProduto();
    this.mostrarDialogQuantidade = false;
    this.quantidade = 1;
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

  mostrarTelaCliente() {
    this.mostrarDialogClientes = true;
  }

  selecionarCliente(cliente: Clientes) {
    this.cliente = cliente;
    console.log(cliente);
    this.mostrarDialogClientes = false;
  }

  cartaoDebito() {
    ((this.tipoFinalizacaoVenda = FormaPagamento.CARTAO_DEBITO), this.finalizarVenda());
  }

  reset() {
    this.produtos = [];
    this.total = 0;
    this.totalSemDesconto = 0; // Resetando o total sem desconto
    this.descontoAplicado = 0;
    this.cliente = null;
    this.tipoFinalizacaoVenda = null;
    this.parcelas = null;
  }

  converterProdutoParaDto(produto: any): ProdutoVenda {
    return {
      descricao: produto.descricao ?? null,
      tipoProduto: produto.tipoProduto ?? null,
      precoVenda: produto.precoVenda ?? null,
      precoCusto: produto.precoCusto ?? null,
      unidadeVenda: produto.unidadeVenda?.codigo ?? null,
      fabricante: produto.fabricante?.codigo ?? null,
      quantidade: this.quantidade,
      modelo: produto.modelo ?? null,
      codigo: produto.codigo,
      estoque: produto.estoque,
      observacao: produto.observacao,
    };
  }

  cancelarVenda() {
    this.produtos = [];
    this.tipoVenda = null;
    this.total = 0;
    this.totalSemDesconto = 0; // Resetando o total sem desconto
    this.descontoAplicado = 0;
    this.cliente = null;
    this.tipoFinalizacaoVenda = null;
    this.parcelas = null;
    this.router.navigate(['/home']);
  }

  clearPesquisa() {
    this.valorPesquisa = '';
    this.tabelaProdutoDialog?.reset();
  }
}
