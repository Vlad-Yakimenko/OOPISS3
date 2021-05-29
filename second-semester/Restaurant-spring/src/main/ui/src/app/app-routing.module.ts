import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminGuard} from "./_helpers/admin.guard";
import {MenuComponent} from "./menu/menu.component";
import {OrdersComponent} from "./orders/orders.component";
import {MenuGuard} from "./_helpers/menu.guard";

const routes: Routes = [
    {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
    {path: 'menu', component: MenuComponent, canActivate: [MenuGuard]},
    {path: 'orders', component: OrdersComponent/*, canActivate: [MenuGuard]*/},
    {path: 'login', component: LoginComponent}
    // {path: '**', redirectTo: 'menu'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
