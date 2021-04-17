import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home';
import { ErrorInterceptor, JwtInterceptor } from './interceptor';
import { LoginComponent } from './component/login';
import { RegisterComponent } from './component/register';
import { UsersComponent } from './component/users';
import { UserComponent } from './component/users/user/user.component';
import { TariffsComponent } from './component/tariffs/tariffs.component';
import { TariffComponent } from './component/tariffs/tariff/tariff.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserComponent,
    TariffsComponent,
    TariffComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
