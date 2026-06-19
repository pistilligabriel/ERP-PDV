import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioRoutes } from './usuario.routing';
import { UsuarioComponent } from './page/usuario.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { PrimeNgModule } from '../../../libraries/primeng.module';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(UsuarioRoutes)
  ],
  declarations: [
    UsuarioComponent,
  ],
  providers: [
    MessageService,
    CookieService,
    ConfirmationService
  ],
})
export class UsuarioModule { }
