import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNgModule } from '../../../libraries/primeng.module';
import { MarcaRoutes } from './marca.routing';
import { MarcaComponent } from './page/marca.component';
import { SharedModule } from '../../../shared/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SharedModule,
    RouterModule.forChild(MarcaRoutes)
  ],
  declarations: [
    MarcaComponent,
  ],
  providers: [
    MessageService,
    CookieService,
    ConfirmationService
  ],
})
export class MarcaModule { }
