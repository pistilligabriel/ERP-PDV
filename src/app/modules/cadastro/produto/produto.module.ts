import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { produtoRoute } from './produto.routing';
import { ProdutoComponent } from './produto.component';
import { PrimeNgModule } from '../../../libraries/primeng.module';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(produtoRoute)
  ],
  declarations: [
    ProdutoComponent,
  ],
  providers: [
    MessageService,
    CookieService,
    ConfirmationService
  ],
})
export class ProdutoModule { }
