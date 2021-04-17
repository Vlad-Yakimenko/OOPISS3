import { NgModule } from '@angular/core';
import { 
  RouterModule, Routes 
} from '@angular/router';

import { AuthGuard, AdminGuard } from './guard';
import { HomeComponent } from './component/home';
import { LoginComponent } from './component/login';
import { RegisterComponent } from './component/register';
import { UsersComponent } from './component/users';
import { TariffsComponent } from './component/tariffs';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tariffs', component: TariffsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
