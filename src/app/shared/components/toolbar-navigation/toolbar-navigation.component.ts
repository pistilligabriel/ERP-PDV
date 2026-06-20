import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Config } from '../../../models/Interfaces/config/config.interface';
import { Usuario } from '../../../models/Interfaces/usuario/Usuario.interface';
import { UsuarioService } from '../../../services/cadastro/usuario/usuario.service';
import { UsuarioContextService } from '../../../services/cadastro/usuario/usuario-context.service';
import { ConfigurationService } from '../../../services/configuration/configuration.service';
import { VendaDialogService } from '../../../services/faturamento/venda/VendaDialogService.service';

@Component({
  selector: 'app-toolbar-navigation',
  standalone: false,
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.css'],
})
export class ToolbarNavigationComponent implements OnInit, OnDestroy {
  goHome() {
    this.router.navigate(['/home']);
  }

  private destroy$: Subject<void> = new Subject<void>();

  logo: File | string = 'assets/default-logo.png';

  nomeEmpresa: string = '';

  infoConfig!: Config;

  items: MenuItem[] | undefined;

  usuarioLogado!: Usuario | null;

  constructor(
    private cookie: CookieService,
    private router: Router,
    private usuarioService: UsuarioService,
    private usuarioContext: UsuarioContextService,
    private configService: ConfigurationService,
    private vendaDialogService: VendaDialogService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/home'],
      },
      {
        label: 'Cadastro',
        icon: 'pi pi-fw pi-file-edit',
        items: [
          {
            label: 'Usuário',
            routerLink: ['/usuario'],
          },
          {
            label: 'Cliente',
            routerLink: ['/cliente'],
          },
          {
            label: 'Produto',
            routerLink: ['/produto'],
          },
          {
            label: 'Unidade Medida',
            routerLink: ['/unidade-medida'],
          },
          {
            label: 'Marca',
            routerLink: ['/marca'],
          },
        ],
      },
      {
        label: 'Faturamento',
        icon: 'pi pi-fw pi-money-bill',
        items: [
          {
            label: 'Venda',
            icon: 'pi pi-fw pi-cart-plus',
            routerLink: ['/faturamento/modulo-vendas'],
          },
          // {
          //   label: 'Estoque',
          //   icon: 'pi pi-fw pi-box',
          //   routerLink: ['/billing/stock'],
          // },
        ],
      },
      // {
      //   label: 'Financeiro',
      //   icon: 'pi pi-fw pi-calculator',
      //   items: [
      //     {
      //       label: 'Titulo',
      //       items: [
      //         {
      //           label: 'Receber',
      //           routerLink: ['/financial/account/receive'],
      //         },
      //         {
      //           label: 'Pagar',
      //           routerLink: ['/financial/account/pay'],
      //         },
      //       ],
      //     },
      //     {
      //       label: 'Movimentação',
      //       items: [
      //         {
      //           label: 'Entrada',
      //           routerLink: ['/financial/movement/entry'],
      //         },
      //         {
      //           label: 'Saída',
      //           routerLink: ['/financial/movement/exit'],
      //         },
      //       ],
      //     }
      //   ],
      // },
      {
        label: 'Configuração',
        icon: 'pi pi-fw pi-database',
        routerLink: ['/configuracoes'],
      },
    ];

    this.configService.empresa$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (config) => {
        if (config) {
          this.nomeEmpresa = config.nomeEmpresa;

          if (config.logo) {
            this.logo = config.logo;
          } else {
            this.obterInformacoes();
          }
        } else {
          this.getNomeEmpresa();
          this.obterInformacoes();
        }

        this.cd.detectChanges();
      },
    });

    this.usuarioContext
      .getUsuario()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (usuario) => {
          this.usuarioLogado = usuario;
        },
      });
  }

  venda() {
    if (this.cookie.check('token')) {
      this.router.navigate(['/faturamento/modulo-vendas']).then(() => {
        setTimeout(() => {
          this.vendaDialogService.abrirDialog();
        });
      });
    } else {
      void this.router.navigate(['/login']);
    }
  }

  handleLogout(): void {
    console.log(this.usuarioLogado?.codigo);
    if (this.usuarioLogado && this.usuarioLogado.codigo !== undefined) {
      this.usuarioService
        .logoutUser(this.usuarioLogado.codigo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Token deletado com sucesso', response);
          },
          error: (e) => {
            console.error('Não foi possível deletar token', e);
          },
        });
    }
    // Limpar todos os dados de autenticação
    this.cookie.delete('token');

    // Limpar localStorage se houver dados salvos
    localStorage.clear();

    // Limpar sessionStorage se houver dados salvos
    sessionStorage.clear();

    // Forçar reload da página para limpar qualquer estado em memória
    window.location.href = '/login';
  }

getNomeEmpresa(): void {

  this.configService.getConfig()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (config) => {

        this.nomeEmpresa = config.nomeEmpresa;

        this.cd.detectChanges();

      },
      error: (error) => {

        console.error(
          'Erro ao buscar configuração da empresa',
          error
        );

      }
    });

}

  obterInformacoes(): void {

  this.configService.getLogo()
    .pipe(takeUntil(this.destroy$))
    .subscribe({

      next: (blob) => {

        const reader = new FileReader();


        reader.onload = () => {

          this.logo = reader.result as string;

          this.cd.detectChanges();

        };


        reader.onerror = () => {

          this.logo = 'assets/default-logo.png';

          this.cd.detectChanges();

        };


        reader.readAsDataURL(blob);

      },


      error: (error) => {

        console.error(
          'Erro ao carregar logo',
          error
        );

        this.logo = 'assets/default-logo.png';

        this.cd.detectChanges();

      }

    });

}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
