import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminGuard} from "./_helpers/admin.guard";
import {HomeGuard} from "./_helpers/home.guard";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
    {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
    {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
