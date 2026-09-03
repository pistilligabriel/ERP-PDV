import { MessageService } from 'primeng/api';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { AuthRequest } from '../../models/Interfaces/usuario/auth/AuthRequest.interface';
import { UsuarioService } from '../../services/cadastro/usuario/usuario.service';
import { Usuario } from '../../models/Interfaces/usuario/Usuario.interface';
import { UsuarioContextService } from '../../services/cadastro/usuario/usuario-context.service';
import { IAlterarSenha } from '../../models/Interfaces/usuario/auth/IAlterarSenha.interface';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  loginCard = true;

  alterarSenha:boolean = false;

  usuarioLogin: AuthRequest = new AuthRequest();

  usuarioLogado!:Usuario;

  roles: string[] = ['ADMIN', 'USER'];

  public loginForm: FormGroup;
  public alterarSenhaForm: FormGroup;

  @Output() public closeModalEventEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private cookieService: CookieService,
    private router: Router,
    private usuarioContext: UsuarioContextService
  ) {

    this.loginForm = this.formBuilder.group({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.alterarSenhaForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['',[Validators.required]],
      newPassword: ['',[Validators.required]],
      confirmPassword: ['',Validators.required]
    })
  }

  ngOnInit(): void {}

  userLogin() {
  this.usuarioService
    .loginUser(this.usuarioLogin)
    .pipe(
      switchMap((response) => {
        this.cookieService.set('token', response.token);
        return this.usuarioService.getUsuarioLogado();
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (usuario) => {
        console.log('Usuário logado:', usuario);

        this.usuarioContext.setUsuario(usuario);

        this.loginForm.reset();
        this.router.navigate(['/home']);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Bem vindo!',
          life: 2000,
        });
      },
      error: (erro) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro.error,
          life: 2000,
        });
        console.error('Erro durante autenticação:', erro);
      },
    });
}

alterarPassword(){
  if(this.alterarSenhaForm.valid){
    const requestPayload:IAlterarSenha = {
      login:this.alterarSenhaForm.value.login,
      password:this.alterarSenhaForm.value.password,
      newPassword:this.alterarSenhaForm.value.newPassword,
      confirmPassword:this.alterarSenhaForm.value.confirmPassword,
    }

    this.usuarioService.alterarSenha(requestPayload)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if(response){
          this.messageService.add({
          severity: 'success',
          summary: 'Alteração de senha',
          detail: 'Alteração realizada com sucesso',
          life: 2000,
        });
        this.cancelar();
        }
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Alteração de senha',
          detail: 'Erro ao alterar senha \n'+ e.error,
          life: 2000,
        });
      }
    })
  }
}


cancelar() {
this.alterarSenhaForm.reset();
this.alterarSenha = false;
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
