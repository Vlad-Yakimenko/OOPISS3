import { Injectable } from '@angular/core';
import { 
  Router, CanActivate, 
  ActivatedRouteSnapshot, RouterStateSnapshot 
} from '@angular/router';

import { AuthenticationService } from '../service';
import { Role } from '../shared/enum';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role === Role.Admin) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}