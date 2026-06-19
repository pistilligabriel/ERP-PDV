import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteComponent } from './page/cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../libraries/primeng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { clienteRoute } from './cliente.routing';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(clienteRoute)
  ],
  declarations: [ClienteComponent],
  providers:[ MessageService,
    CookieService,
    ConfirmationService]
})
export class ClienteModule { }
