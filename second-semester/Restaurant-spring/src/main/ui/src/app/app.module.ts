import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { 
  HTTP_INTERCEPTORS, HttpClientModule 
} from "@angular/common/http";
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login';
import { AdminComponent } from './component/admin';
import { MenuComponent } from './component/menu';
import { OrdersComponent } from './component/orders';
import { ErrorInterceptor } from "./interceptor";
import { authConfig } from "./config";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    MenuComponent,
    OrdersComponent
  ],
  imports: [
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8080/'],
        sendAccessToken: true
      }
    }),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: ErrorInterceptor, 
      multi: true 
    },
    { 
      provide: AuthConfig, 
      useValue: authConfig 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
