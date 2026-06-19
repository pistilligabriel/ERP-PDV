import { BrowserModule } from "@angular/platform-browser"
import { AppComponent } from "./app"
import { PrimeNgModule } from "./libraries/primeng.module"
import { FooterComponent } from "./modules/footer/footer.component"
import { LoginComponent } from "./modules/login/login.component"
import { PageNotFoundComponent } from "./modules/page-not-found/page-not-found.component"
import { AppRoutingModule } from "./app-routing.module"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { CookieService } from "ngx-cookie-service"
import { ConfirmationService, MessageService } from "primeng/api"
import { LOCALE_ID, NgModule } from "@angular/core"
import { providePrimeNG } from "primeng/config"
import Lara from '@primeuix/themes/lara';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    FooterComponent,
  ],
  imports: [
    PrimeNgModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],

  providers: [
    CookieService,
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
