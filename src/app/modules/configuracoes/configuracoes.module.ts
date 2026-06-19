import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ConfigComponent } from './configuracoes.component';
import { configRoutes } from './configuracoes.routing';
import { PrimeNgModule } from '../../libraries/primeng.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(configRoutes),
    PrimeNgModule,
    SharedModule
  ],
  providers: [MessageService,CookieService],
})
export class ConfigModule { }
