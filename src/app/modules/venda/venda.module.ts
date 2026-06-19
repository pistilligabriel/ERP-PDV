import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { vendaRoute } from './venda.routing';
import { VendaComponent } from './venda.component';
import { PrimeNgModule } from '../../libraries/primeng.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(vendaRoute)
  ],
  declarations: [
    VendaComponent,
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
})
export class VendaModule { }
