import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './home.routing';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { PrimeNgModule } from '../../libraries/primeng.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(homeRoutes),
    PrimeNgModule,
    SharedModule
  ],
  providers: [MessageService,CookieService],
})
export class HomeModule { }
