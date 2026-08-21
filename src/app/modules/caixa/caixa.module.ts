import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from '../../libraries/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { CaixaComponent } from './caixa.component';
import { caixaRoutes } from './caixa.routing';



@NgModule({
  declarations: [
    CaixaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(caixaRoutes),
    PrimeNgModule,
    SharedModule
  ],
  providers: [MessageService,CookieService],
})
export class CaixaModule { }
