import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./component/login";
import { AdminComponent } from "./component/admin";
import { MenuComponent } from "./component/menu";
import { OrdersComponent } from "./component/orders";
import { AdminGuard, MenuGuard } from "./guard";

const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [MenuGuard] },
  { path: 'orders', component: OrdersComponent/*, canActivate: [MenuGuard]*/ },
  { path: 'login', component: LoginComponent }
  // { path: '**', redirectTo: 'menu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
