import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../libraries/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    ToolbarNavigationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrimeNgModule
  ],
  exports: [ToolbarNavigationComponent],
  providers: [DialogService, CurrencyPipe],
})
export class SharedModule { }
