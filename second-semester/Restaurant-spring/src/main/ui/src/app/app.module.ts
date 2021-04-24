import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./_helpers/error.interceptor";
import {MenuComponent} from './menu/menu.component';
import {OrdersComponent} from './orders/orders.component';
import {CommonModule} from "@angular/common";
import {AuthConfig, OAuthModule} from 'angular-oauth2-oidc';
import {AuthService} from "./_services/auth.service";
import {authConfig} from "./_services/auth-config";

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
        // AlertComponent,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [
        // {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: AuthConfig, useValue: authConfig}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
