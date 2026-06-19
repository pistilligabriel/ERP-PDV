import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UnidadeMedidaComponent } from './page/unidade-medida.component';
import { UnidadeMedidaRoutes } from './unidade-medida.routing';
import { PrimeNgModule } from '../../../libraries/primeng.module';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(UnidadeMedidaRoutes)
  ],
  declarations: [
    UnidadeMedidaComponent,
  ],
  providers: [
    MessageService,
    CookieService,
    ConfirmationService
  ],
})
export class UnidadeMedidaModule { }
