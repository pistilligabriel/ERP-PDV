import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from '../../../../models/Interfaces/usuario/Usuario.interface';
import { Config } from '../../../../models/Interfaces/config/config.interface';
import { UsuarioService } from '../../../../services/cadastro/usuario/usuario.service';
import { UsuarioContextService } from '../../../../services/cadastro/usuario/usuario-context.service';


@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrls: [],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  usuario!: Usuario;

  config!: Config;

  constructor(
    private service: UsuarioService,
    private usuarioContext: UsuarioContextService
  ) {}

  ngOnInit(): void {
    this.service.getUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log(this.usuario);
        this.usuarioContext.setUsuario(this.usuario);
      },
      error: (e) => {
        console.log('Não foi possível obter o usuário logado', e);
      },
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
