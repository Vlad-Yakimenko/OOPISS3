import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard, UserGuard } from "./guard";
import { LoginComponent } from "./component/login";
import { AdminComponent } from "./component/admin";
import { MenuComponent } from "./component/menu";
import { OrdersComponent } from "./component/orders";
import { HomeComponent } from './component/home';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [UserGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [UserGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [UserGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
