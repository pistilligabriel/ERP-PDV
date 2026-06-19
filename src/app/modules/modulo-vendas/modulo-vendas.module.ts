import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { moduloVendaRouting } from './modulo-vendas.routing';
import { PrimeNgModule } from '../../libraries/primeng.module';
import { ModuloVendasComponent } from './modulo-vendas.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(moduloVendaRouting)
  ],
  declarations: [
    ModuloVendasComponent
  ],
  providers:[ MessageService,
    CookieService,
    ConfirmationService]
})
export class ModuloVendasModule { }
